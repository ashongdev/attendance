import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddNewStudent from "../components/AddNewStudent";
import SuccessAlert from "../components/SuccessAlert";
import { Page } from "../exports/exports";
import editIcon from "../images/create-outline.svg";
import trashCanIcon from "../images/trash-outline.svg";
import useFunctions from "../hooks/useFunctions";
import useContextProvider from "../hooks/useContextProvider";

interface Props {
	changePage: (val: Page) => void;
}

const List: FC<Props> = ({ changePage }) => {
	const { studentsList, setStudentsList } = useContextProvider();

	const [openModal, setOpenModal] = useState(false);
	const [showAlertPopup, setShowAlertPopup] = useState(false);

	const removeStudent = (indexNumber: string) => {
		const newList = studentsList.filter(
			(std) => std.indexNumber !== indexNumber
		);

		setStudentsList(newList);
	};

	useEffect(() => {
		if (showAlertPopup) {
			setOpenModal(false);
			setTimeout(() => {
				setShowAlertPopup(false);
			}, 1500);
		}
	}, [showAlertPopup]);

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
						{studentsList.map((student) => (
							<tr key={student.no}>
								<td>{student.no}</td>
								<td>{student.indexNumber}</td>
								<td>{student.fullName}</td>
								<td>{student.email}</td>
								<td>{student.groupID}</td>
								<td>
									<button>
										<img
											src={editIcon}
											className="action-icon"
											alt="edit-icon"
										/>
									</button>
									<button
										onClick={() =>
											removeStudent(student.indexNumber)
										}
									>
										<img
											src={trashCanIcon}
											className="action-icon"
											alt="delete-icon"
										/>
									</button>
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
