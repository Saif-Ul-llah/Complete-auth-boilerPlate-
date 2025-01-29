const Joi = require("joi");
const { generateToken } = require("../../helpers/Encrypt");
const errorMiddleware = require("../../middlewares/errorMiddleware");
const {
  SignUpService,
  verifyEmail,
  loginService,
  forgotPassService,
} = require("../../module/auth/authService");
const { hashPassword } = require("../../helpers/passwordHelper");
const { resetSchema } = require("../../utils/validationsSchemas");
const { UpdatePassword } = require("../../module/auth/authRepo");

const ForgetSchema = Joi.object({
  email: Joi.string().email().required(),
});

// SignUp controller
const SignUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, Role } = req.body;
    const createUsers = await SignUpService(
      email,
      password,
      firstName,
      lastName,
      Role
    );
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createUsers,
    });
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};

//Verify OTP controller
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }
    let user = await verifyEmail(email, otp);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user);

    let responsePayload = {
      ...user,
      token,
    };
    return res.status(200).json({
      data: responsePayload,
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};
//Login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "Failed", message: "All fields are required" });
    }

    const user = await loginService(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status == 401) {
      return res.status(401).json({ message: "OTP sent to your email" });
    }
    if (user.status == 404) {
      return res
        .status(404)
        .json({ message: "User Not Found", data: [], status: "failed" });
    }
    const token = await generateToken(user);

    return res.status(200).send({
      status: "success",
      message: "User logged in successfully",
      data: {
        ...user,
        token,
      },
    });
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};
//Forgot Password controller
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const { error } = ForgetSchema.validate({ email });

  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }
  try {
    const Send = await forgotPassService(email);
    res.status(200).send({ ...Send });
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};
//Reset Password controller
const ResetPassword = async (req, res, next) => {
  try {
    const email = req.user.email;
    // console.log(email);

    let { password, confirmPassWord } = req.body;
    const { error } = resetSchema.validate({
      email,
      password,
      confirmPassWord,
    });

    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    password = await hashPassword(password);
    console.log(password);

    const resetPassword = await UpdatePassword(email, password);
    if (resetPassword) {
      return res
        .status(200)
        .send({ success: true, message: "Password updated successfully" });
    }
    return res.status(500).send("Failed to update password");
  } catch (error) {
    errorMiddleware(error, req, res, next);
  }
};

module.exports = { SignUp, verifyOtp, login, forgotPassword, ResetPassword };
