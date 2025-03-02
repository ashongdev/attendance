import emailjs from "@emailjs/browser";
import Axios from "axios";
import { compare, genSalt, hash } from "bcryptjs";
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
	const { setShowAlertPopup, showAlertPopup, userData } =
		useContextProvider();
	const { handleInput, handleKeyDown, handlePaste } = useInputFunctions();

	const [showTextBox, setShowTextBox] = useState(false);
	const [showVerificationErr, setShowVerificationErr] = useState<
		boolean | "clear"
	>(false);
	const [code, setCode] = useState("");
	const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const timerRef = useRef<number | null>(null);

	const generateCode = async () => {
		try {
			const res = await Axios.get(
				"https://record-attendance.onrender.com/lec/verify"
			);
			if (!res.data) return alert("An unexpected error occurred!");

			setCode(res.data);
			setTimeLeft(5 * 60); // Reset timer back to 5 minutes

			const endTime = Date.now() + 5 * 60 * 1000;

			const updateTimer = () => {
				const secondsLeft = Math.round((endTime - Date.now()) / 1000);
				setTimeLeft(Math.max(secondsLeft, 0));

				if (secondsLeft <= 0 && timerRef.current) {
					clearInterval(timerRef.current);
				}
			};

			if (timerRef.current) {
				clearInterval(timerRef.current);
			}

			timerRef.current = setInterval(
				updateTimer,
				1000
			) as unknown as number;
			updateTimer();
		} catch (error) {}
	};

	const s = getStorageItem("s", null);
	useEffect(() => {
		if (minutes === 0 && seconds === 0) {
			localStorage.removeItem("s");
		}
	}, [minutes, seconds]);

	const sendCode = async () => {
		const salt = await genSalt(10);
		const hashed = await hash(code, salt);

		localStorage.setItem("s", JSON.stringify(hashed));
		const params = {
			to_name: userData?.fullname,
			message: code,
			to_email: userData?.email,
		};
		(function () {
			emailjs.init({
				publicKey: "WowjkcMQM9NGetQW7",
			});
		})();

		if (userData?.email && code) {
			emailjs
				.send("verification_service", "verification_form", params)
				.then(
					() => {
						alert("Check your inbox for the verification");
					},
					(error) => {
						setShowVerificationErr(true);
					}
				);
		}
	};

	const compareCode = async (codeInput: string) => {
		const hashedCode = getStorageItem("s", null);

		if (!hashedCode) {
			alert(
				"The verification code you entered has expired. Please request a new code and check your inbox."
			);
		}

		try {
			const matches = await compare(codeInput, hashedCode);

			if (matches) {
				localStorage.setItem("userData", JSON.stringify(userData));

				setShowVerificationErr(false);
				setShowAlertPopup(true);

				setTimeout(() => {
					window.location.href = "/";
				}, 1500);
			} else {
				setShowVerificationErr(true);
			}
		} catch (error) {}
		return;
	};

	const isMounted = useRef(false);

	useEffect(() => {
		if (isMounted.current) {
			sendCode();
		} else {
			isMounted.current = true; // First Render
		}
	}, [code]);

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	const submit = () => {
		const otp = inputsRef.current.map((input) => input?.value).join("");
		compareCode(otp);
	};

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
												showVerificationErr === true
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
							{showVerificationErr === true && (
								<p className="error">
									Invalid code. Check your email and try
									again.
								</p>
							)}
							<div className="block">
								<button
									onClick={() => submit()}
									className="actions submit width"
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
										generateCode();
										setShowVerificationErr("clear");
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
									generateCode();
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
		</>

		// </div>
	);
};

export default LecVerification;
