import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { GroupID, Mode, Student } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
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

	type StudentFormData = yup.InferType<typeof Schema>;

	const Schema = yup.object().shape({
		index_number: yup
			.string()
			.required()
			.matches(/^[0-9]{10}$/),
		fullname: yup.string().required(),
		groupid: yup
			.string()
			.required()
			.matches(/^[A-H]$/i) as yup.StringSchema<GroupID>,
		email: yup
			.string()
			.email()
			.required()
			.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
	});
	const { getStorageItem } = useFunctions();
	const { userData } = useContextProvider();

	const { register, handleSubmit } = useForm<StudentFormData>({
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

	const timerRef = useRef<number>(0);
	const filterGroupID = getStorageItem("filterGroupID", null);
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
									: filterGroupID
							}
						>
							<option value="">--Select Group--</option>
							{userData && (
								<>
									<option value={userData.group1}>
										{userData.group1}
									</option>
									{userData.group2 && (
										<option value={userData.group2}>
											{userData.group2}
										</option>
									)}
									{userData.group3 && (
										<option value={userData.group3}>
											{userData.group3}
										</option>
									)}
									{userData.group4 && (
										<option value={userData.group4}>
											{userData.group4}
										</option>
									)}
								</>
							)}
						</select>
					</div>

					<button className="actions submit">Submit</button>
					<button
						className="actions cancel"
						onClick={() => {
							if (timerRef.current) {
								clearTimeout(timerRef.current);
							}
							timerRef.current = setTimeout(() => {
								setMode("");
							}, 2000) as unknown as number;
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
