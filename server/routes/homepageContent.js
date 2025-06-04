const router = require("express").Router();
const HomepageContent = require("../models/HomepageContent");

router.get("/", async (req, res) => {
  try {
    const content = await HomepageContent.findOne({ isActive: true });

    if (!content) {
      return res.status(404).json({
        success: false,
        msg: "No homepage content found",
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (err) {
    console.error("Error fetching homepage content:", err);
    res.status(500).json({
      success: false,
      msg: "Error fetching homepage content",
    });
  }
});

module.exports = router;
