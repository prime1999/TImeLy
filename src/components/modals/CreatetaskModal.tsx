import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import CreateTaskForm from "../forms/CreateTaskForm";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatetaskModal = ({ open, setOpen }: Props) => {
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[550px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Create a Task</DialogTitle>
						<hr />
						<DialogDescription>
							<CreateTaskForm />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="w-full">
						<DialogClose className="w-full">
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

export default CreatetaskModal;
