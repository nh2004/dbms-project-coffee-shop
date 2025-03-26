const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const queryRoutes = require("./routes/queryRoutes");
const pool = require("./config/db"); // Ensure your database configuration is imported

const app = express();
dotenv.config({ path: './.env' });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", queryRoutes);

// 404 Route Handling
app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
});

// Generate SQL Query Endpoint
app.post("/api/generate", async (req, res) => {
    const { query } = req.body;
    console.log("User Query:", query);

    if (!query || query.trim() === "") {
        return res.status(400).json({ success: false, error: "Query cannot be empty." });
    }

    if (query.length > 1000) {
        return res.status(400).json({ success: false, error: "Query is too long." });
    }

    const prompt = `Convert this natural language request into an optimized MySQL query given the tables. Remember to just give the query that I can run on SQL no extra text or characters such as '''
   1.orders (row_id, order_id, created_at, item_id, quantity, cust_name, in_or_out)
   2.items (item_id, sku, item_name, item_cat, item_size, item_price)
   3.recipe (row_id, recipe_id, ing_id, quantity)
   4.ingredients (ing_id, ing_name, ing_weight, ing_meas, ing_price)
   5.inventory (inv_id, ing_id, quantity)
   6.staff (staff_id, first_name, last_name, position, sal_per_hour)
   7.shift (shift_id, day_of_week, start_time, end_time)
   8.rota (row_id, rota_id, date, shift_id, staff_id)"${query}"`;

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

        let generatedSQL = response.data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Invalid SQL Query";
        generatedSQL = generatedSQL.replace(/```sql|```/g, '').trim();
        console.log("Generated SQL Query:", generatedSQL);

        if (!generatedSQL.toLowerCase().startsWith("select")) {
            return res.status(400).json({ success: false, error: "Generated query is not a SELECT statement." });
        }

        // Execute the SQL query using a callback
        pool.query(generatedSQL, (error, results, fields) => {
            if (error) {
                console.error("MySQL Error:", error);
                return res.status(500).json({ success: false, error: "Error executing SQL query." });
            }
            console.log("SQL Query Result:", results);
            res.json({ success: true,sqlQuery: generatedSQL, sqlResult: results });
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error.response) {
            res.status(error.response.status).json({ success: false, error: error.response.data.error });
        } else {
            res.status(500).json({ success: false, error: "Error generating SQL query." });
        }
    }
});

// Describe Endpoint
app.post("/api/describe", async (req, res) => {
    const { tableData } = req.body;
    console.log("Table Data:", tableData);

    if (!tableData || tableData.length === 0) {
        return res.status(400).json({ success: false, description: "No data available to describe." });
    }

    const prompt = `Describe the following SQL table based on its data structure and content so as to explain a project evaluator very simply, in very short, what this table is showing. Keep your response limited to 50 words: ${JSON.stringify(tableData)}`;

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

        const aiDescription = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No description available.";
        res.json({ success: true, description: aiDescription });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ success: false, description: "Error generating description." });
    }
});

module.exports = app;