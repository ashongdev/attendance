import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useContextProvider from "../hooks/useContextProvider";
import { Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
	mode: "edit" | "add" | "list" | "";
	setMode: Dispatch<SetStateAction<"edit" | "add" | "list" | "">>;
	label: string;
	editdata?: Omit<Student, "status">;
}

const Form: FC<Props> = ({
	setOpenModal,
	setShowAlertPopup,
	label,
	setMode,
	mode,
	editdata,
}) => {
	const { editStudentInfo } = useFunctions();
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

	const {
		register,
		// formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const addStudent = (data: Student) => {
		const newStudent = data;
		setStudentsList((prev) => [...prev, newStudent]);
		setShowAlertPopup(true);
	};

	const submitHandler = async (data: Omit<Student, "status">) => {
		if (!data) {
			setShowAlertPopup(true);
			alert("No data provided for this provided.");
			return;
		}

		mode === "add" && addStudent(data);

		if (!editdata) return alert("No data provided for this provided.");
		mode === "edit" &&
			editStudentInfo(
				editdata.index_number,
				data,
				studentsList,
				setStudentsList
			);
		setOpenModal(false);
		setMode("");
	};

	return (
		<div className="modal">
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className="header">
					<p>{label}</p>
				</div>

				<section>
					<div>
						<label htmlFor="name">Student Name</label>
						<input
							type="text"
							defaultValue={
								editdata && mode === "edit"
									? editdata.fullname
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
								editdata && mode === "edit"
									? editdata.index_number
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
								editdata && mode === "edit"
									? editdata.email
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
								editdata && mode === "edit"
									? editdata.groupid
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
							setMode("");
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
