import React, { ReactNode } from "react";
import Loader from "./Loader";

type Props = {
	className: string;
	children: ReactNode;
	isLoading: boolean;
};

const SubmitButton = ({ isLoading, children, className }: Props) => {
	return (
		<button
			type="submit"
			disabled={isLoading}
			className={`${className} ${
				isLoading
					? "cursor-default py-1"
					: "cursor-pointer py-2 duration-500 hover:bg-green-600"
			}`}
		>
			{isLoading ? (
				<span className="flex gap-2 justify-center">
					<Loader /> <p>Loading...</p>
				</span>
			) : (
				<span>{children}</span>
			)}
		</button>
	);
};

export default SubmitButton;
