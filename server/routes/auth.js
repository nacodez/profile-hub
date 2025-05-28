const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ msg: "User ID already exists" });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      userId,
      password: hashedPwd,
    });
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// User login endpoint
router.post("/login", async (req, res) => {
  try {
    const { userId, password, keepLoggedIn } = req.body;

    // Find user in database
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Update user login preferences
    user.keepLoggedIn = keepLoggedIn || false;
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token with longer expiry for "keep logged in"
    const tokenExpiry = keepLoggedIn ? "30d" : "1d";
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    // Set cookie with token
    const cookieMaxAge = keepLoggedIn
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000; // 30 days or 1 day
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieMaxAge,
    });

    res.json({
      msg: "Login successful",
      user: {
        userId: user.userId,
        keepLoggedIn: user.keepLoggedIn,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login error" });
  }
});

// Verify token endpoint for authentication check
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    res.json({
      msg: "Token valid",
      user: {
        userId: user.userId,
        keepLoggedIn: user.keepLoggedIn,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
