import { createContext, Dispatch, SetStateAction } from "react";
interface ContextType {
	role: "Admin" | "Lecturer" | "Student";
}

export const ContextProvider = createContext<ContextType | undefined>(
	undefined
);
