import { Dispatch, FC, SetStateAction } from "react";

interface Props {
	setSearchByValue: Dispatch<SetStateAction<"id" | "name">>;
	setSearchValue: Dispatch<SetStateAction<string>>;
	searchByValue: "id" | "name";
	searchValue: string;
}

const Search: FC<Props> = ({
	setSearchByValue,
	setSearchValue,
	searchByValue,
	searchValue,
}) => {
	return (
		<div className="search">
			<select
				className="option"
				onChange={(e) =>
					setSearchByValue(e.target.value as "id" | "name")
				}
			>
				<option value="name">Name</option>
				<option value="id">Index Number</option>
			</select>

			<input
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				type="text"
				maxLength={searchByValue !== "name" ? 10 : 30}
				placeholder={`Search by ${
					searchByValue === "id" ? "Index Number" : "Name"
				}`}
			/>
		</div>
	);
};

export default Search;
