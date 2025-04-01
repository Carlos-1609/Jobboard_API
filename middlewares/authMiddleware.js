import jwt from "jsonwebtoken";

export const userAuthProtection = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "User not authorized, Please Login!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`This is the decoded token: `, decoded);
    next();
  } catch (error) {
    console.log(error);
  }
};
