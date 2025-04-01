import { Router } from "express";
import { userAuthProtection } from "../middlewares/authMiddleware.js";
import { getAllJobs } from "../controllers/jobsController.js";

const router = Router();

router.get("/", userAuthProtection, getAllJobs);

export default router;
