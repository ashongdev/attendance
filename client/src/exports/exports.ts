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
	page: string;
	setPage: Dispatch<SetStateAction<string>>;
	minutes: number;
	seconds: number;
	setTimeLeft: Dispatch<SetStateAction<number>>;
	authenticateLecturer: (id: string) => void;
	cookies: { auth?: Omit<Lecturer, "confirmPassword"> | null };
	setCookie: (name: "auth", value: any, options?: any | undefined) => void;
	removeCookie: Dispatch<SetStateAction<any>>;
}
type ReportData = {
	days_absent: string;
	days_present: string;
	fullname: string;
	groupid: GroupID;
	student_id: string;
	total_days: string;
};

const ContextProvider = createContext<ContextType | undefined>(undefined);

type Mode = "edit" | "add" | "list" | "del" | "";

type Student = {
	index_number: string;
	fullname: string;
	groupid: GroupID;
	email: string;
	present_status: boolean | null;
	attendance_date: Date;
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
	gender: "M" | "F";
	lecturer_id: string;
};

type GroupID = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "";

type Status = boolean;

export {
	ContextProvider,
	GroupID,
	Lecturer,
	Mode,
	ReportData,
	Status,
	Student,
};
