import {
	Dialog,
	DialogClose,
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import CourseRequestDetails from "../CourseRequestDetails";

type Props = {
	open: boolean;
	setOpen: any;
	notification: any;
};

const ShowNotificationDetailsModal = ({
	open,
	setOpen,
	notification,
}: Props) => {
	console.log(notification);
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogTitle>Details</DialogTitle>
					<DialogHeader>
						{notification.type === "request" && (
							<CourseRequestDetails notification={notification} />
						)}
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<button
								onClick={() => setOpen(false)}
								className="font-inter w-full bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
							>
								Close
							</button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShowNotificationDetailsModal;
