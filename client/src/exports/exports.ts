import { createContext, Dispatch, SetStateAction } from "react";
interface ContextType {
	role: "Admin" | "Lecturer" | "Student";
}

const ContextProvider = createContext<ContextType | undefined>(undefined);

type Page = "Home" | "List" | "Attendance" | "Report";

export { ContextProvider, Page };
