const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http"); // Add this
const apiRoutes = require("./api/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({ status: "99", message: "Internal Server Error" });
});

app.use("/api", apiRoutes);

module.exports = serverless(app);
