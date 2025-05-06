const express = require("express");
const cors = require("cors");
const apiRoutes = require("./api/index");

const app = express();
const PORT = 3030;

// Middleware
app.use(
  cors({
    exposedHeaders: ["token", "cf-ray", "x-powered-by", "token"],
  })
);
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json(createApiResponse("99", "Internal Server Error"));
});
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Mock service is running on http://localhost:${PORT}`);
});
