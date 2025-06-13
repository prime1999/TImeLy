import { ReactNode } from "react";
import Loader from "./Loader";

type Props = {
	className: string;
	children: ReactNode;
	isLoading: boolean;
	handleFunction: any;
};

const Button = ({ isLoading, children, className, handleFunction }: Props) => {
	return (
		<button
			onClick={() => handleFunction()}
			disabled={isLoading}
			className={`${className} ${
				isLoading
					? "cursor-default py-1"
					: "cursor-pointer py-2 duration-700 hover:bg-green-500"
			}`}
		>
			{isLoading ? (
				<span className="flex gap-2 justify-center items-center">
					<Loader /> <p>Loading...</p>
				</span>
			) : (
				<span>{children}</span>
			)}
		</button>
	);
};

export default Button;
