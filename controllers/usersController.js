import { generateToken } from "../auth/jwt.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //should be true in prod for https
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.status(200).json({
      message: "✅ Login successful",
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const userSignUp = async (req, res, next) => {
  console.log("User SignUp");
  const { email, name, password, role, resume } = req.body;
  try {
    const user = await User.create({
      email,
      name,
      password,
      role,
      resume,
    });

    if (!user) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    const token = generateToken(user._id);

    return res
      .status(200)
      .json({ msg: "User created was succesful", user: user, token: token });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const userForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "The email you entered is not affiliate with an account",
      });
    }
    //Generate the 6 digit code
    const recoveryCode = Math.floor(10000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: true,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: `${user.name} <${user.email}>`,
      subject: "Recovery password for job board",
      text: `Your password reset code is: ${recoveryCode}\n\nThis code expires in 15 minutes.`,
    };

    // 3. Store code + expiry (e.g., 15 min)
    user.resetCode = recoveryCode;
    user.resetCodeExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const info = await transporter.sendMail(mailOptions);
    console.log("Email with the recovery code was sent: ", info.response);
    return res
      .status(200)
      .json({ status: "success", message: "Email sent successfully" });

    //return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error sending email, please try again.",
    });
  }
};

export const passwordCodeVerification = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (user.resetCode !== verificationCode) {
      console.log(user.resetCode);
      console.log(verificationCode);
      return res
        .status(400)
        .json({ message: "Please enter the correct 6 digit code please." });
    }

    if (Date.now() > user.resetCodeExpiry) {
      return res.status(400).json({
        message: "The code inserted has expired, please request a new one.",
      });
    }

    return res.status(200).json({ message: "Code verification was succesful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    let { email, newPassword } = req.body;

    let user = await User.findOne({ email });

    console.log(user);

    // Assign the raw password; pre('save') will hash it once
    user.password = newPassword;

    // 5) Clear out the code & expiry so it can’t be reused
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password has been reset!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
