import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import LecVerification from "./LecVerification";

interface Props {
	pageNo: number;
	register: any;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
}

const LecSignup3: FC<Props> = ({
	pageNo,
	register,
	errors,
	setPageNo,
	selectedNoOfGroups,
}) => {
	const [showNextPage, setShowNextPage] = useState(false);

	useEffect(() => {
		if (pageNo === 4) {
			setTimeout(() => {
				setShowNextPage(true);
			}, 120);
		}
	}, [pageNo]);

	return (
		<>
			<section
				className={`page2 ${pageNo === 3 ? "slide-in" : "slide-out"}`}
			>
				<div className="block">
					<label htmlFor="name">Email Address</label>
					<input
						type="email"
						placeholder="e.g., test@example.us"
						{...register("email")}
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

			{showNextPage && (
				<LecVerification
					setPageNo={setPageNo}
					errors={errors}
					pageNo={pageNo}
					selectedNoOfGroups={selectedNoOfGroups}
				/>
			)}
		</>

		// </div>
	);
};

export default LecSignup3;
