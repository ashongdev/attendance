import { Router } from "express";
import RateLimit from "express-rate-limit";
import {
	addStudent,
	authenticate,
	compareCode,
	editStudentInfo,
	generateCode,
	generateSheetReport,
	getStudentsAttendanceList,
	getStudentsList,
	removeStudent,
	signup,
	tickAttendance,
} from "../controllers/lecturerController";

export const router = Router();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
router.use(limiter);

router.get("/lec/auth/:id", authenticate);
router.get("/lec/students/:groups", getStudentsList);
router.get("/lec/students/attendance/:groupid", getStudentsAttendanceList);
router.get("/lec/verify/:userEmail", generateCode);
router.get("/lec/compare/:id", compareCode);
router.get("/lec/report/:groupid", generateSheetReport);

router.post("/lec/add-student", addStudent);
router.post("/lec/signup", signup);

router.delete("/lec/rem-student/:id", removeStudent);

// router.post("/register-course", registerCourse);
router.patch("/lec/edit", editStudentInfo);
router.put("/lec/tick_attendance", tickAttendance);

export default router;
