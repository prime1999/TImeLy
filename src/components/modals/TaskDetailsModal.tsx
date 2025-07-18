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

type Props = {
	task: any;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskDetailsModal = ({ open, setOpen, task }: Props) => {
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[550px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Create a Task</DialogTitle>
						<hr />
						<DialogDescription>
							<UpdateTaskForm setOpen={setOpen} task={task} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="w-full">
						<DialogClose className="w-full">
							<button className="w-full h-10 mb-2 py-2 text-red-500 rounded-md border-2 border-red-400 font-semibold cursor-pointer duration-700 hover:bg-red-500 hover:text-white hover:border-none">
								Delete Task
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
		</>
	);
};

export default TaskDetailsModal;
