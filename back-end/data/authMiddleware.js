const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username] = decoded.split(":");

    if (!username) {
      throw new Error("Invalid token");
    }

    req.user = { username }; // Attach user info to request
    next(); // Allow the request to proceed
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = authMiddleware;
