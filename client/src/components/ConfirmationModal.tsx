import { Dispatch, FC, SetStateAction } from "react";
import { Mode, Student } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

interface Props {
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
	editData?: Omit<Student, "present_status">;
	setError: Dispatch<SetStateAction<{ header: string; description: string }>>;
}

const Confirm: FC<Props> = ({
	setShowAlertPopup,
	setShowErrorMessage,
	setMode,
	editData,
	setError,
}) => {
	const { removeStudent, clearTimer } = useFunctions();
	const { setOpenModal, setStudentsList } = useContextProvider();

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
								Name: {editData ? editData.fullname : ""}
							</span>
							<br />
							<span>
								Index No:{" "}
								{editData ? editData.index_number : ""}
							</span>
							<br />
							<span>Email: {editData ? editData.email : ""}</span>
							<br />
							<span>
								Group ID: {editData ? editData.groupid : ""}
							</span>
						</div>
					</div>

					<button
						className="actions submit"
						onClick={() => {
							removeStudent(
								editData ? editData?.index_number : "",
								editData ? editData?.groupid : "",
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
							clearTimer();
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
