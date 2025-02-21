import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useContextProvider from "../hooks/useContextProvider";
import { Mode, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

interface Props {
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
	label: string;
	editdata?: Omit<Student, "status">;
	setError: Dispatch<SetStateAction<{ header: string; description: string }>>;
}

const Form: FC<Props> = ({
	setShowAlertPopup,
	setShowErrorMessage,
	label,
	setMode,
	mode,
	editdata,
	setError,
}) => {
	const { editStudentInfo, addStudent } = useFunctions();
	const { studentsList, setStudentsList, setOpenModal } =
		useContextProvider();

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

	const {
		register,
		// formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const submitHandler = async (data: Omit<Student, "status">) => {
		if (!data) {
			alert("No data provided for this provided.");
			return;
		}

		if (!editdata) return alert("No data provided for this provided.");

		if (mode === "add") {
			addStudent(
				data,
				setShowAlertPopup,
				setStudentsList,
				setOpenModal,
				setMode,
				setShowErrorMessage,
				setError
			);
		} else if (mode === "edit") {
			editStudentInfo(
				editdata.index_number,
				data,
				studentsList,
				setStudentsList,
				setOpenModal,
				setShowAlertPopup,
				setMode
			);
		}
	};

	return (
		<div className="modal">
			<form onSubmit={handleSubmit(submitHandler)} className="cont">
				<div className="header">
					<p>{label}</p>
				</div>

				<section>
					<div>
						<label htmlFor="name">Student Name</label>
						<input
							type="text"
							defaultValue={
								mode === "edit"
									? editdata && editdata.fullname
									: ""
							}
							placeholder="e.g., Emmanuel Asamoah"
							{...register("fullname")}
						/>
					</div>
					<div>
						<label htmlFor="name">Index Number</label>
						<input
							type="text"
							maxLength={10}
							defaultValue={
								mode === "edit"
									? editdata && editdata.index_number
									: ""
							}
							placeholder="e.g., 4211231199"
							{...register("index_number")}
						/>
					</div>
					<div>
						<label htmlFor="name">Email Address</label>
						<input
							type="email"
							defaultValue={
								mode === "edit"
									? editdata && editdata.email
									: ""
							}
							placeholder="e.g., test@example.us"
							{...register("email")}
						/>
					</div>
					<div>
						<label htmlFor="name">Group</label>
						<select
							id="group"
							{...register("groupid")}
							defaultValue={
								mode === "edit"
									? editdata && editdata.groupid
									: ""
							}
						>
							<option value="">--Select Group--</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="D">D</option>
							<option value="E">E</option>
							<option value="F">F</option>
							<option value="G">G</option>
							<option value="H">H</option>
						</select>
					</div>

					<button className="actions submit">Submit</button>
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
			</form>
		</div>
	);
};

export default Form;
