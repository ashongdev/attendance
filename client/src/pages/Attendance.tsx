import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GroupID, Page, Status, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";
import useContextProvider from "../hooks/useContextProvider";

interface Props {
	changePage: (val: Page) => void;
}

const Attendance: FC<Props> = ({ changePage }) => {
	const { getStudentsList } = useFunctions();
	const { studentsList, setStudentsList } = useContextProvider();

	const [clickedStudent, setClickedStudent] = useState("");
	// const [showAlertPopup, setShowAlertPopup] = useState(false);
	const [filterGroupID, setFilterGroupID] = useState<GroupID>("");
	const [filteredStudentList, setFilterStudentList] = useState<Student[]>([]);
	const [studentStatus, setStudentStatus] = useState<Status | null>(null);

	// Filter by group
	const filterStudents = (groupid: GroupID) => {
		const filteredStudents = studentsList.filter(
			(student) => student.groupid === groupid
		);
		setFilterStudentList(filteredStudents);
	};

	// Update status Present/Absent
	const changeStudentStatus = async (
		index_number: string,
		status: Status
	) => {
		// Retrieve student index_number and set status
		setClickedStudent(index_number);
		setStudentStatus(status);
	};

	useEffect(() => {
		const student = studentsList.findIndex(
			(std) => std.index_number === clickedStudent
		);
		if (studentStatus === "Present") {
			studentsList[student].status = true;
		} else if (studentStatus === "Absent") {
			studentsList[student].status = false;
		}
	}, [studentStatus]);

	useEffect(() => {
		filterStudents(filterGroupID);
	}, [filterGroupID]);

	useEffect(() => {
		getStudentsList(setStudentsList);
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
						{/* {filterGroupID && (
							<>
								<Link to="/attendance">
									Group {filterGroupID}
								</Link>
								{" >"}
							</>
						)} */}
						{studentsList &&
							studentsList.length > 0 &&
							studentsList[0].groupid && (
								<>
									<Link to="/attendance">
										Group {studentsList[0].groupid}
									</Link>
									{" >"}
								</>
							)}
					</span>
				</div>
				{/* <button>
					GROUP
					<select
						name="group"
						id="group"
						value={filterGroupID}
						onChange={(e) =>
							setFilterGroupID(e.target.value as GroupID)
						}
					>
						<option value="">--</option>
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="D">D</option>
						<option value="E">E</option>
						<option value="F">F</option>
						<option value="G">G</option>
						<option value="H">H</option>
					</select>
				</button> */}
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
							? studentsList.map((student, index) => (
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
														student.status === true
													}
													onChange={() => {
														changeStudentStatus(
															student.index_number,
															"Present"
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
														student.status === false
													}
													onChange={(e) => {
														changeStudentStatus(
															student.index_number,
															"Absent"
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
														student.status === true
													}
													onChange={() => {
														changeStudentStatus(
															student.index_number,
															"Present"
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
														student.status === false
													}
													onChange={() => {
														changeStudentStatus(
															student.index_number,
															"Absent"
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
		</section>
	);
};

export default Attendance;
