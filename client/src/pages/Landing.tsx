import { useEffect } from "react";
import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const Landing = () => {
	const { userData, authenticateLecturer } = useContextProvider();
	useEffect(() => {
		if (!userData) return;

		authenticateLecturer(userData.lecturer_id);
	}, []);

	return (
		<div className="landing-page">
			<h1>Welcome to ClassTrack</h1>
			<span>Lorem ipsum dolor sit</span>

			<section className="roles">
				<Link to="/signin" className="role-button login">
					Log In
				</Link>
				<Link to="/signup" className="role-button signup">
					Sign Up
				</Link>
			</section>
		</div>
	);
};

export default Landing;
