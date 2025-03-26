const { exec } = require('child_process');
const axios = require('axios');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

// Promisify the exec and unlink functions
const execAsync = promisify(exec);
const unlinkAsync = promisify(fs.unlink);

function cleanPythonCode(pythonCode) {
    // Remove any leading or trailing backticks and language specifiers
    pythonCode = pythonCode.replace(/^```python|```$/g, '').trim();

    const lines = pythonCode.split('\n');
    const importIndex = lines.findIndex(line => line.trim().startsWith('import'));
    const savefigIndex = lines.findIndex(line => line.includes('plt.savefig("chart.png")'));

    if (importIndex !== -1 && savefigIndex !== -1) {
        const cleanedLines = lines.slice(importIndex, savefigIndex + 1);
        return cleanedLines.join('\n');
    }

    return pythonCode;
}

exports.getDescription = async (req, res) => {
    const { tableData } = req.body;
    console.log(tableData);

    if (!tableData || tableData.length === 0) {
        return res.status(400).json({ description: "No data available to describe." });
    }

    const prompt = `
    Generate a Python script using Matplotlib to visualize the following table data. The script should:
    - Only include the necessary import statements and code to generate the visualization.
    - Save the visualization as 'chart.png' in the specified directory: '/home/nilasish/coffee_shop_inventory/backend/src/controllers/output'.
    - Exclude any comments, extra strings, or unnecessary characters.
    - Do not include plt.show() or any other display commands.
    - Ensure the code is directly runnable without modifications.

    Table Data:
    ${JSON.stringify(tableData)}
    `;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        let pythonCode = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!pythonCode) {
            return res.status(500).json({ description: "No valid Python code received." });
        }

        pythonCode = cleanPythonCode(pythonCode);
        console.log("Generated Python Code:", pythonCode);

        const tempFilePath = path.join(__dirname, 'temp_visualization.py');
        fs.writeFileSync(tempFilePath, pythonCode);

        // Ensure the output directory exists
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        try {
            await execAsync(`python3 ${tempFilePath}`);
            const imagePath = path.join(outputDir, 'chart.png');
            res.sendFile(imagePath, async (err) => {
                if (err) {
                    console.error('Error sending image:', err);
                    return res.status(500).send('Error sending image');
                }
                console.log('Image sent successfully');

                try {
                    await unlinkAsync(tempFilePath);
                    await unlinkAsync(imagePath);
                    console.log('Temporary files deleted successfully');
                } catch (unlinkError) {
                    console.error('Error deleting temporary files:', unlinkError);
                }
            });
        } catch (execError) {
            console.error(`Error executing Python script: ${execError}`);
            await unlinkAsync(tempFilePath).catch(err => console.error('Error deleting temp file:', err));
            res.status(500).send('Error generating chart');
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ description: "Error generating description." });
    }
};