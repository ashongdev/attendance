import { ReactNode, useState } from "react";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import useContextProvider from "./hooks/useContextProvider.ts";
import useFunctions from "./hooks/useFunctions.ts";
import Attendance from "./pages/Attendance.tsx";
import Dashboard from "./pages/Dashboard";
import LecSignup from "./pages/LecSignup.tsx";
import List from "./pages/List";
import PageNotFound from "./pages/PageNotFound.tsx";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
const RenderSideBar = ({ children }: { children: ReactNode }) => {
	const [showSideBar, setShowSideBar] = useState(false);
	const { changePage, page } = useContextProvider();

	return (
		<main style={{ marginLeft: showSideBar ? "15rem" : "0rem" }}>
			<Header setShowSideBar={setShowSideBar} />
			{showSideBar && <Sidebar changePage={changePage} page={page} />}
			{children}
		</main>
	);
};
const App = () => {
	const { getStorageItem } = useFunctions();
	const { changePage } = useContextProvider();

	const userData = getStorageItem("userData", null);

	const router = createBrowserRouter(
		[
			{
				path: "/",
				element: userData ? (
					<RenderSideBar>
						<Dashboard />
					</RenderSideBar>
				) : (
					<Navigate to="/signup" />
				),
			},
			{
				path: "/list",
				element: userData ? (
					<>
						<RenderSideBar>
							<List changePage={changePage} />
						</RenderSideBar>
					</>
				) : (
					<Navigate to="/signup" />
				),
			},
			{
				path: "/attendance",
				element: userData ? (
					<>
						<RenderSideBar>
							<Attendance changePage={changePage} />
						</RenderSideBar>
					</>
				) : (
					<Navigate to="/signup" />
				),
			},
			{
				path: "signup",
				element: !userData ? (
					<>
						<RenderSideBar>
							<LecSignup />
						</RenderSideBar>
					</>
				) : (
					<Navigate to="/" />
				),
			},
			{
				path: "*",
				element: (
					<RenderSideBar>
						<PageNotFound />
					</RenderSideBar>
				),
			},
		],
		{
			future: {
				v7_relativeSplatPath: true, // Enables relative paths in nested routes
				v7_fetcherPersist: true, // Retains fetcher state during navigation
				v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
				v7_partialHydration: true, // Supports partial hydration for server-side rendering
				v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
			},
		}
	);

	return (
		<RouterProvider router={router} future={{ v7_startTransition: true }} />
	);
};

export default App;
