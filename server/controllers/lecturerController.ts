import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { log } from "console";

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
			["E"]
		);
		// console.log(response.rows);
		res.json(response.rows);
	} catch (error) {
		// console.log("🚀 ~ getStudents ~ error:", error);
		res.json(error);
	}
};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

export { authenticate, getStudents, editStudentInfo };
