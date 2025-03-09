import emailjs from "@emailjs/browser";
import Axios from "axios";
import { formatDate } from "date-fns";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { GroupID, Page, Status, Student } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

interface Props {
	changePage: (val: Page) => void;
}

const Attendance: FC<Props> = ({ changePage }) => {
	const { getStudentsAttendanceList, getStorageItem } = useFunctions();
	const {
		setShowErrorMessage,
		showErrorMessage,
		setError,
		error,
		userData,
		authenticateLecturer,
	} = useContextProvider();

	const [filterGroupID, setFilterGroupID] = useState<GroupID | undefined>(
		getStorageItem("filterGroupID", null)
	);
	const [filteredStudentList, setFilterStudentList] = useState<Student[]>([]);

	// Filter by group
	const filterStudents = (groupid: GroupID | undefined) => {
		const filteredStudents = attendanceList.filter(
			(student) => student.groupid === groupid
		);
		setFilterStudentList(filteredStudents);
	};

	const [attendanceList, setAttendanceList] = useState<Student[]>([]);
	const [clickedStudent, setClickedStudent] = useState<Student | null>(null);
	const [status, setStatus] = useState<boolean | null>(null);
	const changeStudentStatus = async (
		studentDetails: Student,
		present_status: Status
	) => {
		if (!studentDetails) {
			return alert("No data provided for this operation");
		}
		setClickedStudent(studentDetails);

		if (present_status === true || present_status === false) {
			try {
				const body = {
					index_number: studentDetails.index_number,
					present_status,
					groupid: studentDetails.groupid,
				};
				const updatedList = await Axios.put(
					"https://record-attendance.onrender.com/lec/tick_attendance",
					// "http://localhost:4002/lec/tick_attendance",
					body
				);

				setAttendanceList(updatedList.data);
			} catch (error: any) {
				console.log("🚀 ~ error:", error);
				setShowErrorMessage(true);
				setError({
					header: "Unexpected Error",
					description:
						"An unexpected error occurred. Please try again.",
				});
			}
		}
	};

	useEffect(() => {
		let { href: navigateTo } = window.location;
		filterStudents(filterGroupID);

		if (userData)
			if (
				!userData?.group1 &&
				(userData.group1 === "" ||
					userData.group2 === "" ||
					userData.group3 === "" ||
					userData.group4 === "")
			) {
				localStorage.removeItem("auth");
				navigateTo = "/signup";
			}

		localStorage.setItem("filterGroupID", JSON.stringify(filterGroupID));

		filterGroupID &&
			userData &&
			getStudentsAttendanceList(
				setAttendanceList,
				setShowErrorMessage,
				setError,
				filterGroupID
			);
	}, [filterGroupID]);

	useEffect(() => {
		if (!userData) return;

		userData && authenticateLecturer(userData.lecturer_id);
		setFilterGroupID(userData?.group1);
	}, []);

	const sendEmail = async (
		studentDetails: Student,
		status: boolean | null
	) => {
		const params = {
			to_name: studentDetails.fullname,
			to_index_number: studentDetails.index_number,
			status: status ? "PRESENT" : "ABSENT",
			to_email: studentDetails.email,
			date: formatDate(new Date(), "EEE LLL dd yyyy"),
			time: formatDate(new Date(), "K:mm aaa"),
			// ?Add coursecode to db and userData
			course_code: "AFR-297",
			// ?Add Gender to db and userData
			lecturer_name: `Mr/Mrs/Miss ${userData?.fullname}`,
			instructor_email: userData?.email,
		};

		(function () {
			emailjs.init({
				publicKey: "1sf3DhDraEHQxm8bN",
			});
		})();

		if (studentDetails.email && status !== null) {
			try {
				emailjs
					.send("attendance_service", "attendance_template", params)
					.then(
						() => {
							return;
						},
						(error) => {
							setShowErrorMessage(true);
							if (error.message?.includes("Failed to fetch")) {
								setError({
									header: "Failed to fetch",
									description:
										"Check your internet connection and try again.",
								});
							} else {
								setError({
									header: "Unexpected Error",
									description:
										"An unexpected error occurredd. Please try again.",
								});
							}

							return;
						}
					);
			} catch (error) {
				setShowErrorMessage(true);
				setError({
					header: "Unexpected Error",
					description:
						"An unexpected error occurredd. Please try again.",
				});

				return;
			}
		}
	};
	useEffect(() => {
		clickedStudent && sendEmail(clickedStudent, status);
	}, [clickedStudent, status]);

	const renderStudentRow = (student: Student, index: number) => (
		<tr key={student.index_number}>
			<td>{index + 1}</td>
			<td>{student.index_number}</td>
			<td>{student.fullname}</td>
			<td>{student.email}</td>
			<td>{student.groupid}</td>
			<td>
				<div>
					<input
						type="radio"
						name={`status${student.index_number}`}
						defaultChecked={
							student.attendance_date
								? formatDate(
										new Date(student.attendance_date),
										"EEE LLL dd yyyy"
								  ) ===
								  formatDate(new Date(), "EEE LLL dd yyyy")
									? student.present_status === true
									: false
								: false
						}
						onChange={() => {
							changeStudentStatus(student, true);
							setStatus(true);
						}}
					/>
					<span>Present</span>
				</div>
				<div>
					<input
						type="radio"
						name={`status${student.index_number}`}
						defaultChecked={
							student &&
							student.attendance_date &&
							formatDate(
								new Date(student.attendance_date),
								"EEE LLL dd yyyy"
							) === formatDate(new Date(), "EEE LLL dd yyyy")
								? student.present_status === false
								: false
						}
						onChange={() => {
							changeStudentStatus(student, false);
							setStatus(false);
						}}
					/>
					<span>Absent</span>
				</div>
			</td>
		</tr>
	);

	return (
		<section className="list-section">
			<p>Attendance</p>
			<div className="top">
				<div>
					<span>
						<Link to="/" onClick={() => changePage("Home")}>
							Home
						</Link>
						{" > "}
						<Link
							onClick={() => setFilterGroupID("")}
							to="/attendance"
						>
							Attendance
						</Link>
						{" > "}
						{filterGroupID && (
							<>
								<Link to="/attendance">
									Group {filterGroupID}
								</Link>
								{" >"}
							</>
						)}
					</span>
				</div>
				<button>
					GROUP
					<select
						name="group"
						id="group"
						value={filterGroupID ? filterGroupID : ""}
						onChange={(e) =>
							setFilterGroupID(e.target.value as GroupID)
						}
					>
						{userData && (
							<>
								<option value={userData.group1}>
									{userData.group1}
								</option>
								{userData.group2 && (
									<option value={userData.group2}>
										{userData.group2}
									</option>
								)}
								{userData.group3 && (
									<option value={userData.group3}>
										{userData.group3}
									</option>
								)}
								{userData.group4 && (
									<option value={userData.group4}>
										{userData.group4}
									</option>
								)}
							</>
						)}
					</select>
				</button>
			</div>

			<div className="list-container">
				<table border={1}>
					<thead>
						<tr>
							<th>No.</th>
							<th>Index Number</th>
							<th>Full Name</th>
							<th>Email</th>
							<th>Group ID</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredStudentList.length > 0
							? filteredStudentList.map(renderStudentRow)
							: attendanceList.map(renderStudentRow)}
					</tbody>
				</table>
			</div>

			{showErrorMessage && (
				<ErrorAlert
					error={error}
					setShowErrorMessage={setShowErrorMessage}
				/>
			)}
		</section>
	);
};

export default Attendance;
