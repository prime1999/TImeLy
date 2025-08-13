import { useSelector } from "react-redux";
import Loader from "@/lib/utils/Loader";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleUpdate: () => any;
};
const SubmitCourseUpdateRequest = ({ setOpen, open, handleUpdate }: Props) => {
	const { student } = useSelector((state: any) => state.student);
	const { isLoading } = useSelector((state: any) => state.course);
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Course Info Exists.</DialogTitle>
						<DialogDescription className="my-2">
							{student?.admin ? (
								<>
									Would you like to update the course with the submitted info as
									an admin?.
								</>
							) : (
								<>
									The course info is quite different from what is in the current
									database <br />
									Would you like to submit a request to update the course.
									<br />
									Your request will be submitted to the admin for review.
								</>
							)}
						</DialogDescription>
						<button
							onClick={handleUpdate}
							disabled={isLoading}
							className={`w-full bg-green-400 rounded-md text-black font-inter font-semibold py-2 cursor-pointer duration-500 hover:bg-green-600 ${
								isLoading && '"cursor-default py-1"'
							}`}
						>
							{isLoading ? (
								<span className="flex gap-2 justify-center">
									<Loader /> <p>Loading...</p>
								</span>
							) : student?.admin ? (
								<p>Update Course</p>
							) : (
								<p>Submit update request</p>
							)}
						</button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SubmitCourseUpdateRequest;
