import { Router } from "express";
import {
  userEmailCheck,
  userLogin,
  userSignUp,
} from "../controllers/usersController.js";
import { userAuthProtection } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", userLogin);
router.post("/signup", userSignUp);
router.post("/emailCheck", userEmailCheck);
router.get("/check", userAuthProtection, (req, res, next) => {
  res.status(200).json({ message: "You are logged in" });
});

export default router;
