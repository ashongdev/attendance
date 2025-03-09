import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Lecturer } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import LecSignup2 from "./LecSignup2";

const LecSignup = () => {
	const [noOfGroups, setNoOfGroups] = useState(1);
	const { setUserData } = useContextProvider();

	const Schema = yup.object().shape({
		lecturer_id: yup
			.string()
			.required("ID is required")
			.matches(/^[0-9]{10}$/, "ID must be exactly 10 digits"),
		fullname: yup.string().required("Full name is required"),
		gender: yup
			.string()
			.oneOf(["M", "F"], "Gender must be either Male or Female")
			.required("This field is required."),
		email: yup
			.string()
			.email("Invalid email format")
			.required("Email is required")
			.matches(
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Enter a valid email address"
			),
		phone: yup
			.string()
			.required("Phone number is required")
			.matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
		faculty: yup.string().required("Faculty selection is required"),
		no_of_groups: yup
			.number()
			.required("Number of groups is required")
			.min(1, "At least 1 group is required")
			.max(4, "You can select up to 4 groups"),
		...Object.fromEntries(
			Array.from({ length: noOfGroups }, (_, i) => [
				`group${i + 1}`,
				yup
					.string()
					.matches(
						/^[A-H]$/i,
						"Group must be a letter between A and H"
					)
					.optional(),
			])
		),
		password: yup
			.string()
			.matches(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
				"Please enter a strong password"
			)
			.required("Password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password")], "Passwords does not match")
			.required("Passwords does not match"),
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

	useEffect(() => {
		setNoOfGroups(selectedNoOfGroups);
	}, [selectedNoOfGroups]);

	const submitHandler = async (data: Omit<Lecturer, "confirmPassword">) => {
		if (!data) {
			alert("No data provided for this operation.");
			return;
		}

		setUserData(data);
		setPageNo(4);
	};

	useEffect(() => {
		if (
			!errors.fullname &&
			!errors.phone &&
			!errors.lecturer_id &&
			!errors.gender
		)
			if (errors.faculty && errors.no_of_groups) {
				setPageNo(2);
			}
	}, [errors]);

	const [pageNo, setPageNo] = useState(1);
	const [showNextPage, setShowNextPage] = useState(false);

	useEffect(() => {
		if (pageNo === 2) {
			setTimeout(() => {
				setShowNextPage(true);
			}, 120);
		}
	}, [pageNo]);

	return (
		<div className="signin-cont">
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className="header">
					{pageNo === 1 && <h1>Personal Info</h1>}
					{pageNo === 2 && <h1>Teaching Info</h1>}
					{pageNo === 3 && <h1>Security Info</h1>}
				</div>

				<div className="flex">
					<section
						className={`${pageNo !== 1 ? "slide-out" : "slide-in"}`}
					>
						<div className="block">
							<label htmlFor="name">Please Enter Your Name</label>
							<input
								type="text"
								placeholder="e.g., Emmanuel Asamoah"
								{...register("fullname")}
							/>
						</div>

						<div className="block">
							<label htmlFor="id">
								Identification Number <span>(ID)</span>
							</label>
							<input
								type="text"
								maxLength={10}
								placeholder="e.g., 0028012312"
								{...register("lecturer_id")}
							/>
						</div>
						<div className="block">
							<label htmlFor="gender">Gender</label>
							<select id="gender" {...register("gender")}>
								<option value="">--Select Gender--</option>
								<option value="M">Male</option>
								<option value="F">Female</option>
							</select>
						</div>

						<div className="block">
							<label htmlFor="phone">Phone Number</label>
							<input
								type="phone"
								maxLength={10}
								placeholder="e.g., 0555359339"
								{...register("phone")}
							/>
						</div>

						<button className="actions submit">Next</button>
					</section>

					{/* {pageNo === 2 && ( */}
					{showNextPage && (
						<LecSignup2
							register={register}
							setPageNo={setPageNo}
							errors={errors}
							pageNo={pageNo}
							selectedNoOfGroups={selectedNoOfGroups}
						/>
					)}
					{/* )} */}
				</div>
			</form>
		</div>
	);
};

export default LecSignup;
