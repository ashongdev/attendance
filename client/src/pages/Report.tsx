import Axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import { GroupID, ReportData } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

const Report = () => {
	const { getStorageItem, searchFunction } = useFunctions();
	const {
		userData,
		authenticateLecturer,
		setPage,
		setShowErrorMessage,
		setError,
	} = useContextProvider();

	const [filterGroupID, setFilterGroupID] = useState<GroupID | null>(
		getStorageItem("filterGroupID", null)
	);

	const [reportData, setReportData] = useState<ReportData[] | null>(null);
	const [filteredReportData, setFilteredReportData] = useState<
		ReportData[] | null
	>(null);
	const [searchByValue, setSearchByValue] = useState<"id" | "name">("name");
	const [searchValue, setSearchValue] = useState("");

	const getReport = async (groupid: GroupID | undefined) => {
		const upperCaseGroupID = groupid?.toUpperCase();
		try {
			const res = await Axios.get(
				// `http://localhost:4002/lec/report/${upperCaseGroupID}`
				`https://record-attendance.onrender.com/lec/report/${upperCaseGroupID}`
			);
			if (res.data) {
				setReportData(res.data);
			}
			return;
		} catch (error) {
			console.log("🚀 ~ getReport ~ error:", error);
			setShowErrorMessage(true);
			setError({
				header: "Unexpected Error",
				description:
					"An unexpected error occurred. Please try again later",
			});
			return;
		}
	};

	useEffect(() => {
		searchFunction(
			reportData,
			setFilteredReportData,
			searchByValue,
			searchValue,
			"student_id"
		);
	}, [searchValue]);

	useEffect(() => {
		setPage(window.location.pathname);

		if (userData && filterGroupID) {
			authenticateLecturer(userData?.lecturer_id);
		}
	}, []);

	useEffect(() => {
		if (userData && filterGroupID) {
			getReport(filterGroupID);
			localStorage.setItem(
				"filterGroupID",
				JSON.stringify(filterGroupID)
			);
		}
	}, [filterGroupID]);

	const renderStudentRow = (student: any, index: number) => {
		const percent = (
			(Number(student.days_present) / Number(student.total_days)) *
			100
		).toFixed(2);

		return (
			<tr key={student.student_id}>
				<td>{index + 1}</td>
				<td>{student.student_id}</td>
				<td>{student.fullname}</td>
				<td className="days">{student.days_present}</td>
				<td className="days">{student.days_absent}</td>
				<td className="days">{student.total_days}</td>
				<td className="days">{percent}%</td>
			</tr>
		);
	};

	return (
		<section className="list-section">
			<p>Report</p>
			<div className="top">
				<div>
					<span>
						<Link to="/dashboard">Home</Link>
						{" > "}
						<Link to="/report">Report</Link>
						{" > "}
						{filterGroupID && (
							<>
								<Link to="/attendance">
									Group {filterGroupID}
								</Link>
								{" >"}
							</>
						)}
					</span>
				</div>
				<button>
					GROUP
					<select
						name="group"
						id="group"
						value={filterGroupID ? filterGroupID : ""}
						onChange={(e) =>
							setFilterGroupID(e.target.value as GroupID)
						}
					>
						{userData && (
							<>
								<option value={userData.group1}>
									{userData.group1}
								</option>
								{userData.group2 && (
									<option value={userData.group2}>
										{userData.group2}
									</option>
								)}
								{userData.group3 && (
									<option value={userData.group3}>
										{userData.group3}
									</option>
								)}
								{userData.group4 && (
									<option value={userData.group4}>
										{userData.group4}
									</option>
								)}
							</>
						)}
					</select>
				</button>
			</div>

			<Search
				setSearchByValue={setSearchByValue}
				searchByValue={searchByValue}
				setSearchValue={setSearchValue}
				searchValue={searchValue}
			/>

			<div className="list-container">
				<table border={1}>
					<thead>
						<tr>
							<th>No.</th>
							<th>Index Number</th>
							<th>Full Name</th>
							<th>Days Present</th>
							<th>Days Absent</th>
							<th>Total Days</th>
							<th>%</th>
						</tr>
					</thead>
					<tbody>
						{filteredReportData && filteredReportData.length > 0 ? (
							filteredReportData.map(renderStudentRow)
						) : reportData && reportData?.length > 0 ? (
							reportData.map(renderStudentRow)
						) : (
							<p className="nothing">Nothing to see here 😭</p>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default Report;
