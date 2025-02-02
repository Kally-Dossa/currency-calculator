const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/login.json");

// read login.json
const loadUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
};

const authMiddleware = (req, res, next) => {
  //auth header from the request
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("No Authorization header");
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString("utf-8");

    const [username, password] = decoded.split(":");

    if (!username || !password) {
      throw new Error("Invalid token format");
    }

    //load users from json file
    const users = loadUsers();
    //check if the user with the given username and pass are in the list -> json file
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    //if not send this error
    if (!user) {
      console.log("Invalid credentials");
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid credentials" });
    }

    next();
  } catch (error) {
    console.log("Error in authMiddleware:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = authMiddleware;
