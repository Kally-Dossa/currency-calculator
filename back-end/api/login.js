const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to the login.json file
const loginFilePath = path.join(__dirname, "../data/login.json");

// Load users from login.json
const loadUsers = () => {
  if (!fs.existsSync(loginFilePath)) {
    fs.writeFileSync(loginFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(loginFilePath, "utf-8");
  return JSON.parse(data);
};

// Login endpoint
router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const users = loadUsers();
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      res
        .status(200)
        .json({ message: "Login successful", username: user.username });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
