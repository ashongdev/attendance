import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
import Axios from "axios";
import { Student } from "../exports/exports";

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

	const editStudentInfo = async (
		index_number: string,
		data: Omit<Student, "status">,
		getter: Student[],
		setter: Dispatch<SetStateAction<Student[]>>
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
			setter(res.data);
		} catch (error) {
			// console.log("🚀 ~ useFunctions ~ error:", error);
			alert("An unexpected error occured");
			return;
		}
	};

	const currentDate = new Date().toLocaleString();

	const getStudentsList = async (
		setter: Dispatch<SetStateAction<Student[]>>
	) => {
		try {
			const res = await Axios.get("http://localhost:4002/lec/students");

			if (!res.data) {
				return alert("An Unexpected error occurred. Please try again.");
			}

			setter(res.data);
		} catch (error) {
			// console.log("🚀 ~ getStudentsList ~ error:", error);
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

	const storedStudentList = getStorageItem("studentList", null);

	return { getStorageItem, getStudentsList, editStudentInfo };
};

export default useFunctions;
