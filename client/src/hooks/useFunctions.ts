import Axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { GroupID, Mode, Student } from "../exports/exports";

const useFunctions = () => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const clearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const getStorageItem = (
		itemName: string,
		returnItem: null | [] | undefined | boolean
	) => {
		const storedItem = localStorage.getItem(itemName);
		try {
			return storedItem ? JSON.parse(storedItem) : returnItem;
		} catch (error) {
			console.error("Error parsing data from localStorage:", error);
			return null;
		}
	};

	const setterFunc = (
		valueSetter: Dispatch<SetStateAction<Student[]>>,
		modalSetter: Dispatch<SetStateAction<boolean>>,
		alertPopupSetter: Dispatch<SetStateAction<boolean>>,
		modeSetter: Dispatch<SetStateAction<Mode>>,
		res: any
	) => {
		clearTimer();
		valueSetter(res.data);
		modalSetter(false);

		timerRef.current = setTimeout(() => {
			modeSetter("");
		}, 2000);
		alertPopupSetter(true);
	};

	const editStudentInfo = async (
		index_number: string,
		data: Omit<Student, "status">,
		getter: Student[],
		valueSetter: Dispatch<SetStateAction<Student[]>>,
		modalSetter: Dispatch<SetStateAction<boolean>>,
		alertPopupSetter: Dispatch<SetStateAction<boolean>>,
		modeSetter: Dispatch<SetStateAction<Mode>>
	) => {
		try {
			const student = getter.filter(
				(std) => std.index_number === index_number
			);

			if (!student) return alert("No data provided for this operation.");
			const res = await Axios.patch(
				"http://localhost:4002/lec/edit",
				data
			);

			if (!res.data) return alert("An unexpected error occurred");

			setterFunc(
				valueSetter,
				modalSetter,
				alertPopupSetter,
				modeSetter,
				res
			);
		} catch (error) {
			alert("An unexpected error occurred");
			return;
		}
	};

	const getStudentsList = async (
		setter: Dispatch<SetStateAction<Student[]>>,
		errorPopupSetter: Dispatch<SetStateAction<boolean>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>,
		groupid: GroupID | undefined
	) => {
		if (!groupid) return;

		try {
			const res = await Axios.get(
				`http://localhost:4002/lec/students/${groupid}`
			);

			if (!res.data) {
				return alert("An Unexpected error occurred. Please try again.");
			}

			setter(res.data);
		} catch (error: any) {
			errorPopupSetter(true);
			if (error.status === 429) {
				errorSetter({
					header: "Could not retrieve data",
					description: "Too many requests, please try again later.",
				});
			} else {
				errorSetter({
					header: "An unexpected error occurred.",
					description: "Please try again.",
				});
			}
		}
	};

	const addStudent = async (
		data: Student,
		alertPopupSetter: Dispatch<SetStateAction<boolean>>,
		valueSetter: Dispatch<SetStateAction<Student[]>>,
		modalSetter: Dispatch<SetStateAction<boolean>>,
		modeSetter: Dispatch<SetStateAction<Mode>>,
		errorPopupSetter: Dispatch<SetStateAction<boolean>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>
	) => {
		try {
			const res = await Axios.post(
				"http://localhost:4002/lec/add-student",
				data
			);

			if (!res.data) {
				alertPopupSetter(false);
				return alert("An unexpected error occurred.");
			}

			setterFunc(
				valueSetter,
				modalSetter,
				alertPopupSetter,
				modeSetter,
				res
			);
		} catch (error: any) {
			const { msg } = error.response?.data || {};
			errorPopupSetter(true);
			errorSetter({ header: "Duplicate Entry", description: msg });
		}
	};
	// const generateExcelFile = (
	// 	studentList: Entity[],
	// 	lecAutofillDetails: Omit<LecturerType, "checked">
	// ) => {
	// 	try {
	// 		const data = [
	// 			[
	// 				`Attendance for ${lecAutofillDetails?.coursecode} GROUP ${
	// 					lecAutofillDetails?.groupid
	// 				} as at ${new Date().toDateString()} ${currentDate}`,
	// 			],
	// 			[""],
	// 			["No.", "Index Number", "Full Name", "Status"],
	// 		];

	// 		studentList.forEach((student: Entity, index) => {
	// 			data.push([
	// 				(index + 1).toString(),
	// 				student.index_number,
	// 				student.fullname,
	// 				student.checked === true ? "Present" : "Absent",
	// 			]);
	// 		});

	// 		data.push([""]);
	// 		data.push([`Total Number of Students: ${studentList.length.toString()}`]);

	// 		// Create a worksheet
	// 		const worksheet = XLSX.utils.aoa_to_sheet(data);

	// 		// Create a workbook and append the worksheet
	// 		const workbook = XLSX.utils.book_new();
	// 		XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

	// 		// Export the workbook as a file
	// 		XLSX.writeFile(workbook, "Attendance.xlsx");
	// 	} catch (error) {
	// 		console.log("Error generating excel file");
	// 	}
	// };

	const removeStudent = async (
		index_number: string,
		groupid: GroupID,
		errorPopupSetter: Dispatch<SetStateAction<boolean>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>,
		valueSetter: Dispatch<SetStateAction<Student[]>>,
		modalSetter: Dispatch<SetStateAction<boolean>>,
		modeSetter: Dispatch<SetStateAction<Mode>>,
		alertPopupSetter: Dispatch<SetStateAction<boolean>>
	) => {
		try {
			const res = await Axios.delete(
				`http://localhost:4002/lec/rem-student/${index_number}`,
				{ params: { groupid } }
			);

			if (!res.data) {
				return alert("⚠️ An unexpected error occurred!");
			}

			setterFunc(
				valueSetter,
				modalSetter,
				alertPopupSetter,
				modeSetter,
				res
			);
		} catch (error: any) {
			console.log("🚀 ~ useFunctions ~ error:", error);
			const { msg } = error.response?.data || {};
			errorPopupSetter(true);
			errorSetter({ header: "Duplicate Entry", description: msg });
		}
	};

	useEffect(() => {
		return () => clearTimer();
	}, []);

	return {
		getStorageItem,
		getStudentsList,
		editStudentInfo,
		addStudent,
		removeStudent,
		setterFunc,
		clearTimer,
	};
};

export default useFunctions;
