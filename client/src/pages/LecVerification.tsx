import Axios from "axios";
import {
	ClipboardEvent,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import useInputFunctions from "../hooks/useInputFunctions";

interface Props {
	pageNo: number;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
}

const LecVerification: FC<Props> = ({ pageNo, setPageNo }) => {
	const { getStorageItem } = useFunctions();
	const {
		setShowAlertPopup,
		showAlertPopup,
		userData,
		setTimeLeft,
		minutes,
		seconds,
	} = useContextProvider();
	const { handleInput, handleKeyDown, handlePaste } = useInputFunctions();
	const { authenticateLecturer } = useContextProvider();

	const [showTextBox, setShowTextBox] = useState(false);
	const [showVerificationErr, setShowVerificationErr] =
		useState<boolean>(false);
	const [showVerifyButton, setShowVerifyButton] = useState<boolean>(false);
	const [verificationErr, setVerificationErr] = useState({
		header: "",
		description: "",
	});
	const [code, setCode] = useState("");
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const generateCode = async (userEmail: string) => {
		try {
			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/verify/${userEmail}`,
				// `http://localhost:4002/lec/verify/${userEmail}`,
				{ params: userData }
			);
			if (!res.data) return alert("An unexpected error occurred!");

			if (res.data.ok) {
				setShowVerifyButton(true);
				const endTime = Date.now() + 5 * 60 * 1000;

				setTimeLeft(5 * 60); // Reset timer back to 5 minutes
				const updateTimer = () => {
					const secondsLeft = Math.round(
						(endTime - Date.now()) / 1000
					);
					setTimeLeft(Math.max(secondsLeft, 0));

					if (secondsLeft <= 0 && timerRef.current) {
						clearInterval(timerRef.current);
					}
				};

				if (timerRef.current) {
					clearInterval(timerRef.current);
				}

				timerRef.current = setInterval(updateTimer, 1000);
				updateTimer();
			}
		} catch (error: any) {
			setShowVerificationErr(true);
			setVerificationErr({
				header: "Unexpected Error",
				description: "An unexpected error occurredd. Please try again.",
			});

			return;
		}
	};

	useEffect(() => {
		if (minutes === 0 && seconds === 0) {
			localStorage.removeItem("s");
		}
	}, [minutes, seconds]);
	// useEffect(() => {
	// 	console.log(code);
	// }, [code]);

	// const sendCode = async () => {
	// 	const salt = await genSalt(10);
	// 	const hashed = await hash(code, salt);

	// 	// generateCode(userData.email);

	// 	const params = {
	// 		to_name: userData?.fullname,
	// 		message: code,
	// 		to_email: userData?.email,
	// 	};
	// 	(function () {
	// 		emailjs.init({
	// 			publicKey: "WowjkcMQM9NGetQW7",
	// 		});
	// 	})();

	// 	if (userData?.email && code) {
	// 		try {
	// 			emailjs
	// 				.send("verification_service", "verification_form", params)
	// 				.then(
	// 					() => {
	// 						localStorage.setItem("s", JSON.stringify(hashed));
	// 					},
	// 					(error) => {
	// 						setShowVerificationErr(true);
	// 						if (error.message.includes("Failed to fetch")) {
	// 							setVerificationErr({
	// 								header: "Failed to fetch",
	// 								description:
	// 									"Check your internet connection and try again.",
	// 							});
	// 						} else {
	// 							setVerificationErr({
	// 								header: "Unexpected Error",
	// 								description:
	// 									"An unexpected error occurredd. Please try again.",
	// 							});
	// 						}

	// 						return;
	// 					}
	// 				);
	// 		} catch (error) {
	// 			setShowVerificationErr(true);
	// 			setVerificationErr({
	// 				header: "Unexpected Error",
	// 				description:
	// 					"An unexpected error occurredd. Please try again.",
	// 			});

	// 			return;
	// 		}
	// 	}
	// };

	// useEffect(() => {
	// 	if (userData?.email && code) sendCode();
	// }, [code]);

	const compareCode = async (codeInput: string, id: string) => {
		if (!id) {
			setShowVerificationErr(true);
			setVerificationErr({
				header: "Unexpected Error",
				description: "Unexpected error occurred. Please try again!",
			});

			return;
		}

		try {
			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/compare/${id}`,
				// `http://localhost:4002/lec/compare/${id}`,
				{ params: { code: codeInput } }
			);

			if (res.data.ok) {
				setShowVerificationErr(false);
				setShowAlertPopup(true);

				authenticateLecturer(id);
			}
		} catch (error: any) {
			setShowVerificationErr(true);
			if (error.response.data.error.toString().includes("Invalid")) {
				setShowVerificationErr(true);
				setVerificationErr({
					header: "404: Code errror",
					description: "Invalid verification code",
				});

				return;
			}

			setVerificationErr({
				header: "Unexpected Error",
				description: "An unexpected error occurred",
			});
		}

		return;
	};

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	const submit = () => {
		const otp = inputsRef.current.map((input) => input?.value).join("");
		userData && compareCode(otp, userData.lecturer_id);
	};

	useEffect(() => {
		localStorage.removeItem("auth");
		localStorage.removeItem("filterGroupID");
		localStorage.removeItem("page");
	}, []);

	return (
		<>
			<section
				className={`page2 ${pageNo === 4 ? "slide-in" : "slide-out"}`}
			>
				<h1>Verification Required</h1>
				<span>
					Enter the verification code sent to your email in the box
					below to complete your verification
				</span>
				<br />
				<br />
				<div className="block">
					{showTextBox && (
						<>
							<label htmlFor="name">Enter Code</label>
							<div
								className="otp-field"
								onPaste={(
									e: ClipboardEvent<HTMLInputElement>
								) => handlePaste(e, inputsRef, submit)}
							>
								{Array.from({ length: 6 }).map((_, index) => (
									<input
										key={index}
										ref={(el) =>
											(inputsRef.current[index] = el)
										}
										style={{
											border: `1px solid ${
												verificationErr.description.includes(
													"Invalid"
												)
													? "red"
													: "#9e9aa5"
											}`,
										}}
										type="text"
										maxLength={1}
										inputMode="numeric"
										onChange={(e) =>
											handleInput(
												index,
												e,
												inputsRef,
												submit
											)
										}
										onKeyDown={(e) =>
											handleKeyDown(index, e, inputsRef)
										}
									/>
								))}
							</div>
							{verificationErr.description.includes(
								"Invalid"
							) && (
								<p className="error">
									{verificationErr.description}
								</p>
							)}
							<div className="block">
								<button
									onClick={() => submit()}
									className="actions submit width"
									disabled={
										showVerifyButton && code ? false : true
									}
								>
									Verify
								</button>
							</div>
							<div
								className="block"
								style={{ textAlign: "center" }}
							>
								<Link
									to="/signup"
									onClick={() => {
										setPageNo(4);
										userData &&
											generateCode(userData.email);
									}}
								>
									Resend Code
								</Link>
							</div>
							<span>
								The code expires in {minutes}:
								{seconds < 10 ? `0${seconds}` : seconds}
							</span>
						</>
					)}

					{!showTextBox && (
						<>
							<button
								className="actions cancel"
								onClick={() => setPageNo(3)}
							>
								Back
							</button>
							<button
								className="actions submit"
								onClick={() => {
									userData && generateCode(userData.email);
									setShowTextBox(true);
								}}
							>
								Send Verification Code
							</button>
						</>
					)}
				</div>
			</section>

			{showAlertPopup && (
				<SuccessAlert setShowAlertPopup={setShowAlertPopup} />
			)}
			{showVerificationErr && (
				<ErrorAlert
					error={verificationErr}
					setShowErrorMessage={setShowVerificationErr}
				/>
			)}
		</>
	);
};

export default LecVerification;
