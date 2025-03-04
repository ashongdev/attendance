const brevo = require("@getbrevo/brevo");
import bcrypt, { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { HTML } from "../exports/exports";

let apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.apiClient.authentications["api-key"].apiKey =
	process.env.BREVO_API_KEY;

const generateCode = async (req: any, res: Response): Promise<void> => {
	let arrNum: number[] = [];

	const userData = req.query;
	const {
		fullname,
		email: userEmail,
		password,
		group1,
		group2,
		group3,
		group4,
		no_of_groups,
		faculty,
		username,
		id,
		phone,
	} = userData;
	try {
		const saltRounds = await genSalt(10);
		const hashedPassword = await hash(password, saltRounds);
		arrNum = [];

		for (let i = 0; i < 6; i++) {
			const randomNum = Math.floor(Math.random() * 9);
			arrNum.push(randomNum);
		}
		const code = arrNum.join("");

		if (!userEmail || !code || !username) {
			console.log("An Unexpected error occurred!");
			res.status(400).json({ error: "An Unexpected error occurred!" });
			return;
		}

		if (userEmail && username && code) {
			const saltRounds = await genSalt(10);
			const hashedCode = await hash(code, saltRounds);

			let sendSmtpEmail = new brevo.SendSmtpEmail();

			sendSmtpEmail = {
				subject: "Verify Your Account – Action Required",
				sender: {
					name: "ClassTrack",
					email: "recordattendance3@gmail.com",
				},
				to: [{ email: userEmail }],
				htmlContent: HTML(code, username),
			};

			apiInstance
				.sendTransacEmail(sendSmtpEmail)
				.then(async () => {
					const sql = await pool.query(
						`SELECT * FROM LECTURERS WHERE LECTURER_ID = $1`,
						[id]
					);

					if (sql.rows.length < 1) {
						await pool.query(
							`INSERT INTO LECTURERS(LECTURER_ID, NAME, EMAIL, PHONE, FACULTY, PASSWORD, USERNAME, NO_OF_GROUPS, GROUP1, GROUP2, GROUP3, GROUP4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
							[
								id,
								fullname,
								userEmail,
								phone,
								faculty,
								hashedPassword,
								username,
								no_of_groups,
								group1,
								group2,
								group3,
								group4,
							]
						);
						await pool.query(
							`INSERT INTO AUTHCODE(LECTURER_ID, CODE) VALUES($1, $2)`,
							[id, hashedCode]
						);
					} else {
						await pool.query(
							`UPDATE AUTHCODE SET CODE = $1 WHERE LECTURER_ID = $2`,
							[hashedCode, id]
						);
					}
					res.status(200).json({ ok: true });
				})
				.catch((error: any) => {
					console.log(error);
					res.status(400).json({ ok: false });
				});
		}
	} catch (error: any) {
		console.log("🚀 ~ generateCode ~ error:", error.message);
		res.status(403).json(error);
	}
};

const handleErrors = async (errors: any) => {
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
		console.log(error);
		res.status(402).json(error);
	}
};

const getStudentsAttendanceList = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { groupid } = req.params;

	if (!groupid) {
		res.status(404).json({ message: "Group ID is required" });
		return;
	}

	try {
		const response = await pool.query(
			`SELECT DISTINCT ON (S.INDEX_NUMBER) A.PRESENT_STATUS, A.ATTENDANCE_DATE, INDEX_NUMBER, FULLNAME, GROUPID, EMAIL, DATE_OF_BIRTH FROM STUDENTS AS S
			LEFT JOIN ATTENDANCE AS A
			ON S.INDEX_NUMBER = A.STUDENT_ID
			WHERE S.GROUPID = $1 ORDER BY S.INDEX_NUMBER, A.ATTENDANCE_DATE DESC`,
			[groupid]
		);

		res.json(response.rows);
	} catch (error) {
		console.log("🚀 ~ getStudentsList ~ error:", error);
		res.json(error);
	}
};

const getStudentsList = async (req: Request, res: Response): Promise<void> => {
	const { group1, group2, group3, group4 } = req.query;

	if (!group1 && !group2 && !group3 && !group4) {
		res.status(404).json({ message: "Group ID is required" });
		return;
	}

	try {
		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, GROUPID, INDEX_NUMBER FROM STUDENTS WHERE GROUPID IN($1, $2, $3, $4) ORDER BY GROUPID, STUDENT_ID",
			[group1, group2, group3, group4]
		);

		res.json(response.rows);
	} catch (error) {
		console.log("🚀 ~ getStudentsList ~ error:", error);
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
		const errors = await handleErrors(err);
		console.log("🚀 ~ addStudent ~ errors:", err);
		res.status(403).json(errors);
	}
};

const removeStudent = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { groupid } = req.query;
	const trimmedGroupID = groupid?.toString().trim();

	if (!id) {
		console.log("NO ID PROVIDED");

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
	} = req.body;

	try {
		const salt = await genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		await pool.query(
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
		console.log("🚀 ~ signup ~ err:", err);
		const error = await handleErrors(err);
		res.status(403).json(error);
	}
};

const compareCode = async (req: any, res: Response) => {
	const { id: lecturerId } = req.params;
	const { code } = req.query;

	try {
		const sql = await pool.query(
			`SELECT CODE FROM AUTHCODE AS AC 
			JOIN LECTURERS AS LC ON AC.LECTURER_ID = LC.LECTURER_ID 
			WHERE CODE IS NOT NULL`
		);
		if (sql.rows.length === 1) {
			const hashedCode = sql.rows[0].code;

			const codeMatches = await compare(code, hashedCode);

			if (codeMatches) {
				await pool.query(
					`UPDATE LECTURERS SET IS_VERIFIED = TRUE WHERE LECTURER_ID = $1`,
					[lecturerId]
				);

				console.log("DONE");
				res.status(200).json({ ok: true });
			} else {
				console.log({ error: "Invalid verification code" });
				res.status(403).json({ error: "Invalid verification code" });
			}
		} else {
			console.log({ error: "Invalid or expired verification code" });
			res.status(403).json({
				error: "Invalid or expired verification code",
			});
		}
	} catch (error) {
		console.log("🚀 ~ compareCode ~ error:", error);
		res.status(403).json({ error: "An unexpected error occurred" });
	}
};

const tickAttendance = async (req: Request, res: Response): Promise<void> => {
	if (!req.body) {
		console.log({ error: "No data provided for this operation" });

		res.status(403).json({ error: "No data provided for this operation" });
	}

	const { present_status, index_number, groupid } = req.body;

	try {
		const checkID = await pool.query(
			`SELECT STUDENT_ID, ATTENDANCE_DATE FROM ATTENDANCE WHERE STUDENT_ID = $1 AND DATE(ATTENDANCE_DATE) = DATE($2)`,
			[index_number, new Date()]
		);

		if (checkID.rows.length === 1) {
			await pool.query(
				`UPDATE ATTENDANCE SET PRESENT_STATUS = $1, ATTENDANCE_DATE = $2 WHERE STUDENT_ID = $3`,
				[present_status, new Date(), index_number]
			);
		} else if (checkID.rows.length < 1) {
			const randomUUID = uuid();
			await pool.query(
				`INSERT INTO ATTENDANCE (ATTENDANCE_ID, STUDENT_ID, PRESENT_STATUS) VALUES($1, $2, $3)`,
				[randomUUID, index_number, present_status]
			);
		}
		const response = await pool.query(
			`SELECT DISTINCT ON (S.INDEX_NUMBER) A.PRESENT_STATUS, A.ATTENDANCE_DATE, INDEX_NUMBER, FULLNAME, GROUPID, EMAIL, DATE_OF_BIRTH FROM STUDENTS AS S
			LEFT JOIN ATTENDANCE AS A
			ON S.INDEX_NUMBER = A.STUDENT_ID
			WHERE S.GROUPID = $1 ORDER BY S.INDEX_NUMBER, A.ATTENDANCE_DATE DESC`,
			[groupid]
		);
		res.status(201).json(response.rows);
	} catch (err: any) {
		const error = await handleErrors(err);
		console.log("🚀 ~ tickAttendance ~ error:", err);
		res.status(400).json(error);
	}
};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

export {
	addStudent,
	authenticate,
	compareCode,
	editStudentInfo,
	generateCode,
	getStudentsAttendanceList,
	getStudentsList,
	removeStudent,
	signup,
	tickAttendance,
};
