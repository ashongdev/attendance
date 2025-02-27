import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Lecturer } from "../exports/exports";
import LecVerification from "./LecVerification";

interface Props {
	pageNo: number;
	register: any;
	watch: any;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
	userData: Omit<Lecturer, "confirmPassword"> | null;
}

const LecSignup3: FC<Props> = ({
	pageNo,
	register,
	watch,
	errors,
	setPageNo,
	selectedNoOfGroups,
	userData,
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
					register={register}
					watch={watch}
					setPageNo={setPageNo}
					errors={errors}
					pageNo={pageNo}
					selectedNoOfGroups={selectedNoOfGroups}
					userData={userData}
				/>
			)}
		</>

		// </div>
	);
};

export default LecSignup3;
