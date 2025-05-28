const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

// Middleware to verify JWT token
const verify = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: "No authentication token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// Get user profile
router.get("/", verify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      // Return empty profile structure if none exists
      return res.json({
        basicDetails: {},
        additionalDetails: {},
        spouseDetails: {},
        preferences: {},
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ msg: "Error fetching profile data" });
  }
});

// Create or update profile
router.post("/", verify, async (req, res) => {
  try {
    const profileData = {
      userId: req.userId,
      ...req.body,
    };

    // Basic validation for required fields
    if (req.body.basicDetails) {
      const { salutation, firstName, lastName, email } = req.body.basicDetails;

      if (!salutation || !firstName || !lastName || !email) {
        return res.status(400).json({
          msg: "Basic details must include salutation, first name, last name, and email",
        });
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
      }
    }

    // Age validation if DOB provided
    if (req.body.additionalDetails && req.body.additionalDetails.dob) {
      const birthDate = new Date(req.body.additionalDetails.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 17) {
        return res.status(400).json({ msg: "Must be at least 17 years old" });
      }
    }

    const existingProfile = await Profile.findOne({ userId: req.userId });

    if (existingProfile) {
      // Update existing profile
      await Profile.updateOne({ userId: req.userId }, profileData);
      const updatedProfile = await Profile.findOne({ userId: req.userId });
      return res.json({
        msg: "Profile updated successfully",
        profile: updatedProfile,
      });
    }

    // Create new profile
    const newProfile = new Profile(profileData);
    await newProfile.save();

    res.status(201).json({
      msg: "Profile created successfully",
      profile: newProfile,
    });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ msg: "Error saving profile data" });
  }
});

// Delete profile
router.delete("/", verify, async (req, res) => {
  try {
    const result = await Profile.deleteOne({ userId: req.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.json({ msg: "Profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    res.status(500).json({ msg: "Error deleting profile" });
  }
});

module.exports = router;
