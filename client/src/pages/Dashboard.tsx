import { useEffect, useState } from "react";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import lateIcon from "../images/alarm-outline.svg";
import presentIcon from "../images/checkmark-circle-outline.svg";
import absentIcon from "../images/close-circle-outline.svg";
import personIcon from "../images/user-regular.svg";

const Dashboard = () => {
	const { studentsList, setStudentsList, setShowErrorMessage, setError } =
		useContextProvider();
	const { getStudentsList } = useFunctions();
	const [totalPresent, setTotalPresent] = useState(0);
	const [totalAbsent, setTotalAbsent] = useState(0);
	const [totalNotMarked, setTotalNotMarked] = useState(0);

	const calculateTotals = () => {
		studentsList.forEach((std) => {
			if (std.status === true) {
				setTotalPresent((prev) => prev + 1);
			} else if (std.status === false) {
				setTotalAbsent((prev) => prev + 1);
			} else {
				setTotalNotMarked((prev) => prev + 1);
			}
		});
		return { totalAbsent, totalPresent };
	};
	useEffect(() => {
		getStudentsList(setStudentsList, setShowErrorMessage, setError);

		calculateTotals();

		return;
	}, []);

	return (
		<section>
			<p>Dashboard</p>
			<span>Welcome to the Attendance Management System</span>

			<div className="cards">
				<div className="card">
					Total Students
					<div>
						<img src={personIcon} className="icon" alt="" />

						<span>{studentsList && studentsList.length}</span>
					</div>
				</div>
				<div className="card">
					Present Today
					<div>
						<img src={presentIcon} className="icon" alt="" />

						<span>{totalPresent}</span>
					</div>
				</div>
				<div className="card">
					Absent Today
					<div>
						<img src={absentIcon} className="icon" alt="" />

						<span>{totalAbsent}</span>
					</div>
				</div>
				<div className="card">
					Not Marked
					<div>
						<img src={lateIcon} className="icon" alt="" />

						<span>{totalNotMarked}</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
