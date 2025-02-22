import { createContext, Dispatch, SetStateAction } from "react";
interface ContextType {
	role: "Admin" | "Lecturer" | "Student";
	studentsList: Student[];
	setStudentsList: Dispatch<SetStateAction<Student[]>>;
	mode: Mode;
	setMode: Dispatch<SetStateAction<Mode>>;
	showErrorMessage: boolean;
	setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
	showAlertPopup: boolean;
	setShowAlertPopup: Dispatch<SetStateAction<boolean>>;
	error: {
		header: string;
		description: string;
	};
	setError: Dispatch<
		SetStateAction<{
			header: string;
			description: string;
		}>
	>;
	openModal: boolean;
	setOpenModal: Dispatch<SetStateAction<boolean>>;
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

type Lecturer = {
	id: string;
	fullname: string;
	no_of_groups: number;
	email: string;
	faculty: string;
	// department: string;
};

type GroupID = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "";

type Status = "Present" | "Absent";

export { ContextProvider, GroupID, Lecturer, Mode, Page, Status, Student };
