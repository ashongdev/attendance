import { useEffect, useState } from "react";
import personIcon from "../images/user-regular.svg";
import presentIcon from "../images/checkmark-circle-outline.svg";
import absentIcon from "../images/close-circle-outline.svg";
import lateIcon from "../images/alarm-outline.svg";
import useFunctions from "../hooks/useFunctions";
import useContextProvider from "../hooks/useContextProvider";

const Dashboard = () => {
	const { studentsList, mode, setMode } = useContextProvider();
	const { getStorageItem } = useFunctions();
	const [totalPresent, setTotalPresent] = useState(0);
	const [totalAbsent, setTotalAbsent] = useState(0);
	const [totalNotMarked, setTotalNotMarked] = useState(0);
	const [askGroup, setAskGroup] = useState(
		getStorageItem("askCounter", false)
	);

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
		!askGroup && setAskGroup(true);
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
