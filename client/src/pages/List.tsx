import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confirm from "../components/ConfirmationModal";
import ErrorAlert from "../components/ErrorAlert";
import Form from "../components/Form";
import Search from "../components/Search";
import SuccessAlert from "../components/SuccessAlert";
import { Student } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import editIcon from "../images/create-outline.svg";
import trashCanIcon from "../images/trash-outline.svg";

const List = () => {
	const { getStudentsList, searchFunction } = useFunctions();
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
		authenticateLecturer,
		setPage,
	} = useContextProvider();
	const [filteredStudentsList, setFilteredStudentsList] = useState<
		Student[] | null
	>(null);
	const [searchValue, setSearchValue] = useState("");
	const [searchByValue, setSearchByValue] = useState<"id" | "name">("name");

	const [studentToBeEdited, setStudentToBeEdited] = useState<
		Omit<Student, "present_status" | "attendance_date" | "attendance_date">
	>({ fullname: "", index_number: "", groupid: "", email: "" });

	const getStudentInfo = (index_number: string) => {
		const student = studentsList.find(
			(std) => std.index_number === index_number
		);

		if (!student) return;

		setStudentToBeEdited(student);
	};

	useEffect(() => {
		searchFunction(
			studentsList,
			setFilteredStudentsList,
			searchByValue,
			searchValue,
			"index_number"
		);
	}, [searchValue]);

	useEffect(() => {
		setPage(window.location.pathname);

		if (!userData) return;

		authenticateLecturer(userData.lecturer_id);

		getStudentsList(
			setStudentsList,
			setShowErrorMessage,
			setError,
			userData.group1,
			userData.group2,
			userData.group3,
			userData.group4
		);
	}, []);

	const renderStudentRow = (student: any, index: number) => {
		return (
			<tr key={student.index_number}>
				<td>{index + 1}</td>
				<td>{student.index_number}</td>
				<td>{student.fullname}</td>
				<td>{student.email}</td>
				<td className="groupid">{student.groupid}</td>
				<td className="status">
					<button
						onClick={() => {
							setOpenModal(true);
							setMode("edit");
							getStudentInfo(student.index_number);
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
							getStudentInfo(student.index_number);
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
		);
	};

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
						<Link to="/dashboard">Home</Link> {"> "}
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

			<Search
				setSearchByValue={setSearchByValue}
				searchByValue={searchByValue}
				setSearchValue={setSearchValue}
				searchValue={searchValue}
			/>

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
						{filteredStudentsList &&
						filteredStudentsList.length > 0 ? (
							filteredStudentsList.map(renderStudentRow)
						) : studentsList && studentsList.length > 0 ? (
							studentsList.map(renderStudentRow)
						) : (
							<p className="nothing">Nothing to see here 😭</p>
						)}
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

			{showErrorMessage && <ErrorAlert />}
		</section>
	);
};

export default List;
