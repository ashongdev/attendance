import bcrypt, { genSalt } from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { pool } from "../db";

const handleErrors = (errors: any) => {
	let errMsg;
	if (
		errors.message.includes(
			`duplicate key value violates unique constraint`
		)
	) {
		if (errors.message.includes(`"students_index_number_key"`)) {
			errMsg = { msg: "Index number entered already exists." };
		} else if (errors.message.includes(`"lecturers_pkey"`)) {
			errMsg = { msg: "The ID entered already exists." };
		}
	}

	return errMsg;
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

		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID = $1 ORDER BY STUDENT_ID",
			[trimmedGroupID]
		);
		res.json(response.rows);
	} catch (error) {
		res.status(402).json(error);
	}
};

const getStudents = async (req: Request, res: Response): Promise<void> => {
	const { groupid } = req.params;

	if (!groupid) {
		res.status(404).json({ message: "Group ID is required" });
		return;
	}

	try {
		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID = $1 ORDER BY STUDENT_ID",
			[groupid]
		);
		res.json(response.rows);
	} catch (error) {
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
		await pool.query(
			"INSERT INTO STUDENTS(STUDENT_ID, FULLNAME, EMAIL, GROUPID, INDEX_NUMBER) VALUES($1, $2, $3, $4, $5)",
			[
				randowmUUID,
				trimmedFullname,
				trimmedEmail,
				trimmedGroupID,
				trimmedIndex_Number,
			]
		);
		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID = $1 ORDER BY STUDENT_ID",
			[trimmedGroupID]
		);
		res.json(response.rows);
	} catch (err) {
		const errors = handleErrors(err);
		res.status(403).json(errors);
	}
};

const removeStudent = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { groupid } = req.query;
	const trimmedGroupID = groupid?.toString().trim();

	if (!id) {
		res.status(404).json({ msg: "An unexpected error occurred." });
	}

	try {
		await pool.query(`DELETE FROM STUDENTS WHERE INDEX_NUMBER = $1`, [id]);

		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID = $1 ORDER BY STUDENT_ID",
			[trimmedGroupID]
		);
		res.json(response.rows);
	} catch (error) {
		console.log("🚀 ~ removeStudent ~ error:", error);
		res.status(403).json(error);
	}
};

const signup = async (req: Request, res: Response) => {
	const {
		username,
		id,
		email,
		phone,
		fullname,
		faculty,
		no_of_groups,
		password,
		group1,
		group2,
		group3,
		group4,
	} = req.body;

	try {
		const salt = await genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const sql = await pool.query(
			`INSERT INTO LECTURERS (LECTURER_ID, NAME, EMAIL, PHONE, FACULTY, PASSWORD,USERNAME, NO_OF_GROUPS) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			[
				id,
				fullname,
				email,
				phone,
				faculty,
				hashedPassword,
				username,
				no_of_groups,
			]
		);
	} catch (err) {
		const error = handleErrors(err);
		res.status(403).json(error);
	}
};

const generateCode = async (req: Request, res: Response): Promise<void> => {
	let arrNum: number[] = [];
	try {
		arrNum = [];

		for (let i = 0; i < 6; i++) {
			const randomNum = Math.floor(Math.random() * 9);
			arrNum.push(randomNum);
		}
		const code = arrNum.join("");
		res.status(200).json(code);
	} catch (error) {
		res.json(error);
	}
};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

export {
	addStudent,
	authenticate,
	editStudentInfo,
	generateCode,
	getStudents,
	removeStudent,
	signup,
};
