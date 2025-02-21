import { createContext, Dispatch, SetStateAction } from "react";
interface ContextType {
	role: "Admin" | "Lecturer" | "Student";
	studentsList: Student[];
	setStudentsList: Dispatch<SetStateAction<Student[]>>;
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
}

const ContextProvider = createContext<ContextType | undefined>(undefined);

type Page = "Home" | "List" | "Attendance" | "Report";
type Mode = "edit" | "add" | "list" | "del" | "";

type Student = {
	index_number: string;
	fullname: string;
	groupid: string;
	email: string;
	status?: boolean | null;
};

type GroupID = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "";

type Status = "Present" | "Absent";

export { ContextProvider, Page, Student, GroupID, Status, Mode };
