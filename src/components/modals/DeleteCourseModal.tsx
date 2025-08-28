import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";

type Props = {
	open: boolean;
	setOpen: any;
	children: any;
};

const DeleteCourseModal = ({
	children,

	open,
	setOpen,
}: Props) => {
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>{children}</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<button
								onClick={() => setOpen(false)}
								className="font-inter w-full bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
							>
								Cancel
							</button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteCourseModal;
