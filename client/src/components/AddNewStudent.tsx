import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useContextProvider from "../hooks/useContextProvider";
import { GroupID, Student } from "../exports/exports";

interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
}

const AddNewStudent: FC<Props> = ({ setOpenModal, setShowAlertPopup }) => {
	const { studentsList, setStudentsList } = useContextProvider();
	const Schema = yup.object().shape({
		indexNumber: yup
			.string()
			.required()
			.matches(/^[0-9]{10}$/),
		fullName: yup.string().required(),
		groupID: yup
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
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const addStudent = (data: Omit<Student, "no">) => {
		const newID =
			studentsList.length > 0
				? studentsList[studentsList.length - 1].no + 1
				: 1;
		const newStudent = { no: newID, ...data };

		setStudentsList((prev) => [...prev, newStudent]);

		setShowAlertPopup(true);
	};

	const submitHandler = async (data: any) => {
		addStudent(data);
	};

	return (
		<div className="modal">
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className="header">
					<p>Add New Student</p>
				</div>

				<section>
					<div>
						<label htmlFor="name">Student Name</label>
						<input
							type="text"
							placeholder="e.g., Emmanuel Asamoah"
							{...register("fullName")}
						/>
					</div>
					<div>
						<label htmlFor="name">Index Number</label>
						<input
							type="text"
							maxLength={10}
							placeholder="e.g., 4211231199"
							{...register("indexNumber")}
						/>
					</div>
					<div>
						<label htmlFor="name">Email Address</label>
						<input
							type="email"
							placeholder="e.g., test@example.us"
							{...register("email")}
						/>
					</div>
					<div>
						<label htmlFor="name">Group</label>
						<select id="group" {...register("groupID")}>
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
						onClick={() => setOpenModal(false)}
					>
						Cancel
					</button>
				</section>
			</form>
		</div>
	);
};

export default AddNewStudent;
