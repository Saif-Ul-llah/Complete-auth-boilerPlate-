const { prisma } = require("../../prismaClient");
const { hashPassword } = require("../../helpers/passwordHelper");

// Find user by email Repository
const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        verification: true,
      },
    });

    return user;
  } catch (error) {
    throw null;
  }
};

// SignUp Repository
const SignUpRepo = async ({
  email,
  password,
  firstName,
  lastName,
  role,
  resetOtp,
}) => {
  try {
    const hashedPassword = await hashPassword(password);

    const createUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        Role: role,
        verification: {
          create: {
            resetOtp: resetOtp,
            resetOtpExpiresAt: new Date(Date.now() + 3600000),
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        Role: true,
      },
    });
    console.log(resetOtp, ": resetOtp");

    return createUser;
  } catch (error) {
    throw error;
  }
};

// Verify the user Repository
const verfiedTheUser = async (id) => {
  try {
    const user = await prisma.userVerification.update({
      where: {
        userId: id,
      },
      data: {
        isEmailVerified: "VERIFIED",
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Set user active Repository
const setIsActive = async (id) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        IsActive: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Set new OTP Repository
const setNewOtp = async (id, resetOtp) => {
  try {
    const user = await prisma.userVerification.update({
      where: {
        userId: id,
      },
      data: {
        resetOtp: resetOtp,
        resetOtpExpiresAt: new Date(Date.now() + 3600000),
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Update user Password
const UpdatePassword = async (email, password) => {
  try {
    const result = await prisma.user.update({
      where: { email }, // Find user by email
      data: { password }, // Set new password
    });

    return result ? true : false;
  } catch (error) {
    throw new Error(
      "Failed to reset password: " + (error.message || "Unknown error")
    );
  }
};
module.exports = {
  SignUpRepo,
  findUserByEmail,
  verfiedTheUser,
  setIsActive,
  setNewOtp,
  UpdatePassword,
};
