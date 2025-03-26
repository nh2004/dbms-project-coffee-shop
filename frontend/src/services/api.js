export const fetchQueryResult = async (queryText) => {  
    try {  
        const response = await fetch(`http://localhost:5000/api/query?q=${encodeURIComponent(queryText)}`);  
        const data = await response.json();  
        return data.data;  // This will be an array of rows
    } catch (error) {  
        console.error("Error fetching data:", error);  
        return [];  
    }  
};
