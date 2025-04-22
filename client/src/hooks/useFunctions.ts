import Axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
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
	const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

	// ! FIX LOGIC HERE
	const editStudentInfo = async (
		index_number: string,
		data: Omit<Student, "present_status" | "attendance_date">,
		getter: Student[],
		valueSetter: Dispatch<SetStateAction<Student[]>>,
		modalSetter: Dispatch<SetStateAction<boolean>>,
		alertPopupSetter: Dispatch<SetStateAction<boolean>>,
		modeSetter: Dispatch<SetStateAction<Mode>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>
	) => {
		try {
			const student = getter.filter(
				(std) => std.index_number === index_number
			);

			if (!student) return alert("No data provided for this operation.");
			const res = await Axios.patch(
				// "http://localhost:4002/lec/edit",
				"https://record-attendance.onrender.com/lec/edit",
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
			errorSetter({
				header: "An unexpected error occurred.",
				description: "Please try again.",
			});

			setTimeout(() => {
				removeCookie("auth");
				window.location.href = "/signin";
			}, 2000);
		}
	};

	const getStudentsList = async (
		setter: Dispatch<SetStateAction<Student[]>>,
		errorPopupSetter: Dispatch<SetStateAction<boolean>>,
		errorSetter: Dispatch<
			SetStateAction<{ header: string; description: string }>
		>,
		group1: GroupID | undefined,
		group2: GroupID | undefined,
		group3: GroupID | undefined,
		group4: GroupID | undefined
	) => {
		try {
			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/students/groups`,
				// `http://localhost:4002/lec/students/groups`,
				{ params: { group1, group2, group3, group4 } }
			);

			if (!res.data) {
				return alert("An Unexpected error occurred. Please try again.");
			}

			setter(res.data);
		} catch (error: any) {
			errorPopupSetter(true);
			localStorage.removeItem("filterGroupID");

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

				setTimeout(() => {
					removeCookie("auth");
					window.location.href = "/signin";
				}, 1000);
			}
		}
	};

	const getStudentsAttendanceList = async (
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
				`https://record-attendance.onrender.com/lec/students/attendance/${groupid}`
				// `http://localhost:4002/lec/students/attendance/${groupid}`
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

				setTimeout(() => {
					removeCookie("auth");
					window.location.href = "/signin";
				}, 1000);
			}
		}
	};

	const addStudent = async (
		data: Omit<Student, "present_status" | "attendance_date">,
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
				"https://record-attendance.onrender.com/lec/add-student",
				// "http://localhost:4002/lec/add-student",
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

			if (msg.includes("Index number entered already exists")) {
				errorSetter({ header: "Duplicate Entry", description: msg });
			} else {
				errorSetter({
					header: "An unexpected error occurred.",
					description: "Please try again.",
				});

				setTimeout(() => {
					removeCookie("auth");
					window.location.href = "/signin";
				}, 1000);
			}
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

	// ! FIX LOGIC HERE
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
				`https://record-attendance.onrender.com/lec/rem-student/${index_number}`,
				// `http://localhost:4002/lec/rem-student/${index_number}`,
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
			errorSetter({
				header: "An unexpected error occurred.",
				description: "Please try again.",
			});

			setTimeout(() => {
				removeCookie("auth");
				window.location.href = "/signin";
			}, 2000);
		}
	};

	useEffect(() => {
		return () => clearTimer();
	}, []);

	const searchFunction = (
		getter: any,
		filteredListSetter: Dispatch<SetStateAction<any>>,
		searchByValue: "id" | "name",
		searchValue: string,
		searchKey: "student_id" | "index_number"
	) => {
		if (getter && getter.length > 1) {
			const findStudent = getter.filter((data: any) =>
				searchByValue === "id"
					? data[searchKey].includes(searchValue.toLowerCase())
					: data.fullname
							.trim()
							.toLowerCase()
							.includes(searchValue.toLowerCase())
			);

			if (findStudent.length === 1) {
				filteredListSetter(findStudent);
			} else {
				filteredListSetter(null);
			}
		}
	};

	return {
		getStorageItem,
		getStudentsList,
		editStudentInfo,
		addStudent,
		removeStudent,
		searchFunction,
		clearTimer,
		getStudentsAttendanceList,
	};
};

export default useFunctions;
