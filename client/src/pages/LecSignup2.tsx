import { Dispatch, FC, SetStateAction, useEffect } from "react";
import LecSignup3 from "./LecSignup3";

interface Props {
	pageNo: number;
	register: any;
	watch: any;
	errors: any;
	setPageNo: Dispatch<SetStateAction<number>>;
	selectedNoOfGroups: any;
}

const LecSignup2: FC<Props> = ({
	pageNo,
	register,
	watch,
	errors,
	setPageNo,
	selectedNoOfGroups,
}) => {
	const MyGroupsSelection = ({
		selectedNoOfGroups,
		register,
	}: {
		selectedNoOfGroups: number;
		register: any;
	}) => {
		let options = [];
		for (let i = 1; i <= selectedNoOfGroups; i++) {
			options.push(
				<select key={i} id={`group${i}`} {...register(`group${i}`)}>
					<option value="" style={{ color: "gray" }}>
						--Group {i}--
					</option>
					{["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) => (
						<option key={letter} value={letter}>
							{letter}
						</option>
					))}
				</select>
			);
		}

		return <>{options}</>;
	};

	useEffect(() => {
		if (
			!errors.fullname &&
			!errors.phone &&
			!errors.id &&
			!errors.email &&
			!errors.faculty &&
			!errors.group1 &&
			!errors.group2 &&
			!errors.group3 &&
			!errors.group4 &&
			!errors.no_of_groups
		)
			setPageNo(3);

		console.log(errors);
	}, [errors]);

	return (
		<>
			<section
				className={`page2 ${pageNo === 2 ? "slide-in" : "slide-out"}`}
			>
				<div className="block">
					<label htmlFor="name">How many groups do you teach?</label>
					<select id="group" {...register("no_of_groups")}>
						<option value="1">1</option>
						<option value="2">2 </option>
						<option value="3">3</option>
						<option value="4">4</option>
					</select>
				</div>

				<div className="block">
					<label htmlFor="groups">Select groups</label>
					<div
						className="grid"
						style={{
							display: "grid",
							gridTemplateColumns: `repeat(${selectedNoOfGroups}, 1fr)`,
							gap: "1rem",
						}}
					>
						<MyGroupsSelection
							selectedNoOfGroups={selectedNoOfGroups}
							register={register}
						/>
					</div>
				</div>

				<div className="block">
					<label htmlFor="name">
						Which faculty do you belong to?
					</label>

					<select id="faculty" {...register("faculty")}>
						<option value="">--Select Faculty--</option>
						<option value="FoCIS">
							Faculty of Computing and Information Systems
						</option>
						<option value="FoE">Faculty of Engineering</option>
						<option value="FoIB">Faculty of IT Business</option>
					</select>
				</div>

				<button className="actions cancel" onClick={() => setPageNo(1)}>
					Back
				</button>
				<button className="actions submit">Next</button>
			</section>

			{pageNo === 3 && (
				<LecSignup3
					register={register}
					watch={watch}
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

export default LecSignup2;
