import emailjs from "@emailjs/browser";
import { compare, genSalt, hash } from "bcryptjs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";
import { Lecturer } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

interface Props {
	pageNo: number;
	register: any;
	watch: any;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
	userData: Omit<Lecturer, "confirmPassword"> | null;
}

const LecVerification: FC<Props> = ({
	pageNo,
	register,
	errors,
	setPageNo,
	userData,
}) => {
	const { getStorageItem } = useFunctions();

	useEffect(() => {
		if (
			!errors.fullname &&
			!errors.phone &&
			!errors.id &&
			!errors.username &&
			!errors.faculty &&
			!errors.group1 &&
			!errors.group2 &&
			!errors.group3 &&
			!errors.group4 &&
			!errors.no_of_groups
		) {
			if (errors.email && errors.password && errors.confirmPassword)
				setPageNo(3);
		}
	}, [errors]);

	const [showTextBox, setShowTextBox] = useState(false);
	const [showVerificationErr, setShowVerificationErr] = useState(false);
	const [code, setCode] = useState("");
	const [codeInput, setCodeInput] = useState("");

	let arrNum: number[] = [];
	const sendCode = async () => {
		// compareCode(codeInput);

		const salt = await genSalt(10);
		const hashed = await hash(code, salt);

		localStorage.setItem("s", JSON.stringify(hashed));
		// localStorage.setItem("s", JSON.stringify(code));
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

	const generateCode = () => {
		arrNum = [];

		for (let i = 1; i <= 6; i++) {
			const randomNum = Math.floor(Math.random() * 9);
			arrNum.push(randomNum);
		}

		setCode(arrNum.join(""));
	};

	const compareCode = async (codeInput: string) => {
		const hashedPassword = getStorageItem("s", null);
		try {
			const matches = await compare(codeInput, hashedPassword);

			if (matches) {
				setShowVerificationErr(false);
			} else {
				setShowVerificationErr(true);
			}
		} catch (error) {
			console.log("🚀 ~ compareCode ~ error:", error);
		}
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
	const [otp, setOtp] = useState("");

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	const handleInput = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		const isValidInput = /^[0-9a-zA-Z]$/.test(value);
		e.target.value = isValidInput ? value[0] : "";

		if (isValidInput && index < inputsRef.current.length - 1) {
			inputsRef.current[index + 1]?.focus();
		}

		if (inputsRef.current.every((input) => input?.value)) {
			submit();
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedData = e.clipboardData.getData("text").split("");
		if (pastedData.length === inputsRef.current.length) {
			inputsRef.current.forEach((input, i) => {
				if (input) {
					input.value = pastedData[i] ?? "";
				}
			});
			submit();
		}
	};

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
							<div className="otp-field" onPaste={handlePaste}>
								{Array.from({ length: 6 }).map((_, index) => (
									<input
										key={index}
										ref={(el) =>
											(inputsRef.current[index] = el)
										}
										style={{
											border: `1px solid ${
												showVerificationErr
													? "red"
													: "#9e9aa5"
											}`,
										}}
										type="text"
										maxLength={1}
										inputMode="numeric"
										onChange={(e) => handleInput(index, e)}
										onKeyDown={(e) =>
											handleKeyDown(index, e)
										}
									/>
								))}
							</div>
							{/* <OtpInput
								value={otp}
								// containerStyle={{ textAlign: "center" }}
								inputStyle={{
									textAlign: "center",
									height: "3rem",
									border: "1px solid rgb(84,68,230)",
									borderRadius: "3px",
								}}
								shouldAutoFocus={true}
								onChange={setOtp}
								numInputs={6}
								skipDefaultStyles={true}
								renderSeparator={
									<span style={{ margin: "0 5px" }}>-</span>
								}
								renderInput={(props) => <input {...props} />}
							/> */}
							{showVerificationErr && (
								<p className="error">
									Invalid code. Check your email and try
									again.
								</p>
							)}
						</>
					)}
					{!showTextBox && (
						<button
							className="actions submit"
							onClick={() => {
								generateCode();
								setShowTextBox(true);
							}}
						>
							Send Verification Code
						</button>
					)}
				</div>
				<button onClick={() => submit()}>Verify</button>
				<div className="block">
					<Link
						to="/signup"
						onClick={() => {
							setPageNo(4);
							generateCode();
						}}
					>
						Resend Code
					</Link>
				</div>
				<button className="actions cancel" onClick={() => setPageNo(1)}>
					Back
				</button>
				<button className="actions submit">Next</button>
			</section>
		</>

		// </div>
	);
};

export default LecVerification;
