const brevo = require("@getbrevo/brevo");
import { compare, genSalt, hash } from "bcrypt";
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
		email: userEmail,
		password,
		group1,
		group2,
		group3,
		group4,
		no_of_groups,
		faculty,
		fullname,
		lecturer_id,
		phone,
		gender,
	} = userData;
	const sql = await pool.query(
		`SELECT * FROM LECTURERS WHERE LECTURER_ID = $1`,
		[lecturer_id]
	);

	if (sql.rows.length <= 0) {
		try {
			const saltRounds = await genSalt(10);
			const hashedPassword = await hash(password, saltRounds);

			arrNum.push(Math.floor(Math.random() * 9) + 1);

			for (let i = 0; i < 5; i++) {
				arrNum.push(Math.floor(Math.random() * 10));
			}
			const code = arrNum.join("");
			console.log("🚀 ~ generateCode ~ code:", code);

			if (!userEmail || !code || !fullname) {
				console.log("An Unexpected error occurred!");
				res.status(400).json({
					error: "An Unexpected error occurred!",
				});
				return;
			}

			if (userEmail && fullname && code) {
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
					htmlContent: HTML(code, fullname),
				};

				apiInstance
					.sendTransacEmail(sendSmtpEmail)
					.then(async () => {
						if (sql.rows.length < 1) {
							await pool.query(
								`INSERT INTO LECTURERS(LECTURER_ID, NAME, EMAIL, PHONE, FACULTY, PASSWORD, FULLNAME, NO_OF_GROUPS, GENDER, UPPER(GROUP1) AS GROUP1, UPPER(GROUP2) AS GROUP2, UPPER(GROUP3) AS GROUP3, UPPER(GROUP4) AS GROUP4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
								[
									lecturer_id,
									fullname,
									userEmail,
									phone,
									faculty,
									hashedPassword,
									fullname,
									no_of_groups,
									gender,
									group1,
									group2,
									group3,
									group4,
								]
							);
							await pool.query(
								`INSERT INTO AUTHCODE(LECTURER_ID, CODE) VALUES($1, $2)`,
								[lecturer_id, hashedCode]
							);

							res.status(200).json({ ok: true });
						} else {
							res.status(403).json({
								error: "User already exists.",
							});
							return;
						}
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
	} else {
		res.status(403).json({
			error: "User already exists.",
		});
	}
};

const signIn = async (req: any, res: Response): Promise<void> => {
	const { lecturer_id, password } = req.body;

	if (!lecturer_id) {
		return;
	}

	try {
		const sql = await pool.query(
			`SELECT PASSWORD FROM LECTURERS WHERE LECTURER_ID = $1 AND IS_VERIFIED = TRUE`,
			[lecturer_id]
		);

		if (sql.rows.length > 0) {
			const hashedPassword = sql.rows[0].password;
			const comparePass = await compare(password, hashedPassword);

			if (comparePass) {
				const fields = await pool.query(
					`SELECT LECTURER_ID, GENDER, NAME, EMAIL, FACULTY, FULLNAME, NO_OF_GROUPS, UPPER(GROUP1) AS GROUP1, UPPER(GROUP2) AS GROUP2, UPPER(GROUP3) AS GROUP3, UPPER(GROUP4) AS GROUP4 FROM LECTURERS WHERE LECTURER_ID = $1 AND IS_VERIFIED = TRUE`,
					[lecturer_id]
				);

				if (fields.rows.length > 0) {
					res.status(201).json(fields.rows[0]);
				} else {
					res.status(404).json({ error: "User not found" });
				}
				return;
			} else {
				res.status(403).json({
					error: "ID or Password does not match.",
				});
			}
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error: any) {
		console.log("🚀 ~ signIn ~ error:", error.message);
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
	const trimmedGroupID = String(groupid).trim().toUpperCase();

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
			"SELECT FULLNAME, EMAIL, UPPER(GROUPID) AS GROUPID, INDEX_NUMBER FROM STUDENTS WHERE UPPER(GROUPID) = $1 ORDER BY STUDENT_ID",
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
			`SELECT DISTINCT ON (S.INDEX_NUMBER) A.PRESENT_STATUS, A.ATTENDANCE_DATE, INDEX_NUMBER, FULLNAME, UPPER(GROUPID) AS GROUPID, EMAIL, DATE_OF_BIRTH FROM STUDENTS AS S
			LEFT JOIN ATTENDANCE AS A
			ON S.INDEX_NUMBER = A.STUDENT_ID
			WHERE UPPER(S.GROUPID) = $1 ORDER BY S.INDEX_NUMBER, A.ATTENDANCE_DATE DESC`,
			[groupid.toUpperCase()]
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
			"SELECT FULLNAME, EMAIL, UPPER(GROUPID) AS GROUPID, INDEX_NUMBER FROM STUDENTS WHERE UPPER(GROUPID) IN($1, $2, $3, $4) ORDER BY GROUPID, STUDENT_ID",
			[
				group1?.toString().toUpperCase(),
				group2?.toString().toUpperCase(),
				group3?.toString().toUpperCase(),
				group4?.toString().toUpperCase(),
			]
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
	const trimmedGroupID = String(groupid).trim().toUpperCase();

	const randowmUUID = uuid();

	try {
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
			"SELECT FULLNAME, EMAIL, UPPER(GROUPID) AS GROUPID, INDEX_NUMBER FROM STUDENTS WHERE UPPER(GROUPID) = $1 ORDER BY STUDENT_ID",
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
	const trimmedGroupID = groupid?.toString().trim().toUpperCase();

	if (!id) {
		console.log("NO ID PROVIDED");

		res.status(404).json({ msg: "An unexpected error occurred." });
	}

	try {
		await pool.query(`DELETE FROM STUDENTS WHERE INDEX_NUMBER = $1`, [id]);

		const response = await pool.query(
			"SELECT FULLNAME, EMAIL, UPPER(GROUPID) AS GROUPID, INDEX_NUMBER FROM STUDENTS WHERE UPPER(GROUPID) = $1 ORDER BY STUDENT_ID",
			[trimmedGroupID]
		);
		res.json(response.rows);
	} catch (error) {
		console.log("🚀 ~ removeStudent ~ error:", error);
		res.status(403).json(error);
	}
};

const compareCode = async (req: any, res: Response) => {
	const { id: lecturerId } = req.params;
	const { code } = req.query;

	if (!lecturerId || lecturerId === "undefined") {
		res.status(403).json({ error: "An unexpected error occurred" });

		return;
	}

	try {
		const sql = await pool.query(
			`SELECT CODE FROM AUTHCODE AS AC 
			JOIN LECTURERS AS LC ON AC.LECTURER_ID = LC.LECTURER_ID 
			WHERE CODE IS NOT NULL AND LC.LECTURER_ID = $1`,
			[lecturerId]
		);
		if (sql.rows.length === 1) {
			const hashedCode = sql.rows[0].code;

			const codeMatches = await compare(code, hashedCode);

			if (codeMatches && lecturerId) {
				await pool.query(
					`UPDATE LECTURERS SET IS_VERIFIED = TRUE WHERE LECTURER_ID = $1`,
					[lecturerId]
				);

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
		res.status(403).json({ error: "No data provided for this operation" });
		return;
	}

	const { present_status, index_number, groupid } = req.body;

	try {
		const checkID = await pool.query(
			`SELECT STUDENT_ID FROM ATTENDANCE WHERE STUDENT_ID = $1 AND ATTENDANCE_DATE::DATE = CURRENT_DATE`,
			[index_number]
		);

		if (checkID.rows.length === 1) {
			await pool.query(
				`UPDATE ATTENDANCE 
				SET PRESENT_STATUS = $1, ATTENDANCE_DATE = NOW() 
				WHERE STUDENT_ID = $2 AND ATTENDANCE_DATE::DATE = CURRENT_DATE`,
				[present_status, index_number]
			);
		} else {
			const randomUUID = uuid();

			await pool.query(
				`INSERT INTO ATTENDANCE (ATTENDANCE_ID, STUDENT_ID, PRESENT_STATUS, ATTENDANCE_DATE) 
				VALUES($1, $2, $3, NOW())`,
				[randomUUID, index_number, present_status]
			);
		}

		const response = await pool.query(
			`SELECT DISTINCT ON (S.INDEX_NUMBER) 
				A.PRESENT_STATUS, A.ATTENDANCE_DATE, S.INDEX_NUMBER, S.FULLNAME, 
				UPPER(S.GROUPID) AS GROUPID, S.EMAIL, S.DATE_OF_BIRTH 
			FROM STUDENTS AS S
			LEFT JOIN ATTENDANCE AS A ON S.INDEX_NUMBER = A.STUDENT_ID
			WHERE UPPER(S.GROUPID) = $1 
			ORDER BY S.INDEX_NUMBER, A.ATTENDANCE_DATE DESC`,
			[groupid.toString().toUpperCase()]
		);

		res.status(201).json(response.rows);
	} catch (err: any) {
		const error = await handleErrors(err);
		console.log("🚀 ~ tickAttendance ~ error:", err);
		res.status(400).json(error);
	}
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	if (!id) {
		res.status(404).json({ error: "No ID provided" });

		return;
	}

	try {
		const sql = await pool.query(
			`SELECT LECTURER_ID, GENDER, NAME, EMAIL, FACULTY, FULLNAME, NO_OF_GROUPS, UPPER(GROUP1) AS GROUP1, UPPER(GROUP2) AS GROUP2, UPPER(GROUP3) AS GROUP3, UPPER(GROUP4) AS GROUP4 FROM LECTURERS WHERE LECTURER_ID = $1 AND IS_VERIFIED = TRUE`,
			[id]
		);

		if (sql.rows.length === 1) {
			res.status(200).json(sql.rows[0]);
		} else {
			res.status(403).json({ error: "Not authorized" });
		}
	} catch (error) {
		console.log("🚀 ~ authenticate ~ error:", error);
		res.status(403).json(error);
	}
};

const generateSheetReport = async (req: Request, res: Response) => {
	const { groupid } = req.params;

	if (!groupid || groupid === "undefined") {
		res.status(404).json({ ok: false });
		return;
	}

	try {
		const sql = await pool.query(
			`SELECT 
			UPPER(s.groupid) AS groupid,
			a.student_id, 
			s.fullname,  
			COUNT(CASE WHEN a.present_status = true THEN 1 END) AS days_present,
			COUNT(CASE WHEN a.present_status = false THEN 1 END) AS days_absent,
			COUNT(*) AS total_days
			FROM attendance a
			JOIN students s ON a.student_id = s.index_number
			WHERE UPPER(s.groupid) = $1 
			GROUP BY UPPER(s.groupid), a.student_id, s.fullname
			ORDER BY a.student_id;`,
			[groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows);
	} catch (error) {
		console.log("🚀 ~ generateSheetReport ~ error:", error);
		res.status(403).json(error);
	}
};

export {
	addStudent,
	authenticate,
	compareCode,
	editStudentInfo,
	generateCode,
	generateSheetReport,
	getStudentsAttendanceList,
	getStudentsList,
	removeStudent,
	signIn,
	tickAttendance,
};
