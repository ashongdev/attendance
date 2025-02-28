import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Page } from "./exports/exports.ts";
import useFunctions from "./hooks/useFunctions.ts";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import LecSignup from "./pages/LecSignup.tsx";
import List from "./pages/List";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
const App = () => {
	const { getStorageItem } = useFunctions();

	const [page, setPage] = useState<Page>(getStorageItem("page", null));
	const [showSideBar, setShowSideBar] = useState(false);

	const changePage = (page: Page) => {
		setPage(page);
		localStorage.setItem("page", JSON.stringify(page));
	};

	const userData = getStorageItem("userData", null);

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
							userData ? <Dashboard /> : <Navigate to="/signup" />
						}
					/>
					<Route
						path="/list"
						element={
							userData ? (
								<List changePage={changePage} />
							) : (
								<Navigate to="/signup" />
							)
						}
					/>
					<Route
						path="/attendance"
						element={
							userData ? (
								<Attendance changePage={changePage} />
							) : (
								<Navigate to="/signup" />
							)
						}
					/>
					<Route
						path="/signup"
						element={
							!userData ? <LecSignup /> : <Navigate to="/" />
						}
					/>

					<Route
						path="*"
						element={
							<section>
								<h1>NOT FOUND</h1>
							</section>
						}
					/>
				</Routes>
			</main>
			{/* <Footer /> */}
		</>
	);
};

export default App;
