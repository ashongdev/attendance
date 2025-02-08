import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Page } from "../exports/exports";

interface Props {
	changePage: (val: Page) => void;
}
const Attendance: FC<Props> = ({ changePage }) => {
	const [showAlertPopup, setShowAlertPopup] = useState(false);

	useEffect(() => {
		if (showAlertPopup) {
			setTimeout(() => {
				setShowAlertPopup(false);
			}, 1500);
		}
	}, [showAlertPopup]);

	const students = [
		{
			no: 1,
			indexNumber: "4211238891",
			fullName: "John Doe",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 2,
			indexNumber: "4211238892",
			fullName: "Jane Smith",
			groupId: "G2",
			email: "nobody@gmail.com",
		},
		{
			no: 3,
			indexNumber: "4211238893",
			fullName: "Michael Johnson",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 4,
			indexNumber: "4211238894",
			fullName: "Emily Williams",
			groupId: "G3",
			email: "nobody@gmail.com",
		},
		{
			no: 5,
			indexNumber: "4211238895",
			fullName: "David Brown",
			groupId: "G2",
			email: "nobody@gmail.com",
		},
		{
			no: 6,
			indexNumber: "4211238896",
			fullName: "Sarah Davis",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 7,
			indexNumber: "4211238897",
			fullName: "Daniel Wilson",
			groupId: "G3",
			email: "nobody@gmail.com",
		},
		{
			no: 11,
			indexNumber: "4211238891",
			fullName: "John Doe",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 21,
			indexNumber: "4211238892",
			fullName: "Jane Smith",
			groupId: "G2",
			email: "nobody@gmail.com",
		},
		{
			no: 31,
			indexNumber: "4211238893",
			fullName: "Michael Johnson",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 41,
			indexNumber: "4211238894",
			fullName: "Emily Williams",
			groupId: "G3",
			email: "nobody@gmail.com",
		},
		{
			no: 51,
			indexNumber: "4211238895",
			fullName: "David Brown",
			groupId: "G2",
			email: "nobody@gmail.com",
		},
		{
			no: 61,
			indexNumber: "4211238896",
			fullName: "Sarah Davis",
			groupId: "G1",
			email: "nobody@gmail.com",
		},
		{
			no: 71,
			indexNumber: "4211238897",
			fullName: "Daniel Wilson",
			groupId: "G3",
			email: "nobody@gmail.com",
		},
	];

	return (
		<section className="list-section">
			<p>Students</p>
			<div className="top">
				<div>
					<span>
						<Link to="/" onClick={() => changePage("Home")}>
							Home
						</Link>
						{"> "}
						<Link to="/attendance">Attendance</Link> {"> "}
					</span>
				</div>
				<button>
					GROUP
					<select name="group" id="group">
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
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr key={student.no}>
								<td>{student.no}</td>
								<td>{student.indexNumber}</td>
								<td>{student.fullName}</td>
								<td>{student.email}</td>
								<td>
									<div>
										<input
											type="radio"
											name={`status${student.no}`}
										/>
										<span>Present</span>
									</div>
									<div>
										<input
											type="radio"
											name={`status${student.no}`}
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
