import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import UpdateTaskForm from "../forms/UpdateTaskForn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { deleteTask, getTasks } from "@/lib/slice/TasksSlice";
import Loader from "@/lib/utils/Loader";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";

type Props = {
	task: any;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskDetailsModal = ({ open, setOpen, task }: Props) => {
	// init dispatch
	const dispatch = useDispatch<AppDispatch>();
	// get the task loading state form the redux store
	const { isLoading } = useSelector((state: any) => state.tasks);
	// function to delete task
	const handleDeleteTask = async () => {
		try {
			// dispatch te delete task function in the slice
			await dispatch(deleteTask(task.$id)).unwrap();
			// dispatch the function to get the tasks
			dispatch(getTasks());
			// show success message
			toast("task deleted");
			// close the modal
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[550px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Task details</DialogTitle>
						<hr />
						<DialogDescription>
							<UpdateTaskForm setOpen={setOpen} task={task} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="w-full">
						<DialogClose className="w-full">
							<button
								onClick={() => handleDeleteTask()}
								className="w-full h-10 mb-2 py-2 text-red-500 rounded-md border-2 border-red-400 font-semibold cursor-pointer duration-700 hover:bg-red-500 hover:text-white hover:border-none"
							>
								{isLoading ? (
									<span className="flex gap-2 justify-center">
										<Loader /> <p>Loading...</p>
									</span>
								) : (
									<span>Delete Task</span>
								)}
							</button>
							<DialogClose asChild>
								<button
									onClick={() => setOpen(false)}
									className="w-full bg-red-400 rounded-md p-2 text-sm text-white cursor-pointer duration-700 hover:bg-red-500"
								>
									Cancel
								</button>
							</DialogClose>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Toaster />
		</>
	);
};

export default TaskDetailsModal;
