const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Generate token
const generateToken = (user) => {
  const token = jwt.sign({  user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};
module.exports = { generateToken };
