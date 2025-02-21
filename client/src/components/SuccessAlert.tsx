import { Dispatch, FC, SetStateAction } from "react";
import checkmark from "../images/checkmark.png";
import useContextProvider from "../hooks/useContextProvider";

interface Props {
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
}
const SuccessAlert: FC<Props> = ({ setShowAlertPopup }) => {
	const { mode } = useContextProvider();

	return (
		<div className="alert-container">
			<div className="alert-content">
				<div className="icon-container">
					<img src={checkmark} className="icon" />
				</div>

				<div className="alert-text">
					<p className="alert-title">Success</p>
					<p className="alert-description">
						Student {mode === "edit" && "info"} has been
						succcessfully {mode === "edit" ? "updated" : ""}
						{mode === "del" ? "removed" : ""}
						{mode === "add" ? "added" : ""}!
					</p>
				</div>

				<button onClick={() => setShowAlertPopup(false)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="white"
						className="close"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default SuccessAlert;
