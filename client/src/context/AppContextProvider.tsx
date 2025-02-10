import Axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import { ContextProvider, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentsList, setStudentsList] = useState<Student[]>(
		getStorageItem("students", null)
	);

	useEffect(() => {
		localStorage.setItem("students", JSON.stringify(studentsList));
	}, [studentsList]);
	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);

	return (
		<ContextProvider.Provider
			value={{
				role,
				studentsList,
				setStudentsList,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
