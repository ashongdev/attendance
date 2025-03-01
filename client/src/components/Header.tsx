import { Dispatch, FC, SetStateAction } from "react";
import useFunctions from "../hooks/useFunctions";
import menuIcon from "../images/reorder-three-outline.svg";
import personIcon from "../images/user-regular.svg";

interface Props {
	setShowSideBar: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<Props> = ({ setShowSideBar }) => {
	const { getStorageItem } = useFunctions();

	const role = getStorageItem("role", null);

	return (
		<header>
			<div onClick={() => setShowSideBar((prev) => !prev)}>
				<img src={menuIcon} className="icon" alt="" />
			</div>

			<div>
				<img src={personIcon} className="person-icon" alt="" />
				<span>Admin</span>
			</div>
		</header>
	);
};

export default Header;
