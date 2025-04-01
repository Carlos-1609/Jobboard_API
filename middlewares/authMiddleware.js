import jwt from "jsonwebtoken";

export const userAuthProtection = (req, res, next) => {
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split("")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "User not authorized, Please Login!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`This is the decoded token: ${decoded}`);
  } catch (error) {
    console.log(error);
  }
};
