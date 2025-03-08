import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Page } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import SheetReportIcon from "../images/layers-outline.svg";
import attendanceSheetIcon from "../images/newspaper-outline.svg";
import dashboardIcon from "../images/planet-outline.svg";
import studentsIcon from "../images/school-outline.svg";
import personIcon from "../images/user-regular.svg";

export interface Props {
	page: Page;
	changePage: (val: Page) => void;
	setShowSideBar: Dispatch<SetStateAction<boolean>>;
}
const Sidebar: FC<Props> = ({ page, changePage, setShowSideBar }) => {
	const { userData } = useContextProvider();

	return (
		<aside>
			<h1>ClassTrack</h1>

			{userData ? (
				<div className="container">
					<p>MAIN</p>

					<div className="links">
						<Link
							className={page === "Home" ? "current-link" : ""}
							to="/"
							onClick={() => {
								changePage("Home");
								setShowSideBar(false);
							}}
						>
							<img src={dashboardIcon} alt="" />
							<span>Dashboard</span>
						</Link>

						<Link
							className={page === "List" ? "current-link" : ""}
							to="/list"
							onClick={() => {
								changePage("List");
								setShowSideBar(false);
							}}
						>
							<img src={studentsIcon} alt="" />
							<span>Students</span>
						</Link>
					</div>

					<p>MANAGEMENT</p>

					<div className="links">
						<Link
							className={
								page === "Attendance" ? "current-link" : ""
							}
							to="/attendance"
							onClick={() => {
								changePage("Attendance");
								setShowSideBar(false);
							}}
						>
							<img src={attendanceSheetIcon} alt="" />
							<span>Attendance Sheet</span>
						</Link>
						<Link
							className={page === "Report" ? "current-link" : ""}
							to="/report"
							onClick={() => {
								changePage("Report");
								setShowSideBar(false);
							}}
						>
							<img src={SheetReportIcon} alt="" />
							<span>Sheet Report</span>
						</Link>
					</div>
				</div>
			) : (
				<div className="container">
					<div className="links">
						<Link
							className={page === "Home" ? "current-link" : ""}
							to="/signup"
							onClick={() => {
								changePage("Home");
								setShowSideBar(false);
							}}
						>
							<img src={personIcon} alt="" />
							<span>Signup</span>
						</Link>
					</div>
				</div>
			)}
		</aside>
	);
};

export default Sidebar;
