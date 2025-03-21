import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";
import SheetReportIcon from "../images/layers-outline.svg";
import attendanceSheetIcon from "../images/newspaper-outline.svg";
import dashboardIcon from "../images/planet-outline.svg";
import studentsIcon from "../images/school-outline.svg";
import personIcon from "../images/user-regular.svg";

export interface Props {
	setShowSideBar: Dispatch<SetStateAction<boolean>>;
}
const Sidebar: FC<Props> = ({ setShowSideBar }) => {
	const { cookies, page } = useContextProvider();
	const auth = cookies.auth;

	return (
		<aside>
			<h1>ClassTrack</h1>

			{auth ? (
				<div className="container">
					<p>MAIN</p>

					<div className="links">
						<Link
							className={
								page === "/dashboard" ? "current-link" : ""
							}
							to="/dashboard"
						>
							<img src={dashboardIcon} alt="" />
							<span>Dashboard</span>
						</Link>

						<Link
							className={page === "/list" ? "current-link" : ""}
							to="/list"
						>
							<img src={studentsIcon} alt="" />
							<span>Students</span>
						</Link>
					</div>

					<p>MANAGEMENT</p>

					<div className="links">
						<Link
							className={
								page === "/attendance" ? "current-link" : ""
							}
							to="/attendance"
						>
							<img src={attendanceSheetIcon} alt="" />
							<span>Attendance Sheet</span>
						</Link>
						<Link
							className={page === "/report" ? "current-link" : ""}
							to="/report"
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
							className={page === "/signup" ? "current-link" : ""}
							to="/signup"
						>
							<img src={personIcon} alt="" />
							<span>Signup</span>
						</Link>

						<Link
							className={page === "/signin" ? "current-link" : ""}
							to="/signin"
						>
							<img src={personIcon} alt="" />
							<span>Sign In</span>
						</Link>
					</div>
				</div>
			)}
		</aside>
	);
};

export default Sidebar;
