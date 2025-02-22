import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Page } from "./exports/exports.ts";
import useContextProvider from "./hooks/useContextProvider";
import useFunctions from "./hooks/useFunctions.ts";
import { PublicRoute } from "./hooks/useRouteFunctions";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import LecSignIn from "./pages/LecSignIn";
import List from "./pages/List";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
const App = () => {
	// const students = [
	// 	{
	// 		index_number: "4211231891",
	// 		fullname: "John Doe",
	// 		groupid: "F",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4214238892",
	// 		fullname: "Jane Smith",
	// 		groupid: "G",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211228893",
	// 		fullname: "Michael Johnson",
	// 		groupid: "B",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238194",
	// 		fullname: "Emily Williams",
	// 		groupid: "E",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238890",
	// 		fullname: "David Brown",
	// 		groupid: "E",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238891",
	// 		fullname: "Sarah Davis",
	// 		groupid: "B",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238892",
	// 		fullname: "Daniel Wilson",
	// 		groupid: "A",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238893",
	// 		fullname: "John Doe",
	// 		groupid: "B",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238894",
	// 		fullname: "Jane Smith",
	// 		groupid: "C",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238895",
	// 		fullname: "Michael Johnson",
	// 		groupid: "B",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238896",
	// 		fullname: "Emily Williams",
	// 		groupid: "A",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238897",
	// 		fullname: "David Brown",
	// 		groupid: "C",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238981",
	// 		fullname: "Sarah Davis",
	// 		groupid: "B",
	// 		email: "nobody@gmail.com",
	// 	},
	// 	{
	// 		index_number: "4211238898",
	// 		fullname: "Daniel Wilson",
	// 		groupid: "A",
	// 		email: "nobody@gmail.com",
	// 	},
	// ];
	// useEffect(() => {
	// 	localStorage.setItem("students", JSON.stringify(students));
	// }, []);

	const { role } = useContextProvider();
	const { getStorageItem } = useFunctions();

	const [page, setPage] = useState<Page>(getStorageItem("page", null));
	const [showSideBar, setShowSideBar] = useState(true);

	const changePage = (page: Page) => {
		setPage(page);
		localStorage.setItem("page", JSON.stringify(page));
	};

	return (
		<>
			{showSideBar && <Sidebar changePage={changePage} page={page} />}

			{/* Add the slide in animations */}
			{/* Add Loading animations for operations performed: fetching students, updating, removing etc */}
			<main style={{ marginLeft: showSideBar ? "15rem" : "0rem" }}>
				<Header setShowSideBar={setShowSideBar} />

				<Routes>
					<Route
						path="/"
						element={
							<PublicRoute role={role}>
								<Dashboard />
							</PublicRoute>
						}
					/>
					<Route
						path="/list"
						element={
							<PublicRoute role={role}>
								{/* <Loading> */}
								<List changePage={changePage} />
								{/* </Loading> */}
							</PublicRoute>
						}
					/>
					<Route
						path="/attendance"
						element={
							<PublicRoute role={role}>
								<Attendance changePage={changePage} />
							</PublicRoute>
						}
					/>
					<Route
						path="/signin"
						element={
							<PublicRoute role={role}>
								<LecSignIn />
							</PublicRoute>
						}
					/>

					<Route
						path="*"
						element={
							<PublicRoute role={role}>
								<section>
									<h1>NOT FOUND</h1>
								</section>
							</PublicRoute>
						}
					/>
				</Routes>
			</main>

			{/* <Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute role={role}>
							<></>
						</ProtectedRoute>
					}
				/> */}

			{/* <Footer /> */}
		</>
	);
};

export default App;
