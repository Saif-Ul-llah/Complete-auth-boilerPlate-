const { filterUserData } = require("../../helpers/filterModels");
const { comparePassword } = require("../../helpers/passwordHelper");
const { sendOtpToMail } = require("../../middlewares/emails/otpMail");
const { signUpSchema } = require("../../utils/validationsSchemas");
const {
  SignUpRepo,
  findUserByEmail,
  verfiedTheUser,
  setIsActive,
  setNewOtp,
} = require("./authRepo");

// SignUp service
const SignUpService = async (email, password, firstName, lastName, role) => {
  try {
    const { error } = signUpSchema.validate({
      email,
      password,
      firstName,
      lastName,
      role,
    });
    if (error) {
      throw new Error(error.details[0].message);
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      // If the email exists, throw an error or handle it accordingly
      throw new Error("Email already in use");
    }
    let resetOtp = Math.floor(100000 + Math.random() * 900000);
    const createUsers = await SignUpRepo({
      email,
      password,
      firstName,
      lastName,
      role,
      resetOtp,
    });
    if (createUsers) {
      // Send OTP to the user's email
      await sendOtpToMail(email, resetOtp);
    }
    return createUsers;
  } catch (error) {
    throw error;
  }
};

// Verify OTP service
const verifyEmail = async (email, otp) => {
  try {
    let user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.verification) {
      if (
        user.verification.resetOtpExpiresAt &&
        user.verification.resetOtpExpiresAt < new Date()
      ) {
        throw new Error("OTP expired");
      }
      // if (user.verification.isEmailVerified == "VERIFIED") {
      //   throw new Error("Email already verified");
      // }

      if (user.verification.resetOtp != otp) {
        throw new Error("Invalid OTP");
      }
    }
    const updatedUser = await verfiedTheUser(user.id);
    const isActive = await setIsActive(user.id);
    user = await findUserByEmail(email);

    return filterUserData(user);
  } catch (error) {
    throw new Error(`Failed to verify email: ${error}`);
  }
};

// Login service
const loginService = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    // /* ====== Check is User Verified ====== */
    if (user.verification && user.verification.isEmailVerified != "VERIFIED") {
      let generateOTP = Math.floor(100000 + Math.random() * 900000);
      let setOtp = await setNewOtp(user.id, generateOTP);
      if (!setOtp) {
        throw new Error(" Failed to send OTP ");
      }
      await sendOtpToMail(email, generateOTP);
      return { message: "OTP sent to your email", status: 401 };
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    return filterUserData(user);
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// forgot password service
const forgotPassService = async (email) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    let generateOTP = Math.floor(100000 + Math.random() * 900000);
    let setOtp = await setNewOtp(user.id, generateOTP);
    if (!setOtp) {
      throw new Error(" Failed to send OTP ");
    }
    await sendOtpToMail(email, generateOTP);
    return { message: "OTP sent to your email", status: 200 };
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error}`);
  }
};

module.exports = { SignUpService, verifyEmail, loginService ,forgotPassService };
