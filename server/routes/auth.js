const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser)
      return res.status(409).json({ msg: "User ID already exists" });

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = new User({ userId, password: hashedPwd });
    await user.save();

    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password, keepLoggedIn } = req.body;
    const user = await User.findOne({ userId });

    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: keepLoggedIn ? "365d" : "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: keepLoggedIn ? 31536000000 : 86400000,
      sameSite: "Lax",
    });

    res.json({ msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });
});

module.exports = router;
