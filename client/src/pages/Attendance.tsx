import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GroupID, Page, Status, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";
import useContextProvider from "../hooks/useContextProvider";

interface Props {
	changePage: (val: Page) => void;
}

const Attendance: FC<Props> = ({ changePage }) => {
	const { getStorageItem } = useFunctions();
	const { studentsList } = useContextProvider();

	const [clickedStudent, setClickedStudent] = useState("");
	// const [showAlertPopup, setShowAlertPopup] = useState(false);
	const [filterGroupID, setFilterGroupID] = useState<GroupID>("");
	const [filteredStudentList, setFilterStudentList] = useState<Student[]>([]);
	const [studentStatus, setStudentStatus] = useState<Status | null>(null);

	// Filter by group
	const filterStudents = (groupID: GroupID) => {
		const filteredStudents = studentsList.filter(
			(student) => student.groupID === groupID
		);
		setFilterStudentList(filteredStudents);
	};

	// Update status Present/Absent
	const changeStudentStatus = async (indexNumber: string, status: Status) => {
		// Retrieve student indexnumber and set status
		setClickedStudent(indexNumber);
		setStudentStatus(status);
	};

	useEffect(() => {
		const student = studentsList.findIndex(
			(std) => std.indexNumber === clickedStudent
		);
		if (studentStatus === "Present") {
			studentsList[student].status = true;
		} else if (studentStatus === "Absent") {
			studentsList[student].status = false;
		}

		localStorage.setItem("students", JSON.stringify(studentsList));
	}, [studentStatus]);

	useEffect(() => {
		filterStudents(filterGroupID);
	}, [filterGroupID]);

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
									{" > "}
								</Link>
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
							<th>Group</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredStudentList.length <= 0
							? studentsList.map((student) => (
									<tr key={student.no}>
										<td>{student.no}</td>
										<td>{student.indexNumber}</td>
										<td>{student.fullName}</td>
										<td>{student.email}</td>
										<td>{student.groupID}</td>
										<td>
											<div>
												<input
													type="radio"
													name={`status${student.no}`}
													defaultChecked={
														student.status === true
													}
													onChange={() => {
														changeStudentStatus(
															student.indexNumber,
															"Present"
														);
													}}
												/>
												<span>Present</span>
											</div>
											<div>
												<input
													type="radio"
													name={`status${student.no}`}
													defaultChecked={
														student.status === false
													}
													onChange={(e) => {
														changeStudentStatus(
															student.indexNumber,
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
									<tr key={student.no}>
										<td>{student.no}</td>
										<td>{student.indexNumber}</td>
										<td>{student.fullName}</td>
										<td>{student.email}</td>
										<td>{student.groupID}</td>
										<td>
											<div>
												<input
													type="radio"
													name={`status${student.no}`}
													defaultChecked={
														student.status === true
													}
													onChange={() => {
														changeStudentStatus(
															student.indexNumber,
															"Present"
														);
													}}
												/>
												<span>Present</span>
											</div>
											<div>
												<input
													type="radio"
													name={`status${student.no}`}
													defaultChecked={
														student.status === false
													}
													onChange={() => {
														changeStudentStatus(
															student.indexNumber,
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
