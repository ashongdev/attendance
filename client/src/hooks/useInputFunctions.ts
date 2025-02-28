import { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

const useInputFunctions = () => {
	const handleInput = (
		index: number,
		e: ChangeEvent<HTMLInputElement>,
		inputsRef: any,
		submit: () => void
	) => {
		const value = e.target.value;
		const isValidInput = /^[0-9a-zA-Z]$/.test(value);
		e.target.value = isValidInput ? value[0] : "";

		if (isValidInput && index < inputsRef.current.length - 1) {
			inputsRef.current[index + 1]?.focus();
		}

		if (inputsRef.current.every((input: any) => input?.value)) {
			submit();
		}
	};

	const handleKeyDown = (
		index: number,
		e: KeyboardEvent<HTMLInputElement>,
		inputsRef: any
	) => {
		if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	const handlePaste = (
		e: ClipboardEvent<HTMLInputElement>,
		inputsRef: any,
		submit: () => void
	) => {
		const pastedData = e.clipboardData.getData("text").split("");
		if (pastedData.length === inputsRef.current.length) {
			inputsRef.current.forEach((input: any, i: any) => {
				if (input) {
					input.value = pastedData[i] ?? "";
				}
			});
			submit();
		}
	};
	return { handleInput, handleKeyDown, handlePaste };
};

export default useInputFunctions;
