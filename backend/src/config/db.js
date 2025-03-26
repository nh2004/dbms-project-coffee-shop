const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({path: ('../.env')})
// Validate environment variables
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_name = process.env.DB_NAME

if ( !db_user || !db_pass || !db_name) {
    console.error("❌ Missing required database environment variables.");
    process.exit(1);
}

// Create a connection pool for better performance
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust based on workload
    host: 'localhost', //
    user: db_user,
    password: db_pass,
    database: db_name,
    multipleStatements: true // Allow executing multiple SQL statements
});

// Check database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
    connection.release(); // Release connection back to pool
});

module.exports = pool;
