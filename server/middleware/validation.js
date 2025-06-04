const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const authValidation = {
  register: [
    body("userId")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("User ID must be between 3 and 50 characters")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "User ID can only contain letters, numbers, underscores, and hyphens"
      ),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage("Password must contain at least one letter and one number"),
  ],
  login: [
    body("userId").trim().notEmpty().withMessage("User ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
};

const profileValidation = {
  update: [
    body("basicDetails.email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("basicDetails.firstName")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("First name must not exceed 50 characters"),
    body("basicDetails.lastName")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Last name must not exceed 50 characters"),
    body("additionalDetails.postalCode")
      .optional()
      .trim()
      .matches(/^[A-Za-z0-9\s-]+$/)
      .withMessage("Invalid postal code format"),
    body("additionalDetails.dob")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format")
      .custom((value) => {
        const birthDate = new Date(value);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 17) {
          throw new Error("Must be at least 17 years old");
        }
        return true;
      }),
  ],
};

module.exports = {
  validate,
  authValidation,
  profileValidation,
};
