"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdsClick, MdRemoveCircle, MdModeEdit } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch } from "@/lib/store";
import {
	findUnRegisteredCourses,
	getCourses,
	registerCourse,
} from "@/lib/slice/CourseSlice";
import CourseDetail from "./modals/CourseDetail";
import UpdateCourseModal from "./modals/UpdateCourseModal";
import TableLoader from "@/lib/utils/tableLoader";
import DeleteModal from "./modals/DeleteModal";
import {
	getDuration,
	getToday,
} from "@/lib/utils/helperFunctions/TimeFormater";
import FindCourses from "./FindCourses";
import ShowUnregisteredCourses from "./modals/ShowUnregisteredCourses";

const TimeTable = () => {
	// state for the found courses
	const [courses, setCourses] = useState<any>([]);
	// state for the selected course
	const [selectedCourse, setSelectedCourse] = useState<any>(null);
	// state for the modals
	const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
	const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
	const [showCourseDetails, setShowCourseDetails] = useState<boolean>(false);
	// modal state to show unreistered related courses
	const [open, setOpen] = useState<boolean>(false);
	// init the dispatch
	const dispatch = useDispatch<AppDispatch>();
	// state for the course state selection from the store
	const { isLoading, reload, data } = useSelector((state: any) => state.course);

	useEffect(() => {
		dispatch(getCourses());
	}, [reload]);

	// function to find unregistered courses related to the current student
	const handleFindCourse = async () => {
		try {
			const courses = await dispatch(findUnRegisteredCourses()).unwrap();
			console.log(courses);
			if (courses.length > 0) {
				console.log(courses);
				setOpen(true);
				setCourses(courses);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className="w-full bg-gray-100 rounded-md p-2 mt-4 dark:bg-gray-700">
			<h3 className="font-inter font-bold p-2 text-gray-600 uppercase dark:text-slate-400">
				Your Time-Table
			</h3>
			{isLoading ? (
				<div className="flex items-center justify-center p-8">
					<TableLoader />
				</div>
			) : data && Array.isArray(data) && data.length > 0 && !isLoading ? (
				<div>
					{data?.map((course: any, i: number) => (
						<div
							key={i}
							className="relative w-full font-inter text-xs capitalize mt-4 bg-white shadow-md p-4 rounded-md dark:bg-gray-900 dark:shadow-gray-600"
						>
							<div className="w-full flex items-center gap-8 justify-between">
								<div className="w-4/12 h-full flex gap-2 items-center">
									<span
										className={`h-[32px] flex justify-center items-center p-2 ${
											course.unit === "4"
												? "bg-green-300"
												: course.unit === "3"
												? "bg-purple-300"
												: course.unit === "2"
												? "bg-yellow-200"
												: "bg-red-300"
										}`}
									>
										<FaBookOpen className="text-md dark:text-slate-800" />
									</span>
									<div className="w-full flex flex-col">
										<p className="text-[15px] truncate dark:text-slate-200">
											{course.CourseTitle}
										</p>
										<span className="flex gap-2 items-center text-xs text-gray-500 pt-1 dark:text-gray-600">
											{course.CourseCode && (
												<>
													<p>{course.CourseCode}</p>
													<span className="bg-gray-500 w-1 h-1 rounded-full dark:bg-gray-600"></span>
												</>
											)}
											<p>
												{course.unit} {course.unit === "1" ? "unit" : "units"}
											</p>{" "}
											<span className="bg-gray-500 w-1 h-1 rounded-full dark:bg-gray-600"></span>
											<p>{course.venue ? course.venue : "unknown venue"}</p>
											{course.lecturer && (
												<>
													<span className="bg-gray-500 w-1 h-1 rounded-full dark:bg-gray-600"></span>
													<p>{course.lecturer}</p>
												</>
											)}
										</span>
									</div>
								</div>
								<div className="flex flex-col justify-end items-center">
									<h6 className="text-xs mb-2 font-semibold text-gray-500 dark:text-gray-400">
										Full Schedule
									</h6>
									<button
										onClick={() => {
											setSelectedCourse(course);
											setShowCourseDetails(true);
										}}
										className="text-sm bg-green-400 rounded-full p-2 cursor-pointer duration-500 hover:bg-green-500"
									>
										<MdAdsClick className="tetx-sm" />
									</button>
								</div>
								<div className="flex flex-col items-center gap-2">
									<p className="text-sm font-semibold  text-gray-500 dark:text-gray-400">
										{getToday()}
									</p>
									{JSON.parse(course.schedule).map((time: any, i: number) => (
										<span key={i} className="flex mb-2">
											{time.day.toLowerCase() === getToday().toLowerCase() ? (
												<p className="text-gray-500 dark:text-gray-600">
													{getDuration(time.startDate, time.endDate)}
												</p>
											) : (
												<p className="text-gray-500 dark:text-gray-600">Free</p>
											)}
										</span>
									))}
								</div>

								{/* <div className="absolute right-5 bottom-5 flex justify-end">
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
							</div> */}
							</div>
							{showCourseDetails && (
								<CourseDetail
									selectedCourse={selectedCourse}
									showCourseDetails={showCourseDetails}
									setShowCourseDetails={setShowCourseDetails}
								/>
							)}
							{/*
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
						</DeleteModal> */}
						</div>
					))}
					<div className="flex justify-end mt-4">
						<button
							onClick={() => handleFindCourse()}
							className="w-24 text-sm font-semibold p-2 rounded-md bg-green-500 cursor-pointer duration-700 hover:bg-green-600"
						>
							Find
						</button>
					</div>
				</div>
			) : (
				<FindCourses handleFindCourse={handleFindCourse} />
			)}
			<ShowUnregisteredCourses
				courses={courses}
				open={open}
				setOpen={setOpen}
			/>
		</main>
	);
};

export default TimeTable;
