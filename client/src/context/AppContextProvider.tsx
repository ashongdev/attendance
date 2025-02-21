import Axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import { ContextProvider, Mode, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentsList, setStudentsList] = useState<Student[]>([]);

	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);
	const [mode, setMode] = useState<Mode>("");
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showAlertPopup, setShowAlertPopup] = useState(false);
	const [error, setError] = useState({
		header: "",
		description: "",
	});
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (showAlertPopup) {
			setOpenModal(false);
			setTimeout(() => {
				setShowAlertPopup(false);
			}, 2000);
		}

		if (showErrorMessage) {
			setTimeout(() => {
				setShowErrorMessage(false);
			}, 2000);
		}
	}, [showAlertPopup, showErrorMessage]);

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
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
