import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const CreatetaskModal = () => {
	return (
		<>
			<Dialog open={true}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Course details</DialogTitle>
						<hr />
						<DialogDescription></DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreatetaskModal;
