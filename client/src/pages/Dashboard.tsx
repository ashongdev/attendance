import React from "react";
import personIcon from "../images/user-regular.svg";
import presentIcon from "../images/checkmark-circle-outline.svg";
import absentIcon from "../images/close-circle-outline.svg";
import lateIcon from "../images/alarm-outline.svg";

const Dashboard = () => {
	return (
		<section>
			<p>Dashboard</p>
			<span>Welcome to the Attendance Management System</span>

			<div className="cards">
				<div className="card">
					Total Students
					<div>
						<img src={personIcon} className="icon" alt="" />

						<span>100</span>
					</div>
				</div>
				<div className="card">
					Present Today
					<div>
						<img src={presentIcon} className="icon" alt="" />

						<span>39</span>
					</div>
				</div>
				<div className="card">
					Absent Today
					<div>
						<img src={absentIcon} className="icon" alt="" />

						<span>61</span>
					</div>
				</div>
				<div className="card">
					Late Today
					<div>
						<img src={lateIcon} className="icon" alt="" />

						<span>15</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
