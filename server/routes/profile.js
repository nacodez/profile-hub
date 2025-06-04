const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

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

router.get("/", verify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
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

router.post("/", verify, async (req, res) => {
  try {
    const profileData = {
      userId: req.userId,
      ...req.body,
    };

    if (
      req.body.basicDetails &&
      Object.keys(req.body.basicDetails).length > 0
    ) {
      const { salutation, firstName, lastName, email } = req.body.basicDetails;

      if (salutation || firstName || lastName || email) {
        if (!salutation || !firstName || !lastName || !email) {
          return res.status(400).json({
            msg: "If providing basic details, all required fields (salutation, first name, last name, and email) must be included",
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ msg: "Invalid email format" });
        }
      }
    }

    if (req.body.additionalDetails && req.body.additionalDetails.dob) {
      const birthDate = new Date(req.body.additionalDetails.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
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
      await Profile.updateOne({ userId: req.userId }, profileData);
      const updatedProfile = await Profile.findOne({ userId: req.userId });
      return res.json({
        msg: "Profile updated successfully",
        profile: updatedProfile,
      });
    }

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

module.exports = router;
