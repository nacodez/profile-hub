const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Import route handlers
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const homepageContentRoutes = require("./routes/homepageContent");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// CORS setup - FIXED to use correct origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/homepage-content", homepageContentRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  mongoose.connection.close();
  process.exit(0);
});
