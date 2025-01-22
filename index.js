const express = require("express");
const cors = require("cors");
const apiRoutes = require("./api/index");

const app = express();
const PORT = 3030;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Mock service is running on http://localhost:${PORT}`);
});
