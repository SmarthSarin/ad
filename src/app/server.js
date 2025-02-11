// require("dotenv").config();
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests
// app.use(cookieParser());

// const users = []; // Simple in-memory storage (Use DB in production)
// const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
// const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

// // Generate Tokens
// const generateTokens = (user) => {
//   const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ username: user.username }, REFRESH_SECRET, { expiresIn: "7d" });
//   return { accessToken, refreshToken };
// };

// // Middleware to verify JWT
// const authenticate = (req, res, next) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };

// // 📝 Register User
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ error: "Missing fields" });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   users.push({ username, password: hashedPassword });

//   res.json({ message: "User registered successfully!" });
// });

// // 🔑 Login User & Set JWT in HttpOnly Cookies
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username);

//   if (!user || !(await bcrypt.compare(password, user.password)))
//     return res.status(401).json({ error: "Invalid credentials" });

//   const { accessToken, refreshToken } = generateTokens(user);

//   res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
//   res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

//   res.json({ message: "Logged in successfully" });
// });

// // 🔄 Refresh Token Endpoint
// app.post("/refresh", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

//   jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid refresh token" });

//     const user = users.find((u) => u.username === decoded.username);
//     if (!user) return res.status(403).json({ error: "User not found" });

//     const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

//     res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
//     res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

//     res.json({ message: "Token refreshed" });
//   });
// });

// // 🔒 Protected Route Example
// app.get("/protected", authenticate, (req, res) => {
//   res.json({ message: "Protected data", user: req.user });
// });

// // 🚪 Logout - Clear Cookies
// app.post("/logout", (req, res) => {
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
//   res.json({ message: "Logged out successfully" });
// });

// app.listen(5000, () => console.log("Server running on http://localhost:5000"));

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

const users = []; // Temporary user storage (replace with database)

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const SECRET_KEY = "your_secret_key"; // Store securely

// Register User
app.post("/api/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, fullName, email, password: hashedPassword };
  users.push(newUser);

  res.json({ message: "User registered successfully" });
});

// Login User
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  res.cookie("auth_token", token, { httpOnly: true, secure: false });
  res.json({ message: "Login successful", token });
});

// Logout User
app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

// Get Authenticated User
app.get("/api/user", (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const user = users.find((user) => user.id === decoded.id);
    res.json({ user });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
