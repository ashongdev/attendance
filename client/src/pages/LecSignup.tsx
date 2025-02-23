import { yupResolver } from "@hookform/resolvers/yup";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Lecturer } from "../exports/exports";
import LecSignup2 from "./LecSignup2";

const LecSignup = () => {
	const [noOfGroups, setNoOfGroups] = useState(1);

	const Schema = yup.object().shape({
		id: yup
			.string()
			.required("ID is required")
			.matches(/^[0-9]{10}$/, "ID must be exactly 10 digits"),
		fullname: yup.string().required("Full name is required"),
		username: yup.string().required("User name is required"),
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
			alert("No data provided for this provided.");
			return;
		}
		console.log(data);

		try {
			// const signup = async () => {
			const res = Axios.post("http://localhost:4002/lec/signup", {
				password: data.password,
				group1: data.group1,
				group2: data.group2,
				group3: data.group3,
				group4: data.group4,
				no_of_groups: data.no_of_groups,
				faculty: data.faculty,
				phone: data.phone,
				email: data.email,
				fullname: data.fullname,
				id: data.id,
				username: data.username,
			});
			// };
		} catch (error) {
			console.log("🚀 ~ submitHandler ~ error:", error);
		}
	};

	useEffect(() => {
		if (!errors.fullname && !errors.phone && !errors.id && !errors.email)
			if (errors.faculty && errors.no_of_groups) {
				setPageNo(2);
			}

		console.log(errors);
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

	useEffect(() => {
		console.log(pageNo);
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
							<label htmlFor="name">
								Identification Number <span>(ID)</span>
							</label>
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
							<label htmlFor="name">Phone Number</label>
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
							watch={watch}
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
