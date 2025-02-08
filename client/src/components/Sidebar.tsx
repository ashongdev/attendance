import React, { Dispatch, FC, SetStateAction, useState } from "react";
import dashboardIcon from "../images/planet-outline.svg";
import studentsIcon from "../images/school-outline.svg";
import attendanceSheetIcon from "../images/newspaper-outline.svg";
import SheetReportIcon from "../images/layers-outline.svg";
import { Link } from "react-router-dom";
import { Page } from "../exports/exports";

export interface Props {
	page: Page;
	changePage: (val: Page) => void;
}
const Sidebar: FC<Props> = ({ page, changePage }) => {
	return (
		<aside>
			<h1>ClassTrack</h1>

			<div className="container">
				<p>MAIN</p>

				<div className="links">
					<Link
						className={page === "Home" ? "current-link" : ""}
						to="/"
						onClick={() => changePage("Home")}
					>
						<img src={dashboardIcon} alt="" />
						<span>Dashboard</span>
					</Link>

					<Link
						className={page === "List" ? "current-link" : ""}
						to="/list"
						onClick={() => changePage("List")}
					>
						<img src={studentsIcon} alt="" />
						<span>Students</span>
					</Link>
				</div>

				<p>MANAGEMENT</p>

				<div className="links">
					<Link
						className={page === "Attendance" ? "current-link" : ""}
						to="/attendance"
						onClick={() => changePage("Attendance")}
					>
						<img src={attendanceSheetIcon} alt="" />
						<span>Attendance Sheet</span>
					</Link>
					<Link
						className={page === "Report" ? "current-link" : ""}
						to="/report"
						onClick={() => changePage("Report")}
					>
						<img src={SheetReportIcon} alt="" />
						<span>Sheet Report</span>
					</Link>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
