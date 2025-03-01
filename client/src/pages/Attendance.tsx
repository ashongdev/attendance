import Axios from "axios";
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
	const { getStudentsList, getStorageItem } = useFunctions();
	const {
		studentsList,
		setStudentsList,
		setShowErrorMessage,
		showErrorMessage,
		setError,
		error,
		userData,
	} = useContextProvider();

	const [filterGroupID, setFilterGroupID] = useState<GroupID | undefined>(
		getStorageItem("filterGroupID", null)
	);
	const [filteredStudentList, setFilterStudentList] = useState<Student[]>([]);

	// Filter by group
	const filterStudents = (groupid: GroupID | undefined) => {
		const filteredStudents = studentsList.filter(
			(student) => student.groupid === groupid
		);
		setFilterStudentList(filteredStudents);
	};

	const changeStudentStatus = async (
		studentDetails: Student,
		present_status: Status
	) => {
		if (present_status === true || present_status === false) {
			try {
				const updatedList = await Axios.put(
					"http://localhost:4002/lec/tick_attendance",
					{
						index_number: studentDetails.index_number,
						present_status,
						groupid: studentDetails.groupid,
					}
				);

				setStudentsList([]);
				setStudentsList(updatedList.data);
			} catch (error) {
				console.log("🚀 ~ error:", error);
				alert("An unexpected error occurred");
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
				localStorage.removeItem("s");
				localStorage.removeItem("userData");
				navigateTo = "/signup";
			}

		localStorage.setItem("filterGroupID", JSON.stringify(filterGroupID));

		userData &&
			getStudentsList(
				setStudentsList,
				setShowErrorMessage,
				setError,
				filterGroupID
			);
	}, [filterGroupID]);

	useEffect(() => {
		userData && setFilterGroupID(userData?.group1);
	}, []);

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
						value={filterGroupID}
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
						{filteredStudentList.length <= 0
							? studentsList.length > 0 &&
							  studentsList.map((student, index) => (
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
														student.present_status ===
														true
													}
													onChange={() => {
														changeStudentStatus(
															student,
															true
														);
													}}
												/>
												<span>Present</span>
											</div>
											<div>
												<input
													type="radio"
													name={`status${student.index_number}`}
													defaultChecked={
														student.present_status ===
															false && true
													}
													onChange={(e) => {
														changeStudentStatus(
															student,
															false
														);
													}}
												/>
												<span>Absent</span>
											</div>
										</td>
									</tr>
							  ))
							: filteredStudentList.map((student) => (
									<tr key={student.index_number}>
										<td>{student.index_number}</td>
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
														student.present_status ===
														true
													}
													onChange={() => {
														changeStudentStatus(
															student,
															true
														);
													}}
												/>
												<span>Present</span>
											</div>
											<div>
												<input
													type="radio"
													name={`status${student.index_number}`}
													defaultChecked={
														student.present_status ===
															false && true
													}
													onChange={() => {
														changeStudentStatus(
															student,
															false
														);
													}}
												/>
												<span>Absent</span>
											</div>
										</td>
									</tr>
							  ))}
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
