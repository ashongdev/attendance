import React, { Dispatch, FC, SetStateAction } from "react";
import closeIcon from "../images/close-circle-outline.svg";

interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
}

const AddNewStudent: FC<Props> = ({ setOpenModal, setShowAlertPopup }) => {
	return (
		<div className="modal">
			<form onSubmit={(e) => e.preventDefault()}>
				<div className="header">
					<p>Add New Student</p>
					{/* <img src={closeIcon} className="icon" alt="" /> */}
				</div>

				<section>
					<div>
						<label htmlFor="name">Student Name</label>
						<input
							type="text"
							placeholder="e.g., Emmanuel Asamoah"
						/>
					</div>
					<div>
						<label htmlFor="name">Index Number</label>
						<input
							type="text"
							maxLength={10}
							placeholder="e.g., 4211231199"
						/>
					</div>
					<div>
						<label htmlFor="name">Email Address</label>
						<input
							type="email"
							placeholder="e.g., test@example.us"
						/>
					</div>
					<div>
						<label htmlFor="name">Group</label>
						<select name="group" id="group">
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

					<div>
						<button
							className="actions submit"
							onClick={() => setShowAlertPopup(true)}
						>
							Submit
						</button>
						<button
							className="actions cancel"
							onClick={() => setOpenModal(false)}
						>
							Cancel
						</button>
					</div>
				</section>
			</form>
		</div>
	);
};

export default AddNewStudent;
