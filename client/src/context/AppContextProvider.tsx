import { ReactNode, useEffect, useRef, useState } from "react";
import {
	ContextProvider,
	Lecturer,
	Mode,
	Page,
	Student,
} from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentsList, setStudentsList] = useState<Student[]>([]);

	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);

	const [mode, setMode] = useState<Mode>("");
	const [userData, setUserData] = useState<Omit<
		Lecturer,
		"confirmPassword"
	> | null>(getStorageItem("userData", null));
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showAlertPopup, setShowAlertPopup] = useState(false);
	const [error, setError] = useState({
		header: "",
		description: "",
	});
	const [openModal, setOpenModal] = useState(false);
	const [page, setPage] = useState<Page>(getStorageItem("page", null));

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

	const changePage = (page: Page) => {
		setPage(page);
		localStorage.setItem("page", JSON.stringify(page));
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
				changePage,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
