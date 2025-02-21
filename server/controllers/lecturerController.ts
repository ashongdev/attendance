import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { log } from "console";

const handleErrors = (errors: any) => {
	// log("Error:", errors.message);

	if (
		errors.message.includes(
			`duplicate key value violates unique constraint "students_index_number_key"`
		)
	) {
		return { msg: "Index number entered already exists." };
	}
};

const editStudentInfo = async (req: Request, res: Response) => {
	if (!req.body) {
		return;
	}

	const { fullname, index_number, email, groupid } = req.body;
	const trimmedFullname = String(fullname).trim();
	const trimmedIndex_Number = String(index_number).trim();
	const trimmedEmail = String(email).trim();
	const trimmedGroupID = String(groupid).trim();

	try {
		await pool.query(
			`UPDATE STUDENTS 
				SET FULLNAME = $1,
				INDEX_NUMBER = $2,
				EMAIL = $3,
				GROUPID = $4
			WHERE INDEX_NUMBER = $2`,
			[trimmedFullname, trimmedIndex_Number, trimmedEmail, trimmedGroupID]
		);

		getStudents(req, res);
	} catch (error) {
		// console.log("🚀 ~ editStudentInfo ~ error:", error);
		res.status(402).json(error);
	}
};

const getStudents = async (req: Request, res: Response): Promise<void> => {
	try {
		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID = $1 ORDER BY STUDENT_ID",
			["A"]
		);
		// console.log(response.rows);
		res.json(response.rows);
	} catch (error) {
		// console.log("🚀 ~ getStudents ~ error:", error);
		res.json(error);
	}
};

const addStudent = async (req: Request, res: Response): Promise<void> => {
	if (!req.body) {
		return;
	}

	const { fullname, index_number, email, groupid } = req.body;
	const trimmedFullname = String(fullname).trim();
	const trimmedIndex_Number = String(index_number).trim();
	const trimmedEmail = String(email).trim();
	const trimmedGroupID = String(groupid).trim();

	const randowmUUID = uuid();

	try {
		// Implement FK on attendance table
		const response = await pool.query(
			"INSERT INTO STUDENTS(STUDENT_ID, FULLNAME, EMAIL, GROUPID, INDEX_NUMBER) VALUES($1, $2, $3, $4, $5)",
			[
				randowmUUID,
				trimmedFullname,
				trimmedEmail,
				trimmedGroupID,
				trimmedIndex_Number,
			]
		);
		getStudents(req, res);
	} catch (err) {
		const errors = handleErrors(err);
		// console.log("🚀 ~ getStudents ~ error:", err);
		res.status(403).json(errors);
	}
};

const removeStudent = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		res.status(404).json({ msg: "An unexpected error occurred." });
	}

	try {
		const sql = await pool.query(
			`DELETE FROM STUDENTS WHERE INDEX_NUMBER = $1`,
			[id]
		);

		getStudents(req, res);
	} catch (error) {
		console.log("🚀 ~ removeStudent ~ error:", error);
	}

	console.log("Removed", id);
};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

export {
	authenticate,
	getStudents,
	editStudentInfo,
	addStudent,
	removeStudent,
};
