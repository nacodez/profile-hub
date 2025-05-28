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
    const hashedPwd = await bcrypt.hash(password, 10);

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

    // Create JWT token
    const tokenExpiry = keepLoggedIn ? "365d" : "1d";
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    // Set cookie with token
    const cookieMaxAge = keepLoggedIn ? 31536000000 : 86400000; // 1 year or 1 day
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: cookieMaxAge,
      sameSite: "Lax",
    });

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login error" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });
});

module.exports = router;
