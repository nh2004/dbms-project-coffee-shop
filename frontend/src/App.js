import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ResultDisplay from "./components/ResultDisplay";
import "./App.css";

const App = () => {
    const [selectedQuery, setSelectedQuery] = useState("");
    const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");

    // Handler for when a predefined query is selected
    const handleQuerySelect = (queryKey) => {
        setSelectedQuery(queryKey);
        setNaturalLanguageQuery(""); // Clear natural language query when a predefined query is selected
    };

    // Handler for when a natural language query is submitted
    const handleQuerySubmit = (userQuery) => {
        setNaturalLanguageQuery(userQuery);
        setSelectedQuery(""); // Clear selected query when a natural language query is submitted
    };

    return (
        <div className="app-container">
            <h1 className="app-heading">COFFEE SHOP INVENTORY</h1>
            <Navbar onQuerySelect={handleQuerySelect} onQuerySubmit={handleQuerySubmit} />
            <ResultDisplay selectedQuery={selectedQuery} naturalLanguageQuery={naturalLanguageQuery} />
        </div>
    );
};

export default App;