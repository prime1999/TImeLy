import { ReactNode } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import Button from "@/lib/utils/Button";
import { useSelector } from "react-redux";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleUpdate: () => any;
	children: ReactNode;
};

const ConfirmationModal = ({
	children,
	open,
	setOpen,
	handleUpdate,
}: Props) => {
	const { isLoading } = useSelector((state: any) => state.timeTable);

	return (
		<>
			<Dialog open={open}>
				<DialogContent className="font-inter text-gray-600 sm:max-w-[425px] dark:text-gray-400">
					<div>{children}</div>
					<DialogFooter>
						<div className="w-full flex items-center gap-4 justify-between">
							<Button
								isLoading={isLoading}
								handleFunction={handleUpdate}
								className="w-1/2 bg-green-400 rounded-md p-2 text-black font-inter text-sm font-semibold"
							>
								Upload
							</Button>
							<button
								onClick={() => setOpen(false)}
								className="w-1/2 bg-red-400 rounded-md p-2 text-sm text-white cursor-pointer duration-700 hover:bg-red-500"
							>
								Cancel
							</button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ConfirmationModal;
