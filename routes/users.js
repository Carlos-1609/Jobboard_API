import { Router } from "express";
import { userLogin, userSignUp } from "../controllers/usersController.js";
import { userAuthProtection } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", userLogin);
router.post("/signup", userSignUp);

export default router;
