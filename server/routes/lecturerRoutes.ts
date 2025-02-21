import { Router } from "express";
import RateLimit from "express-rate-limit";
import {
	authenticate,
	getStudents,
	editStudentInfo,
	addStudent,
	removeStudent,
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
router.get("/lec/students", getStudents);

router.post("/lec/get-students", getStudents);
router.post("/lec/add-student", addStudent);
router.delete("/lec/rem-student/:id", removeStudent);

// router.post("/register-course", registerCourse);
router.patch("/lec/edit", editStudentInfo);

export default router;
