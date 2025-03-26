import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Import the Modal component
import "../components/ResultDisplay.css";
import "hover.css/css/hover-min.css"; // Import Hover.css

const ResultDisplay = ({ selectedQuery, naturalLanguageQuery }) => {
    const [result, setResult] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [tableError, setTableError] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [descLoading, setDescLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDescription = async (tableData) => {
            setDescLoading(true);
            setImageError(null);
            try {
                const response = await fetch("http://localhost:5000/api/describe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tableData })
                });

                if (!response.ok) {
                    throw new Error("Failed to generate image.");
                }

                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
            } catch (err) {
                console.error("Image fetch error:", err);
                setImageError("Failed to generate image.");
            } finally {
                setDescLoading(false);
            }
        };

        const fetchResults = async (url, options) => {
            setLoading(true);
            setTableError(null);
            setImageUrl(null);

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                if (!data.success) {
                    setTableError("Failed to fetch results.");
                } else if (!data.sqlResult || data.sqlResult.length === 0) {
                    setTableError("No results found.");
                    setResult([]);
                } else {
                    setResult(data.sqlResult);
                    fetchDescription(data.sqlResult);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setTableError("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedQuery) {
            fetchResults(`http://localhost:5000/api/query?key=${encodeURIComponent(selectedQuery)}`);
        } else if (naturalLanguageQuery) {
            fetchResults(`http://localhost:5000/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: naturalLanguageQuery })
            });
        }
    }, [naturalLanguageQuery, selectedQuery]);

    return (
        <div className="result-container">
            <div className="result-content">
                {/* Table Section */}
                <div className="table-box">
                    {loading ? (
                        <p className="loading-text">Fetching data...</p>
                    ) : tableError ? (
                        <p className="error-message">{tableError}</p>
                    ) : result.length > 0 ? (
                        <table className="result-table">
                            <thead>
                                <tr>
                                    {Object.keys(result[0]).map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((val, colIndex) => (
                                            <td key={colIndex}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="placeholder-text">Select a query to see results...</p>
                    )}
                </div>
    
                {/* Image Section */}
                <div className="description-box">
                    <h3> Here's a visualization (click to zoom) </h3>
                    {descLoading ? (
                        <p className="loading-text">Generating image...</p>
                    ) : imageError ? (
                        <p className="error-message">{imageError}</p>
                    ) : imageUrl ? (
                        <img
                            className="description-img hvr-grow"
                            src={imageUrl}
                            alt="Generated Chart"
                            onClick={() => setIsModalOpen(true)}
                        />
                    ) : (
                        <p>No image available.</p>
                    )}
                </div>
            </div>

            {/* Modal for Image */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <img src={imageUrl} alt="Generated Chart" style={{ maxWidth: '100%', height: 'auto' }} />
            </Modal>
        </div>
    );
};

export default ResultDisplay;