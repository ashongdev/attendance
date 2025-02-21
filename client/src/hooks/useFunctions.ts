import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
import Axios from "axios";
import { Mode, Student } from "../exports/exports";

const useFunctions = () => {
	const getStorageItem = (
		itemName: string,
		returnItem: null | [] | undefined | boolean
	) => {
		const storedItem = localStorage.getItem(itemName);
		try {
			return storedItem ? JSON.parse(storedItem) : returnItem;
		} catch (error) {
			console.error(
				"Error parsing opt changes from localStorage:",
				error
			);
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
		valueSetter(res.data);

		modalSetter(false);
		setTimeout(() => {
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

			if (!res.data) return alert("An unexpected error occured");
			setterFunc(
				valueSetter,
				modalSetter,
				alertPopupSetter,
				modeSetter,
				res
			);
		} catch (error) {
			console.log("🚀 ~ useFunctions ~ error:", error);
			alert("An unexpected error occured");
			return;
		}
	};

	const currentDate = new Date().toLocaleString();

	const getStudentsList = async (
		setter: Dispatch<SetStateAction<Student[]>>,
		errorPopupSetter: Dispatch<SetStateAction<boolean>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>
	) => {
		try {
			const res = await Axios.get("http://localhost:4002/lec/students");

			if (!res.data) {
				return alert("An Unexpected error occurred. Please try again.");
			}

			setter(res.data);
		} catch (error: any) {
			console.log("CODE: ", error);
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

			console.log("🚀 ~ getStudentsList ~ error:", error);
			return;
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
			const { msg } = error.response.data;
			errorPopupSetter(true);
			errorSetter({ header: "Duplicate Entry", description: msg });
			return;
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
				`http://localhost:4002/lec/rem-student/${index_number}`
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
			const { msg } = error.response.data;
			errorPopupSetter(true);
			errorSetter({ header: "Duplicate Entry", description: msg });
		}
	};
	const storedStudentList = getStorageItem("studentList", null);

	return {
		getStorageItem,
		getStudentsList,
		editStudentInfo,
		addStudent,
		removeStudent,
	};
};

export default useFunctions;
