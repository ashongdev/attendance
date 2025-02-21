import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Axios from "axios";
import useContextProvider from "../hooks/useContextProvider";
import { Mode, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";
import ErrorAlert from "./ErrorAlert";

interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
	editdata?: Omit<Student, "status">;
	setError: Dispatch<SetStateAction<{ header: string; description: string }>>;
}

const Confirm: FC<Props> = ({
	setOpenModal,
	setShowAlertPopup,
	setShowErrorMessage,
	setMode,
	mode,
	editdata,
	setError,
}) => {
	const { removeStudent } = useFunctions();
	const { studentsList, setStudentsList } = useContextProvider();

	const Schema = yup.object().shape({
		index_number: yup
			.string()
			.required()
			.matches(/^[0-9]{10}$/),
		fullname: yup.string().required(),
		groupid: yup
			.string()
			.required()
			.matches(/^[A-H]{1}$/i),
		email: yup
			.string()
			.email()
			.required()
			.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
	});

	return (
		<div className="modal">
			<div className="cont">
				<div className="header">
					<p style={{ textAlign: "center" }}>
						Are you sure you want to remove this student?
					</p>
				</div>

				<section>
					<div>
						<label className="details">Student Details</label>
						<div className="details">
							<span>
								Name: {editdata ? editdata.fullname : ""}
							</span>
							<br />
							<span>
								Index No:{" "}
								{editdata ? editdata.index_number : ""}
							</span>
							<br />
							<span>Email: {editdata ? editdata.email : ""}</span>
							<br />
							<span>
								Group ID: {editdata ? editdata.groupid : ""}
							</span>
						</div>
					</div>

					<button
						className="actions submit"
						onClick={() => {
							removeStudent(
								editdata ? editdata?.index_number : "",
								setShowErrorMessage,
								setError,
								setStudentsList,
								setOpenModal,
								setMode,
								setShowAlertPopup
							);
						}}
					>
						Yes, Remove
					</button>
					<button
						className="actions cancel"
						onClick={() => {
							setTimeout(() => {
								setMode("");
							}, 2000);
							setOpenModal(false);
						}}
					>
						Cancel
					</button>
				</section>
			</div>
		</div>
	);
};

export default Confirm;
