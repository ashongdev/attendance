import Axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import { ContextProvider, Mode, Student } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentsList, setStudentsList] = useState<Student[]>([
		{
			index_number: "",
			fullname: "",
			groupid: "",
			email: "",
			status: null,
		},
	]);

	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);
	const [mode, setMode] = useState<Mode>("");

	return (
		<ContextProvider.Provider
			value={{
				role,
				studentsList,
				setStudentsList,
				mode,
				setMode,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
