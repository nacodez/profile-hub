const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  basicDetails: {
    salutation: String,
    firstName: String,
    lastName: String,
    email: String,
  },
  additionalDetails: {
    address: String,
    country: String,
    postalCode: String,
    dob: String,
    gender: String,
    maritalStatus: String,
  },
  spouseDetails: {
    salutation: String,
    firstName: String,
    lastName: String,
  },
  preferences: {
    hobbies: String,
    sports: String,
    music: String,
    movies: String,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
