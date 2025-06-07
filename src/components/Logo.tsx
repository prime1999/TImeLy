import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<main className="font-sans text-3xl font-bold">
			<Link to="/">
				TIME<span className="text-green-400 -ml-4">LY</span>
			</Link>
		</main>
	);
};

export default Logo;
