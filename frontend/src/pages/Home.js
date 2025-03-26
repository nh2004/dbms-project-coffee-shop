import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ResultDisplay from "../components/ResultDisplay";
import { fetchQueryResult } from "../services/api";

const Home = () => {
    const [result, setResult] = useState(null);

    const handleQuerySelect = async (queryKey) => {
        if (!queryKey) return;
        const data = await fetchQueryResult(queryKey);
        setResult(data);
    };

    return (
        <div>
            <Navbar onQuerySelect={handleQuerySelect} />
            <ResultDisplay result={result} />
        </div>
    );
};

export default Home;
