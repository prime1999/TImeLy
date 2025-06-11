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
	course: any;
	open: boolean;
	setOpen: any;
	children: any;
};

const DeleteModal = ({ children, course, open, setOpen }: Props) => {
	// init the dispatch
	const dispatch = useDispatch<AppDispatch>();
	// function to handle the un-registration of a course
	const handleRemove = async (courseId: string) => {
		try {
			// dispatch th redux slice function to remove the course
			await dispatch(removeCourse(courseId));
			// close the modal
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};
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
