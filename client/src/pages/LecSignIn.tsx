import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Lecturer } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";

const LecSignIn = () => {
	const { mode } = useContextProvider();
	const Schema = yup.object().shape({
		id: yup
			.string()
			.required()
			.matches(/^[0-9]{10}$/),
		fullname: yup.string().required(),
		faculty: yup.string().required(),
		// department: yup.string().required(),
		no_of_groups: yup.number().required(),
		...Object.fromEntries(
			Array.from({ length: 4 }, (_, i) => [
				`group${i + 1}`,
				yup
					.string()
					.matches(/^[A-H]$/i, "Must be A-H")
					.optional(),
			])
		),
		email: yup
			.string()
			.email()
			.required()
			.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
	});

	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const selectedNoOfGroups = watch("no_of_groups", 1);

	const submitHandler = async (data: Lecturer) => {
		if (!data) {
			alert("No data provided for this provided.");
			return;
		}

		console.log("Data: ", data);
	};

	useEffect(() => {
		console.log(errors);
	}, [errors]);

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

	return (
		<div className="signin-cont">
			<form onSubmit={handleSubmit(submitHandler)} className="">
				<div className="header">
					<h1>Enter Details</h1>
				</div>

				<section>
					<div className="block">
						<label htmlFor="name">Please Enter Your Name</label>
						<input
							type="text"
							placeholder="e.g., Emmanuel Asamoah"
							{...register("fullname")}
						/>
					</div>

					<div className="block">
						<label htmlFor="name">Identification Number</label>
						<input
							type="text"
							maxLength={10}
							placeholder="e.g., 0028012312"
							{...register("id")}
						/>
					</div>

					<div className="block">
						<label htmlFor="name">Email Address</label>
						<input
							type="email"
							placeholder="e.g., test@example.us"
							{...register("email")}
						/>
					</div>

					<div className="block">
						<label htmlFor="name">
							How many groups do you teach?
						</label>
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
							Whcih faculty do you belong to?
						</label>

						<select id="group" {...register("faculty")}>
							<option value="">--Select Faculty--</option>
							<option value="FoCIS">
								Faculty of Computing and Information Systems
							</option>
							<option value="FoE">Faculty of Engineering</option>
							<option value="FoIB">Faculty of IT Business</option>
						</select>
					</div>

					<button className="actions submit">Submit</button>
				</section>
			</form>
		</div>
	);
};

export default LecSignIn;
