import { Dispatch, FC, SetStateAction } from "react";

interface Props {
	pageNo: number;
	register: any;
	watch: any;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
}

const LecSignup3: FC<Props> = ({
	pageNo,
	register,
	watch,
	errors,
	setPageNo,
	selectedNoOfGroups,
}) => {
	return (
		// <div className="signin-cont">
		// 	<div className="header">
		// 		<h1>Enter Details</h1>
		// 	</div>

		<section className={`page2 ${pageNo === 3 ? "slide-in" : "slide-out"}`}>
			<div className="block">
				<label htmlFor="username">Please enter a username</label>
				<input
					type="text"
					placeholder="e.g., Emmanuel Asamoah"
					{...register("username")}
				/>
			</div>

			<div className="block">
				<label htmlFor="password">Set a password</label>
				<input
					type="password"
					placeholder="e.g., *************"
					{...register("password")}
				/>
			</div>

			<div className="block">
				<label htmlFor="confirm-password">Re-enter Password</label>

				<input
					type="password"
					placeholder="e.g., *************"
					{...register("confirmPassword")}
				/>
			</div>

			<button className="actions cancel" onClick={() => setPageNo(2)}>
				Back
			</button>
			<button className="actions submit">Next</button>
		</section>
		// </div>
	);
};

export default LecSignup3;
