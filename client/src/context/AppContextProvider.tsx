import Axios from "axios";
import { ReactNode, useState } from "react";
import io from "socket.io-client";
import { ContextProvider } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
// const socket = io("https://record-attendance.onrender.com");

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentList, setStudentList] = useState(
		getStorageItem("studentList", [])
	);
	const role: "Admin" | "Lecturer" | "Student" = getStorageItem("role", null);

	return (
		<ContextProvider.Provider
			value={{
				role,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
