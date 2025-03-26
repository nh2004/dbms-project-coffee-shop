const queries = require('../models/queries');
const pool = require('../config/db');

exports.getQueryResult = (req, res) => {  
    const queryText = req.query.key;

    if (!queryText) { 
        console.error("Error: Query key is missing");
        return res.status(400).json({ error: "Invalid query selected." });  
    }  

    // Find the query object that matches the given key
    const queryObj = queries.find(q => q.key === queryText);

    if (!queryObj) {
        console.error("Error: Query not found for key", queryText);
        return res.status(400).json({ error: "Invalid query key." });
    }

    const sqlQuery = queryObj.sql;  // Extract SQL statement

    pool.query(sqlQuery, (err, result) => {  
        if (err) {  
            console.error("Error executing query:", queryText, err);
            return res.status(500).json({ error: "Database error", details: err.message });  
        }  
        res.json({ success: true, sqlResult: result });  
    });  
};
