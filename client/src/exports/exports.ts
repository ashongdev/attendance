import { createContext, Dispatch, SetStateAction } from "react";
interface ContextType {
	role: "Admin" | "Lecturer" | "Student";
}

const ContextProvider = createContext<ContextType | undefined>(undefined);

type Page = "Home" | "List" | "Attendance" | "Report";

type Student = {
	no: number | string;
	indexNumber: string;
	fullName: string;
	groupID: string;
	email: string;
	status: boolean;
};

type GroupID = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "";

type Status = "Present" | "Absent";

export { ContextProvider, Page, Student, GroupID, Status };
