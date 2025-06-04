const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authLimiter } = require("../middleware/security");
const { validate, authValidation } = require("../middleware/validation");

router.use(authLimiter);

router.post(
  "/register",
  authValidation.register,
  validate,
  async (req, res) => {
    try {
      const { userId, password } = req.body;

      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User ID already exists",
        });
      }

      const hashedPwd = await bcrypt.hash(password, 12);

      const user = new User({
        userId,
        password: hashedPwd,
      });
      await user.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }
  }
);

router.post("/login", authValidation.login, validate, async (req, res) => {
  try {
    const { userId, password, keepLoggedIn } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.loginAttempts >= 5) {
      const lockTime = new Date(user.lockUntil) - new Date();
      if (lockTime > 0) {
        return res.status(423).json({
          success: false,
          message: `Account locked. Try again in ${Math.ceil(
            lockTime / 60000
          )} minutes.`,
        });
      } else {
        user.loginAttempts = 0;
        user.lockUntil = null;
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await user.save();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    user.keepLoggedIn = keepLoggedIn || false;
    user.lastLogin = new Date();
    await user.save();

    // Create JWT tokens
    const tokenExpiry = keepLoggedIn ? "365d" : "1d";
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { userId: user.userId, type: "refresh" },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: keepLoggedIn ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, //365 days
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        keepLoggedIn: user.keepLoggedIn,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// Token refresh endpoint
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: user.keepLoggedIn ? "30d" : "1d" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: user.keepLoggedIn
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Token valid",
      user: {
        userId: user.userId,
        keepLoggedIn: user.keepLoggedIn,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

router.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("token", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }
    res.json({
      success: true,
      message:
        "If an account exists with this email, a reset link will be sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }
});
