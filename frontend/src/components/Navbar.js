import React, { useState } from "react";
import "../components/Navbar.css";

const Navbar = ({ onQuerySelect, onQuerySubmit }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [inputQuery, setInputQuery] = useState("");

    const entities = [
        {
            name: "Ingredients",
            queries: [
                { key: "name", text: "Name the student with id 3" },
                { key: "cs", text: "Name the student who is in CS" },
                { key: "query1C", text: "Query 1C" },
                { key: "query1D", text: "Query 1D" },
                { key: "query1E", text: "Query 1E" },
            ],
        },
        {
            name: "Sales",
            queries: [
                { key: "query2A", text: "Query 2A" },
                { key: "query2B", text: "Query 2B" },
                { key: "query2C", text: "Query 2C" },
                { key: "query2D", text: "Query 2D" },
                { key: "query2E", text: "Query 2E" },
            ],
        },
        {
            name: "Employees",
            queries: [
                { key: "query3A", text: "Query 3A" },
                { key: "query3B", text: "Query 3B" },
                { key: "query3C", text: "Query 3C" },
                { key: "query3D", text: "Query 3D" },
                { key: "query3E", text: "Query 3E" },
            ],
        },
        {
            name: "Inventory",
            queries: [
                { key: "query4A", text: "Query 4A" },
                { key: "query4B", text: "Query 4B" },
                { key: "query4C", text: "Query 4C" },
                { key: "query4D", text: "Query 4D" },
                { key: "query4E", text: "Query 4E" },
            ],
        },
        {
            name: "Others",
            queries: [
                { key: "query5A", text: "Query 5A" },
                { key: "query5B", text: "Query 5B" },
                { key: "query5C", text: "Query 5C" },
                { key: "query5D", text: "Query 5D" },
                { key: "query5E", text: "Query 5E" },
            ],
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputQuery.trim()) {
            onQuerySubmit(inputQuery);
            setInputQuery("");
        }
    };

    return (
        <nav className="navbar">
            <div className="query-input-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        className="query-input"
                    />
                    <button type="submit" className="query-submit-btn">Submit</button>
                </form>
            </div>
            
            {entities.map((entity, index) => (
                <div
                    key={entity.name}
                    className="nav-item"
                    onMouseEnter={() => setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <span className="nav-button">{entity.name}</span>
                    {activeDropdown === index && (
                        <div className="dropdown">
                            {entity.queries.map((query) => (
                                <div
                                    key={query.key}
                                    className="dropdown-item"
                                    onClick={() => onQuerySelect(query.key)}
                                >
                                    {query.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Navbar;
