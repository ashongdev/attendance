import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import useContextProvider from "./hooks/useContextProvider";
import { ProtectedRoute, PublicRoute } from "./hooks/useRouteFunctions";
import List from "./pages/List";
import Sidebar from "./components/Sidebar";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import { useState } from "react";
import useFunctions from "./hooks/useFunctions.ts";
import { Page } from "./exports/exports.ts";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
const App = () => {
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

			<main>
				<Header />

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
								<List changePage={changePage} />
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
