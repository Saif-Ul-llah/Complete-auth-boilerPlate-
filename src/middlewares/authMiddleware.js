const jwt = require("jsonwebtoken");
require("dotenv").config();
const { prisma } = require("./../prismaClient");
const { filterUserData } = require("../helpers/filterModels");

// JWT Authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the token is present in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Get the token from the header

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      // console.log(decoded);

      // Ensure 'decoded.id' exists before using it to find the user
      if (!decoded.user.id) {
        return res
          .status(401)
          .json({ success: false, message: "Please provide userID" });
      }

      // Find the user by ID and exclude the password from the response
      req.user = await filterUserData(
        prisma.user.findUnique({
          where: {
            id: decoded.user.id,
          },
        })
      );

      // Check if the user exists and is active
      if (!req.user || req.user.IsActive === 0) {
        return res
          .status(401)
          .json({ success: false, message: "User not found or inactive" });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error); // Log error for debugging
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

module.exports = { protect };
