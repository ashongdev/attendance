import { Dispatch, FC, SetStateAction } from "react";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import menuIcon from "../images/reorder-three-outline.svg";
import personIcon from "../images/user-regular.svg";

interface Props {
	setShowSideBar: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<Props> = ({ setShowSideBar }) => {
	const { getStorageItem } = useFunctions();
	const { userData } = useContextProvider();

	return (
		<header>
			<div onClick={() => setShowSideBar((prev) => !prev)}>
				<img src={menuIcon} className="icon" alt="" />
			</div>

			<div>
				{userData?.fullname && <span>{userData.fullname}</span>}
				<img src={personIcon} className="person-icon" alt="" />
			</div>
		</header>
	);
};

export default Header;
