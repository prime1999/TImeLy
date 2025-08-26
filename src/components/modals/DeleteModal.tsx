import { AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { removeCourse } from "@/lib/slice/CourseSlice";

type Props = {
	open: boolean;
	setOpen: any;
	handleRemove: any;
	course: any;
	children: any;
};

const DeleteModal = ({
	children,
	course,
	open,
	setOpen,
	handleRemove,
}: Props) => {
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>{children}</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<div className="w-full font-inter flex items-center justify-between">
								<button
									onClick={() => handleRemove(course.$id)}
									className="bg-green-400 rounded-md p-2 text-xs font-semibold text-gray-700 cursor-pointer duration-700 hover:bg-green-500"
								>
									Continue
								</button>
								<button
									onClick={() => setOpen(false)}
									className="bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
								>
									Cancel
								</button>
							</div>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteModal;
