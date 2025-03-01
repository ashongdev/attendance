import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confirm from "../components/ConfirmationModal";
import ErrorAlert from "../components/ErrorAlert";
import Form from "../components/Form";
import SuccessAlert from "../components/SuccessAlert";
import { Page, Student } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import editIcon from "../images/create-outline.svg";
import trashCanIcon from "../images/trash-outline.svg";

interface Props {
	changePage: (val: Page) => void;
}

const List: FC<Props> = ({ changePage }) => {
	const { getStudentsList } = useFunctions();
	const {
		studentsList,
		setStudentsList,
		mode,
		setMode,
		showAlertPopup,
		setShowAlertPopup,
		setShowErrorMessage,
		showErrorMessage,
		setError,
		error,
		openModal,
		setOpenModal,
		userData,
	} = useContextProvider();

	const [studentToBeEdited, setStudentToBeEdited] = useState<
		Omit<Student, "present_status">
	>({ fullname: "", index_number: "", groupid: "", email: "" });

	const getStudentInfo = (index_number: string) => {
		const student = studentsList.find(
			(std) => std.index_number === index_number
		);

		if (!student) return;

		setStudentToBeEdited(student);
	};

	useEffect(() => {
		userData &&
			getStudentsList(
				setStudentsList,
				setShowErrorMessage,
				setError,
				userData.group1
			);
	}, []);

	return (
		<section className="list-section">
			{openModal && mode === "del" && (
				<Confirm
					setShowAlertPopup={setShowAlertPopup}
					setShowErrorMessage={setShowErrorMessage}
					setMode={setMode}
					mode={mode}
					editData={studentToBeEdited}
					setError={setError}
				/>
			)}

			<p>Students</p>
			<div className="top">
				<div>
					<span>
						<Link to="/" onClick={() => changePage("Home")}>
							Home
						</Link>{" "}
						{"> "}
						<Link to="/list">Students</Link>
						{" > "}
						{studentsList &&
							studentsList.length > 0 &&
							studentsList[0].groupid && (
								<>
									<Link to="/list">
										Group {studentsList[0].groupid}
									</Link>
									{" > "}
								</>
							)}
					</span>
				</div>

				<button
					className="add"
					onClick={() => {
						setMode("add");
						setOpenModal(true);
					}}
				>
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
						{studentsList &&
							studentsList.length > 0 &&
							studentsList.map((student, index) => (
								<tr key={student.index_number}>
									<td>{index + 1}</td>
									<td>{student.index_number}</td>
									<td>{student.fullname}</td>
									<td>{student.email}</td>
									<td>{student.groupid}</td>
									<td>
										<button
											onClick={() => {
												setOpenModal(true);
												setMode("edit");
												getStudentInfo(
													student.index_number
												);
											}}
										>
											<img
												src={editIcon}
												className="action-icon"
												alt="edit-icon"
											/>
										</button>
										<button
											onClick={() => {
												setMode("del");
												getStudentInfo(
													student.index_number
												);
												setOpenModal(true);
											}}
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

			{openModal && (mode === "add" || mode === "edit") && (
				<Form
					setShowAlertPopup={setShowAlertPopup}
					setShowErrorMessage={setShowErrorMessage}
					setMode={setMode}
					mode={mode}
					label={
						mode === "add" ? "Add New Student" : "Edit Student Info"
					}
					editdata={studentToBeEdited}
					setError={setError}
				/>
			)}

			{showAlertPopup && (
				<SuccessAlert setShowAlertPopup={setShowAlertPopup} />
			)}

			{showErrorMessage && (
				<ErrorAlert
					error={error}
					setShowErrorMessage={setShowErrorMessage}
				/>
			)}
		</section>
	);
};

export default List;
