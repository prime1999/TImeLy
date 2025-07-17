"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdsClick, MdRemoveCircle, MdModeEdit } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch } from "@/lib/store";
import { getCourses } from "@/lib/slice/CourseSlice";
import CourseDetail from "./modals/CourseDetail";
import UpdateCourseModal from "./modals/UpdateCourseModal";
import TableLoader from "@/lib/utils/tableLoader";
import DeleteModal from "./modals/DeleteModal";

const CourseList = () => {
	// state for the modals
	const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
	const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
	const [showCourseDetails, setShowCourseDetails] = useState<boolean>(false);
	// init the dispatch
	const dispatch = useDispatch<AppDispatch>();
	// state for the course state selection from the store
	const { isLoading, reload, data } = useSelector((state: any) => state.course);

	useEffect(() => {
		dispatch(getCourses());
	}, [reload]);

	return (
		<main className="w-full bg-gray-100 rounded-md p-2 mt-4 dark:bg-gray-700">
			{isLoading ? (
				<div className="flex items-center justify-center p-8">
					<TableLoader />
				</div>
			) : (
				Array.isArray(data) &&
				!isLoading &&
				data?.map((course: any, i: number) => (
					<div
						key={i}
						className="relative w-full font-inter text-xs capitalize mt-4 bg-white shadow-md p-4 rounded-md dark:bg-gray-900 dark:shadow-gray-600"
					>
						<div className="w-full flex items-center flex-auto gap-2">
							<div className="w-4/12 flex flex-col lg:w-2/12">
								<h6 className="text-xs mb-2 text-gray-500 dark:text-gray-400">
									Course-Code
								</h6>
								<p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
									{course.CourseCode}
								</p>
							</div>
							<div className="hidden flex-col w-4/12 lg:flex">
								<h6 className="text-xs mb-2 text-gray-500 dark:text-gray-400">
									Course-Title
								</h6>
								<p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
									{course.CourseTitle}
								</p>
							</div>
							<div className="flex flex-col w-1/12">
								<h6 className="text-xs mb-2 text-gray-500 dark:text-gray-400">
									Unit
								</h6>{" "}
								<p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
									{course.unit}
								</p>
							</div>
							<div className="hidden flex-col w-2/12 lg:flex">
								<h6 className="text-xs mb-2 text-gray-500 dark:text-gray-400">
									Lecturer
								</h6>
								<p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
									{course.lecturer}
								</p>
							</div>
							<div className="flex flex-col justify-end items-center">
								<h6 className="text-xs mb-2 text-gray-500 dark:text-gray-400">
									Full details
								</h6>
								<button
									onClick={() => setShowCourseDetails(true)}
									className="text-sm cursor-pointer"
								>
									<MdAdsClick className="tetx-sm" />
								</button>
							</div>
							<div className="absolute right-5 bottom-5 flex justify-end">
								<Popover>
									<PopoverTrigger>
										<button>
											<BiDotsVerticalRounded className="text-md cursor-pointer" />
										</button>
									</PopoverTrigger>
									<PopoverContent className="w-[150px] py-2 px-2">
										<ul className="font-inter">
											<li className="text-sm mt-2">
												<button
													onClick={() => setOpenRemoveModal(true)}
													className="flex items-center gap-2  cursor-pointer duration-700 hover:gap-4"
												>
													<MdRemoveCircle className="text-red-500" />{" "}
													<p className="text-xs">Remove</p>
												</button>
											</li>
											<li className="text-sm mt-2">
												<button
													onClick={() => setOpenUpdateModal(true)}
													className="flex items-center gap-2  cursor-pointer duration-700 hover:gap-4"
												>
													<MdModeEdit className="text-green-500" />{" "}
													<p className="text-xs">Edit</p>
												</button>
											</li>
										</ul>
									</PopoverContent>
								</Popover>
							</div>
						</div>
						{showCourseDetails && (
							<CourseDetail
								selectedCourse={course}
								showCourseDetails={showCourseDetails}
								setShowCourseDetails={setShowCourseDetails}
							/>
						)}
						<UpdateCourseModal
							course={course}
							open={openUpdateModal}
							setOpen={setOpenUpdateModal}
						/>
						<DeleteModal
							open={openRemoveModal}
							setOpen={setOpenRemoveModal}
							//	handleRemove={handleRemove}
							course={course}
						>
							<div>
								<h4 className="font-inter text-md font-semibold text-black dark:text-gray-300">
									Remove Course
								</h4>
								<hr className="my-2" />
								<p className="text-xs font-inter">
									You are about to un-register this course and won't get any
									update about the course after this.
								</p>
							</div>
						</DeleteModal>
					</div>
				))
			)}
		</main>
	);
};

export default CourseList;
