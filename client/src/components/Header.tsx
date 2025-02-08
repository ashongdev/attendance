import { Link } from "react-router-dom";
import useFunctions from "../hooks/useFunctions";
import menuIcon from "../images/reorder-three-outline.svg";
import personIcon from "../images/user-regular.svg";

const Header = () => {
	const { getStorageItem } = useFunctions();

	const role = getStorageItem("role", null);

	return (
		<header>
			<img src={menuIcon} className="icon" alt="" />

			<div>
				<img src={personIcon} className="person-icon" alt="" />
				<span>Admin</span>
			</div>
		</header>
	);
};

export default Header;
