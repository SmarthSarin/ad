require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests
app.use(cookieParser());

const users = []; // Simple in-memory storage (Use DB in production)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ username: user.username }, REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// 📝 Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered successfully!" });
});

// 🔑 Login User & Set JWT in HttpOnly Cookies
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

  res.json({ message: "Logged in successfully" });
});

// 🔄 Refresh Token Endpoint
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const user = users.find((u) => u.username === decoded.username);
    if (!user) return res.status(403).json({ error: "User not found" });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.json({ message: "Token refreshed" });
  });
});

// 🔒 Protected Route Example
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

// 🚪 Logout - Clear Cookies
app.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
