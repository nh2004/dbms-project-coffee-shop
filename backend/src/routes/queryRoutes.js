const express = require("express");
const router = express.Router();
const { getQueryResult } = require("../controllers/queryController");
const { getDescription } = require("../controllers/queryDescription");
const {generateSQLQuery} = require("../controllers/generateSqlQuery");

router.get("/query", getQueryResult);
router.post("/describe", getDescription);
router.post("/generate", generateSQLQuery);

module.exports = router;
