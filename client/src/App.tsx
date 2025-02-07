import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import useContextProvider from "./hooks/useContextProvider";
import { ProtectedRoute, PublicRoute } from "./hooks/useRouteFunctions";

// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
const App = () => {
	const { role } = useContextProvider();

	return (
		<>
			<Nav />

			<Routes>
				<Route
					path="/"
					element={
						<PublicRoute role={role}>
							<></>
						</PublicRoute>
					}
				/>

				<Route path="/std" element={<Navigate to="/std/home" />} />

				{/* Student Routes */}
				<Route
					path="/std/home"
					element={
						<ProtectedRoute role={role}>
							{role === "Student" ? (
								<></>
							) : (
								<Navigate to="/lec/home" replace />
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/std/check-in"
					element={
						<ProtectedRoute role={role}>
							{role === "Student" ? (
								<></>
							) : (
								<Navigate to="/lec/home" replace />
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/autofill/std/details"
					element={
						<ProtectedRoute role={role}>
							{role === "Student" ? <></> : <Navigate to="/" />}
						</ProtectedRoute>
					}
				/>

				{/* Lecturer Routes */}
				<Route
					path="/lec"
					element={<Navigate to="/lec/home" replace />}
				/>
				<Route
					path="/lec/home"
					element={
						<ProtectedRoute role={role}>
							{role === "Lecturer" ? (
								<></>
							) : (
								<Navigate to="/std/home" replace />
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/lec/register"
					element={
						<ProtectedRoute role={role}>
							{role === "Lecturer" ? (
								<></>
							) : (
								<Navigate to="/std/home" replace />
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/autofill/lec/details"
					element={
						<ProtectedRoute role={role}>
							{role === "Lecturer" ? <></> : <Navigate to="/" />}
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<></>} />
			</Routes>
			<Footer />
		</>
	);
};

export default App;
