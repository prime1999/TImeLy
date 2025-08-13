import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { GrSchedules } from "react-icons/gr";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { submitUpdateRequest } from "@/lib/slice/CourseSlice";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClashedCourseModal = ({ open, setOpen }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	// state for the course state selection from the store
	const { isLoading, clashedCourses } = useSelector(
		(state: any) => state.course
	);

	// function to notify the admin of the changes
	const notifyAdmin = async () => {
		try {
			// the notification payload info
			let actions: any = [];
			const updateData = {
				actions,
				updateData: clashedCourses.courses,
			};
			const notificationData = {
				title: "Request to update course details",
				message: `There is a request to correct course info, Please do review.`,
				type: "request",
				actions: JSON.stringify(actions),
				isRead: false,
				createdAt: new Date().toISOString(),
			};
			// call the function to dispatch the submit update request function in the redux store state
			await dispatch(submitUpdateRequest(notificationData)).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main>
			<Dialog open={open}>
				<DialogContent className="font-inter text-gray-600 sm:max-w-[425px] dark:text-gray-400">
					<div>
						<h5 className="text-sm font-semibold flex items-center justify-between">
							{clashedCourses && clashedCourses.length > 0
								? "Courses with clashing schedules"
								: ""}
							<span>
								<GrSchedules className="text-green-400" />
							</span>
						</h5>
						<div className="-mt-4">
							{clashedCourses &&
								Array.isArray(clashedCourses) &&
								clashedCourses.length > 0 &&
								clashedCourses.map((course, i) => (
									<div
										key={i}
										className="mt-6 h-[180px] overflow-auto scrollable-div"
									>
										<p className="capitalize mb-2 text-sm">{course?.day}</p>
										{course?.courses.map((courseDetail: any) => (
											<div
												key={courseDetail.$id}
												className="flex items-center justify-between bg-muted mb-2 after:bg-red-500
									 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]"
											>
												<div className="text-xs font-medium capitalize">
													<h6>{courseDetail.CourseCode}</h6>
													<p>{`${course?.timeA.startDate} - ${course?.timeA.endDate}`}</p>
												</div>
												{/* <div className="text-muted-foreground text-xs">
													{formatDateRange(
														new Date(task.startDate),
														new Date(task.endDate)
													)}
												</div> */}
											</div>
										))}
									</div>
								))}
						</div>
					</div>
					<DialogFooter className="flex flex-col">
						<div className="w-full flex flex-col font-inter text-xs font-semibold">
							<button className="bg-green-500 w-full rounded-md p-2 text-gray-200 cursor-pointer duration-700 hover:bg-green-600">
								Notify Admin
							</button>
							<button
								onClick={() => setOpen(false)}
								className="w-full bg-red-500 mt-2 p-2 rounded-md text-gray-200 cursor-pointer duration-700 hover:bg-red-600"
							>
								Close
							</button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default ClashedCourseModal;
