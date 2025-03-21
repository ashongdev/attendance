import Axios from "axios";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ContextProvider, Lecturer, Mode, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentsList, setStudentsList] = useState<Student[]>([]);

	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);
	const [timeLeft, setTimeLeft] = useState(0 * 60); // 5 minutes in seconds
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

	const [mode, setMode] = useState<Mode>("");
	const [userData, setUserData] = useState<Omit<
		Lecturer,
		"confirmPassword"
	> | null>(cookies.auth);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showAlertPopup, setShowAlertPopup] = useState(false);
	const [error, setError] = useState({
		header: "",
		description: "",
	});
	const [openModal, setOpenModal] = useState(false);
	const [page, setPage] = useState<string>("");

	const alertTimeout = useRef<NodeJS.Timeout | null>(null);
	const errorTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (showAlertPopup) {
			setOpenModal(false);

			if (alertTimeout.current) clearTimeout(alertTimeout.current);

			alertTimeout.current = setTimeout(() => {
				setShowAlertPopup(false);
			}, 2000);
		}

		if (showErrorMessage) {
			if (errorTimeout.current) clearTimeout(errorTimeout.current);

			errorTimeout.current = setTimeout(() => {
				setShowErrorMessage(false);
			}, 2000);
		}

		return () => {
			if (alertTimeout.current) clearTimeout(alertTimeout.current);
			if (errorTimeout.current) clearTimeout(errorTimeout.current);
		};
	}, [showAlertPopup, showErrorMessage]);

	const authenticateLecturer = async (id: string) => {
		if (!id) {
			setShowErrorMessage(true);
			setError({
				header: "Invalid ID",
				description: "Please provide an ID to continue",
			});

			return;
		}

		try {
			const res = await Axios.get(
				// `http://localhost:4002/lec/auth/${id}`
				`https://record-attendance.onrender.com/lec/auth/${id}`
			);

			setCookie("auth", res.data, {
				httpOnly: true,
				secure: true,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			});
			setUserData(res.data);

			return;
		} catch (error) {
			removeCookie("auth");
			localStorage.removeItem("filterGroupID");

			window.location.href = "/signin";

			return;
		}
	};

	return (
		<ContextProvider.Provider
			value={{
				role,
				studentsList,
				setStudentsList,
				mode,
				setMode,
				showErrorMessage,
				setShowErrorMessage,
				showAlertPopup,
				setShowAlertPopup,
				error,
				setError,
				openModal,
				setOpenModal,
				userData,
				setUserData,
				page,
				setPage,
				setTimeLeft,
				minutes,
				seconds,
				authenticateLecturer,
				cookies,
				setCookie,
				removeCookie,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
