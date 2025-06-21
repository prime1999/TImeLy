import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
const CourseDetail = ({
	showCourseDetails,
	setShowCourseDetails,
	selectedCourse,
}: any) => {
	return (
		<>
			<Dialog open={showCourseDetails}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Course details</DialogTitle>
						<hr />
						<DialogDescription>
							<div>
								<div className="flex gap-2 mb-2">
									<h6 className="text-sm text-gray-500 font-semibold">
										Course-Title:
									</h6>
									<p className="">{selectedCourse.CourseTitle}</p>
								</div>
								<div className="flex gap-2 mb-2">
									<h6 className="text-sm text-gray-500 font-semibold">
										Course-Code:
									</h6>
									<p className="capitalize">{selectedCourse.CourseCode}</p>
								</div>
								<div className="flex gap-2 mb-2">
									<h6 className="text-sm text-gray-500 font-semibold">Unit:</h6>
									<p className="">{selectedCourse.unit}</p>
								</div>
								<div className="flex gap-2 mb-2">
									<h6 className="text-sm text-gray-500 font-semibold">
										Venue:
									</h6>
									<p className="">{selectedCourse.venue}</p>
								</div>
								<div className="flex gap-2 mb-2">
									<h6 className="text-sm text-gray-500 font-semibold">
										Lecturer:
									</h6>
									<p className="">{selectedCourse.lecturer}</p>
								</div>
								<div className="flex flex-col">
									<h6 className="text-sm text-gray-500 font-semibold">
										Schedule:
									</h6>
									<ul className="text-xs">
										{JSON.parse(selectedCourse.schedule).map(
											(time: any, i: number) => (
												<li key={i} className="flex mb-2">
													<p className="capitalize">{time.day}: </p>
													<p className="ml-2">
														{time.startDate} - {time.endDate}
													</p>
												</li>
											)
										)}
									</ul>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<button
								onClick={() => setShowCourseDetails(false)}
								className="bg-red-400 rounded-md p-2 text-sm text-white cursor-pointer duration-700 hover:bg-red-500"
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

export default CourseDetail;
