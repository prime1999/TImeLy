import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { MdAdsClick, MdRemoveCircle, MdModeEdit } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import CourseDetail from "./modals/CourseDetail";
import UpdateCourseModal from "./modals/UpdateCourseModal";
import { getStudentProfile } from "@/lib/slice/StudentSlice";
import DeleteCourseModal from "./modals/DeleteCourseModal";
import { forDeleteCourse, removeCourse } from "@/lib/slice/CourseSlice";
import Alert from "@/lib/utils/Alert";

const CourseList = ({ data }: any) => {
	const dispatch = useDispatch<AppDispatch>();
	// state to keep track if te user/student is an admin
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deleteCourse, setDeleteCourse] = useState<boolean>(false);
	const [selectedCourse, setSelectedCourse] = useState<any>(null);
	// state to show message for the delete course modal
	const [deleteModalMessage, setDeleteModalMessage] = useState<string>("");
	// state for the modals
	const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
	const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
	const [showCourseDetails, setShowCourseDetails] = useState<boolean>(false);

	const { isLoading } = useSelector((state: any) => state.course);

	// function to handle the un-registration of a course
	const handleRemove = async (courseId: string) => {
		try {
			setDeleteCourse(false);
			// dispatch th redux slice function to remove the course
			await dispatch(removeCourse(courseId));
			// close the modal
			setOpenRemoveModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	// function to check if te user is an admin before showing the delete modal
	const checkUser = async () => {
		try {
			// get he studnets profile info from the appwrite DB
			const student = await dispatch(getStudentProfile()).unwrap();
			setIsAdmin(student.admin);
			console.log(student);
			setDeleteCourse(true);
			// if the student is not an admin then
			if (!student.admin) {
				// show a modal that says student can update if not admin
				setOpenRemoveModal(true);
				// set the message modal
				setDeleteModalMessage(
					"Only Admins can delete courses, Students can unregister for the courses only."
				);
			} else {
				// but if the user is an admin then we ispatch the function to delete a course
				setOpenRemoveModal(true);
				// set the message modal
				setDeleteModalMessage(
					"This course will be permanently deleted from the database."
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// function to delete a course
	const handleDeleteCourse = async (courseId: string) => {
		try {
			// dispatch the function to delete te course
			const res = await dispatch(forDeleteCourse(courseId)).unwrap();
			// show the message from the response
			toast(res?.msg);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className="w-full bg-gray-100 rounded-md p-2 mt-4 dark:bg-gray-700">
			{data?.map((course: any, i: number) => (
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
								onClick={() => {
									setSelectedCourse(course);
									setShowCourseDetails(true);
								}}
								className="text-sm cursor-pointer"
							>
								<MdAdsClick className="tetx-sm" />
							</button>
						</div>
						<div className="absolute right-15 bottom-5 flex justify-end gap-8">
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
												onClick={() => {
													setSelectedCourse(course);
													setOpenRemoveModal(true);
													setDeleteModalMessage(
														"You are about to un-register this course and wont get any update about the course after this"
													);
												}}
												className="flex items-center gap-2  cursor-pointer duration-700 hover:gap-4"
											>
												<MdRemoveCircle className="text-red-500" />{" "}
												<p className="text-xs">Remove</p>
											</button>
										</li>
										<li className="text-sm mt-2">
											<button
												onClick={() => {
													setSelectedCourse(course);
													setOpenUpdateModal(true);
												}}
												className="flex items-center gap-2  cursor-pointer duration-700 hover:gap-4"
											>
												<MdModeEdit className="text-green-500" />{" "}
												<p className="text-xs">Edit</p>
											</button>
										</li>
									</ul>
								</PopoverContent>
							</Popover>
							<div>
								<button
									onClick={() => checkUser()}
									className="text-xs cursor-pointer text-red-500 duration-500 hover:text-[14px]"
								>
									<FaTrashAlt />
								</button>
							</div>
						</div>
					</div>
					{showCourseDetails && (
						<CourseDetail
							selectedCourse={selectedCourse}
							showCourseDetails={showCourseDetails}
							setShowCourseDetails={setShowCourseDetails}
						/>
					)}
					{openUpdateModal && (
						<UpdateCourseModal
							course={selectedCourse}
							open={openUpdateModal}
							setOpen={setOpenUpdateModal}
						/>
					)}

					{/* for deleting a course */}
					<DeleteCourseModal
						open={openRemoveModal}
						setOpen={setOpenRemoveModal}
					>
						<div className="w-full">
							<span className="flex items-start gap-2">
								<IoIosInformationCircle className="text-xl font-semibold text-green-400" />
								<p className="text-sm font-inter">{deleteModalMessage}</p>
							</span>
							{deleteCourse ? (
								<button
									onClick={() => {
										isAdmin
											? handleDeleteCourse(course.$id)
											: handleRemove(course.$id);
									}}
									className="w-full mt-4 bg-green-400 rounded-md p-2 text-xs font-semibold text-gray-700 cursor-pointer duration-700 hover:bg-green-500"
								>
									{isAdmin ? "Delete Course" : "Remove Course"}
								</button>
							) : (
								<button
									onClick={() => handleRemove(course.$id)}
									className="w-full mt-4 bg-green-400 rounded-md p-2 text-xs font-semibold text-gray-700 cursor-pointer duration-700 hover:bg-green-500"
								>
									Continue
								</button>
							)}
						</div>
					</DeleteCourseModal>
				</div>
			))}
			<Alert />
		</main>
	);
};

export default CourseList;
