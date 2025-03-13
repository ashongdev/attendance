import { yupResolver } from "@hookform/resolvers/yup";
import Axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorAlert from "../components/ErrorAlert";
import useContextProvider from "../hooks/useContextProvider";

const SignIn = () => {
	const { setError, showErrorMessage, setShowErrorMessage, setCookie } =
		useContextProvider();
	const Schema = yup.object().shape({
		lecturer_id: yup
			.string()
			.required("ID is required")
			.matches(/^[0-9]{10}$/, "ID must be exactly 10 digits"),
		password: yup
			.string()
			.matches(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
				"Please enter a strong password"
			)
			.required("Password is required"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(Schema) });

	const submitHandler = async (data: {
		lecturer_id: string;
		password: string;
	}) => {
		try {
			const res = await Axios.post(
				"http://localhost:4002/lec/signin",
				data
			);

			if (res.data) {
				setCookie("auth", res.data);

				window.location.href = "/dashboard";
				setShowErrorMessage(false);
			}
		} catch (error: any) {
			setShowErrorMessage(true);
			if (error.response.data.error.includes("does not match")) {
				console.log("sksks");

				setError({
					header: "Invalid Input",
					description: error.response.data.error,
				});
			} else if (error.response.data.error.includes("User not found")) {
				setError({
					header: "404: User Error",
					description: error.response.data.error,
				});
			} else {
				setError({
					header: "Unexpected Error",
					description:
						"An unexpected error occurred. Please try again.",
				});
			}
		}
	};

	return (
		<>
			<div className="form-container">
				<form onSubmit={handleSubmit(submitHandler)}>
					<section>
						<h1>Sign In To Your Account</h1>
						<span>
							Enter the verification code sent to your email in
							the box below to complete your verification
						</span>
						<br />
						<br />

						<div className="block">
							<label htmlFor="id">
								Enter Identification Number <span>(ID)</span>
							</label>
							<input
								type="text"
								maxLength={10}
								placeholder="e.g., 0028012312"
								{...register("lecturer_id")}
							/>
						</div>

						<div className="block">
							<label htmlFor="password">
								Enter Your Password
							</label>
							<input type="password" {...register("password")} />
						</div>

						<button className="actions submit">Sign in</button>
					</section>
				</form>
			</div>
			{showErrorMessage && <ErrorAlert />}
		</>
	);
};

export default SignIn;
