const mongoose = require("mongoose");

const homepageContentSchema = new mongoose.Schema(
  {
    heroSection: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },

    featureCards: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        iconName: {
          type: String,
          required: true,
          enum: ["Person", "Security", "Dashboard", "Settings"],
        },
        order: { type: Number, required: true },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageContent", homepageContentSchema);
