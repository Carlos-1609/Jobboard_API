import { generateToken } from "../auth/jwt.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";

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
