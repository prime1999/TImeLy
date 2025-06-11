"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
const CourseDetail = ({ showCourseDetails, setShowCourseDetails }: any) => {
	const { data } = useSelector((state: any) => state.course);
	return (
		<>
			<Dialog open={showCourseDetails}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Course details</DialogTitle>
						<hr />
						<DialogDescription>
							<div>
								{data.map((list: any, i: number) => (
									<div key={i}>
										<div className="flex gap-2 mb-2">
											<h6 className="text-sm text-gray-500 font-semibold">
												Course-Title:
											</h6>
											<p className="">{list.CourseTitle}</p>
										</div>
										<div className="flex gap-2 mb-2">
											<h6 className="text-sm text-gray-500 font-semibold">
												Course-Code:
											</h6>
											<p className="capitalize">{list.CourseCode}</p>
										</div>
										<div className="flex gap-2 mb-2">
											<h6 className="text-sm text-gray-500 font-semibold">
												Unit:
											</h6>
											<p className="">{list.unit}</p>
										</div>
										<div className="flex gap-2 mb-2">
											<h6 className="text-sm text-gray-500 font-semibold">
												Venue:
											</h6>
											<p className="">{list.venue}</p>
										</div>
										<div className="flex gap-2 mb-2">
											<h6 className="text-sm text-gray-500 font-semibold">
												Lecturer:
											</h6>
											<p className="">{list.lecturer}</p>
										</div>
										<div className="flex flex-col">
											<h6 className="text-sm text-gray-500 font-semibold">
												Schedule:
											</h6>
											<ul className="text-xs">
												{JSON.parse(list.schedule).map(
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
								))}
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
