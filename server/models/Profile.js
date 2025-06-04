const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    basicDetails: {
      salutation: {
        type: String,
        enum: ["Mr.", "Ms.", "Mrs."],
        trim: true,
      },
      firstName: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      profileImageUrl: {
        type: String,
        trim: true,
      },
    },
    additionalDetails: {
      address: {
        type: String,
        trim: true,
        maxlength: 200,
      },
      country: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      postalCode: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      dob: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        trim: true,
      },
      maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed"],
        trim: true,
      },
    },
    spouseDetails: {
      salutation: {
        type: String,
        enum: ["Mr.", "Ms.", "Mrs."],
        trim: true,
      },
      firstName: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: 50,
      },
    },
    preferences: {
      hobbies: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      sports: {
        type: String,
        trim: true,
        maxlength: 200,
      },
      music: {
        type: String,
        trim: true,
        maxlength: 200,
      },
      movies: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.pre("save", function (next) {
  if (this.additionalDetails?.maritalStatus !== "Married") {
    this.spouseDetails = {
      salutation: undefined,
      firstName: undefined,
      lastName: undefined,
    };
  }
  next();
});

module.exports = mongoose.model("Profile", profileSchema);
