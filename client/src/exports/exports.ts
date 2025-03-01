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
	userData: Omit<Lecturer, "confirmPassword"> | null;
	setUserData: Dispatch<
		SetStateAction<Omit<Lecturer, "confirmPassword"> | null>
	>;
	page: Page;
	setPage: Dispatch<SetStateAction<Page>>;
	changePage: (val: Page) => void;
}

const ContextProvider = createContext<ContextType | undefined>(undefined);

type Page = "Home" | "List" | "Attendance" | "Report";
type Mode = "edit" | "add" | "list" | "del" | "";

type Student = {
	index_number: string;
	fullname: string;
	groupid: GroupID;
	email: string;
	present_status?: boolean | null;
};

type Lecturer = {
	confirmPassword: string;
	password: string;
	group1?: GroupID;
	group2?: GroupID;
	group3?: GroupID;
	group4?: GroupID;
	no_of_groups: number;
	faculty: string;
	phone: string;
	email: string;
	fullname: string;
	id: string;
	username: string;
};

type GroupID = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "";

type Status = boolean;

export { ContextProvider, GroupID, Lecturer, Mode, Page, Status, Student };
