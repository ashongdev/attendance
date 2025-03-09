import { ReactNode, useEffect, useState } from "react";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
	useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader.tsx";
import Sidebar from "./components/Sidebar";
import useContextProvider from "./hooks/useContextProvider.ts";
import Attendance from "./pages/Attendance.tsx";
import Dashboard from "./pages/Dashboard";
import LecSignup from "./pages/LecSignup.tsx";
import List from "./pages/List";
import PageNotFound from "./pages/PageNotFound.tsx";
import Report from "./pages/Report.tsx";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if details from localstorage matches the new one

// !rnfz
const RenderSideBar = ({ children }: { children: ReactNode }) => {
	const [showSideBar, setShowSideBar] = useState(false);

	return (
		<main style={{ marginLeft: showSideBar ? "15rem" : "0rem" }}>
			<Header setShowSideBar={setShowSideBar} />
			{showSideBar && <Sidebar setShowSideBar={setShowSideBar} />}
			{children}
		</main>
	);
};

const Loading = ({ children }: { children: ReactNode }) => {
	const location = useLocation();
	const [isRendered, setIsRendered] = useState(false);

	useEffect(() => {
		setIsRendered(false);

		const timer = setTimeout(() => {
			setIsRendered(true);
		}, 2000);

		return () => clearTimeout(timer);
	}, [location.pathname]);

	return isRendered ? <>{children}</> : <Loader />;
};

const App = () => {
	const { userData } = useContextProvider();

	const router = createBrowserRouter(
		[
			{
				path: "/",
				element: (
					<RenderSideBar>
						{!userData ? (
							<Navigate to="/signup" />
						) : (
							<Loading>
								<Dashboard />
							</Loading>
						)}
					</RenderSideBar>
				),
			},
			{
				path: "/list",
				element: (
					<RenderSideBar>
						{!userData ? (
							<Navigate to="/signup" />
						) : (
							<Loading>
								<List />
							</Loading>
						)}
					</RenderSideBar>
				),
			},
			{
				path: "/attendance",
				element: (
					<RenderSideBar>
						{!userData ? (
							<Navigate to="/signup" />
						) : (
							<Loading>
								<Attendance />
							</Loading>
						)}
					</RenderSideBar>
				),
			},
			{
				path: "/report",
				element: (
					<RenderSideBar>
						{!userData ? (
							<Navigate to="/signup" />
						) : (
							<Loading>
								<Report />
							</Loading>
						)}
					</RenderSideBar>
				),
			},
			{
				path: "signup",
				element: !userData ? (
					<>
						<RenderSideBar>
							{userData ? (
								<Navigate to="/" />
							) : (
								<Loading>
									<LecSignup />
								</Loading>
							)}
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
