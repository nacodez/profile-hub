const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Profile = require("../models/Profile");

const verify = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

router.get("/", verify, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.userId });
  res.json(profile);
});

router.post("/", verify, async (req, res) => {
  try {
    const existing = await Profile.findOne({ userId: req.userId });

    if (existing) {
      await Profile.updateOne({ userId: req.userId }, req.body);
      return res.json({ msg: "Profile updated" });
    }

    const profile = new Profile({ userId: req.userId, ...req.body });
    await profile.save();
    res.status(201).json({ msg: "Profile created" });
  } catch (err) {
    res.status(500).json({ msg: "Error saving profile" });
  }
});

module.exports = router;
