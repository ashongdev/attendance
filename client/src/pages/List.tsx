import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddNewStudent from "../components/AddNewStudent";
import SuccessAlert from "../components/SuccessAlert";
import { Page } from "../exports/exports";

interface Props {
	changePage: (val: Page) => void;
}

const List: FC<Props> = ({ changePage }) => {
	const [openModal, setOpenModal] = useState(false);
	const [showAlertPopup, setShowAlertPopup] = useState(false);

	useEffect(() => {
		if (showAlertPopup) {
			setOpenModal(false);
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
						</Link>{" "}
						{"> "}
						<Link to="/list">Students</Link>
						{"> "}
					</span>
				</div>

				<button className="add" onClick={() => setOpenModal(true)}>
					<span>+</span> Add New Student
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
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr key={student.no}>
								<td>{student.no}</td>
								<td>{student.indexNumber}</td>
								<td>{student.fullName}</td>
								<td>{student.email}</td>
								<td>{student.groupId}</td>
								<td>
									<button>Edit</button>
									<button>Remove</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{openModal && (
				<AddNewStudent
					setOpenModal={setOpenModal}
					setShowAlertPopup={setShowAlertPopup}
				/>
			)}

			{showAlertPopup && (
				<SuccessAlert setShowAlertPopup={setShowAlertPopup} />
			)}
		</section>
	);
};

export default List;
