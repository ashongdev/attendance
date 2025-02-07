import { Router } from "express";
import RateLimit from "express-rate-limit";
import {
	authenticate,
	getStudents,
	registerCourse,
} from "../controllers/lecturerController";

export const router = Router();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
router.use(limiter);

router.get("/lec/auth/:key", authenticate);

router.post("/lec/get-students", getStudents);

router.post("/register-course", registerCourse);

export default router;
