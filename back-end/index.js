const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

const dataRoute = require("./api/data");
const loginRoute = require("./api/login");

app.use("/api/v1/data/", dataRoute);

app.use("/api/v1/login/", loginRoute);

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Server error" });
});

app.get("*", (req, res) => {
  res.send("");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
