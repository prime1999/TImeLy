import Loader from "./Loader";

type Props = {
	className: string;
	children: React.ReactNode;
	isLoading: boolean;
	disableButton?: boolean;
};

const SubmitButton = ({
	isLoading,
	children,
	className,
	disableButton,
}: Props) => {
	return (
		<button
			type="submit"
			disabled={isLoading || disableButton}
			className={`${className} ${
				isLoading || disableButton
					? "cursor-default py-1 bg-green-300"
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
