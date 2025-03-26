const queries = [
    {
        key: "name",
        sql: "SELECT name FROM student WHERE id = 3;"
    },
    {
        key: "cs",
        sql: "SELECT * FROM student WHERE department = 'Computer Science';"
    },
    {
        key: "query1C",
        sql: "SELECT * FROM student;"
    },
    {
        key: "query1D",
        sql: "SELECT ingredient_name, SUM(used_quantity) FROM ingredient_usage GROUP BY ingredient_name ORDER BY SUM(used_quantity) DESC LIMIT 5;"
    },
    {
        key: "query1E",
        sql: "SELECT supplier_name FROM suppliers WHERE ingredient_id IN (SELECT id FROM ingredients WHERE stock < 20);"
    },
    {
        key: "query2A",
        sql: "SELECT product_name, SUM(quantity_sold) FROM sales GROUP BY product_name ORDER BY SUM(quantity_sold) DESC LIMIT 5;"
    },
    {
        key: "query2B",
        sql: "SELECT region, SUM(total_revenue) FROM sales GROUP BY region ORDER BY SUM(total_revenue) DESC;"
    },
    {
        key: "query2C",
        sql: "SELECT customer_name FROM customers WHERE total_purchases > 5000;"
    },
    {
        key: "query2D",
        sql: "SELECT product_name FROM sales WHERE sale_date = CURRENT_DATE;"
    },
    {
        key: "query2E",
        sql: "SELECT category, AVG(discount) FROM sales GROUP BY category;"
    },
    {
        key: "query3A",
        sql: "SELECT employee_name FROM employees ORDER BY performance_score DESC LIMIT 5;"
    },
    {
        key: "query3B",
        sql: "SELECT department, COUNT(*) FROM employees GROUP BY department;"
    },
    {
        key: "query3C",
        sql: "SELECT employee_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"
    },
    {
        key: "query3D",
        sql: "SELECT job_role, COUNT(*) FROM employees WHERE experience_years > 5 GROUP BY job_role;"
    },
    {
        key: "query3E",
        sql: "SELECT employee_name FROM employees WHERE joining_date > '2023-01-01';"
    },
    {
        key: "query4A",
        sql: "SELECT product_name, stock FROM inventory WHERE stock < 10;"
    },
    {
        key: "query4B",
        sql: "SELECT product_name FROM inventory WHERE last_restocked < CURRENT_DATE - INTERVAL '30 days';"
    },
    {
        key: "query4C",
        sql: "SELECT category, SUM(stock) FROM inventory GROUP BY category;"
    },
    {
        key: "query4D",
        sql: "SELECT supplier_name, COUNT(*) FROM suppliers GROUP BY supplier_name HAVING COUNT(*) > 5;"
    },
    {
        key: "query4E",
        sql: "SELECT product_name FROM inventory ORDER BY stock DESC LIMIT 5;"
    },
    {
        key: "query5A",
        sql: "SELECT COUNT(*) FROM orders WHERE order_status = 'Pending';"
    },
    {
        key: "query5B",
        sql: "SELECT AVG(order_amount) FROM orders WHERE order_date > CURRENT_DATE - INTERVAL '1 month';"
    },
    {
        key: "query5C",
        sql: "SELECT customer_name, COUNT(*) FROM orders GROUP BY customer_name ORDER BY COUNT(*) DESC LIMIT 5;"
    },
    {
        key: "query5D",
        sql: "SELECT supplier_name FROM suppliers WHERE reliability_score > 4.5;"
    },
    {
        key: "query5E",
        sql: "SELECT category, COUNT(*) FROM products GROUP BY category;"
    }
];

module.exports = queries;
