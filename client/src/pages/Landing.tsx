import { Link } from "react-router-dom";

const Landing = () => {
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
