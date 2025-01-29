const Joi = require("joi");

// Define a validation schema using Joi
const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
  firstName: Joi.string().min(1).required().messages({
    "string.empty": "First name cannot be empty.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().min(1).required().messages({
    "string.empty": "Last name cannot be empty.",
    "any.required": "Last name is required.",
  }),
  role: Joi.string()
    .valid("USER", "BUILDER", "CONSULTANT", "PRE_INSPECTOR")
    .required()
    .messages({
      "any.only": 'Role must be either "user" or "admin".',
      "any.required": "Role is required.",
    }),
});
const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  confirmPassWord: Joi.string()
    .valid(Joi.ref("password")) // Ensure ConfirmPassword matches Password
    .required()
    .messages({
      "any.only": "ConfirmPassword must match Password",
      "string.empty": "ConfirmPassword is required",
    }),
});

module.exports = { signUpSchema, resetSchema };
