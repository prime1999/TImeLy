import { AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import { FaBookOpen } from "react-icons/fa";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { registerCourse } from "@/lib/slice/CourseSlice";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	courses: any;
};

const ShowUnregisteredCourses = ({ open, setOpen, courses }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	console.log(courses);

	// function to register the course for the user
	const handleRegisterCourse = async (data: any) => {
		try {
			console.log(123);
			const res = await dispatch(registerCourse(data));
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogTitle>
						These are what your mates are registered for.
					</DialogTitle>

					<div className="p-2 flex flex-col gap-3">
						{courses.length > 0 ? (
							courses.map((course: any, index: number) => (
								<div
									key={index}
									className="flex gap-2 item-center w-full bg-gray-200 font-inter text-xs rounded-md p-2"
								>
									<span
										className={`h-[36px] flex justify-center items-center p-2 ${
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
										<p className="text-[13px] truncate dark:text-slate-200">
											{course.CourseTitle}
										</p>
										<span className="flex gap-2 items-center text-xs text-gray-500 pt-1 dark:text-gray-600">
											<p>
												{course.unit} {course.unit === "1" ? "unit" : "units"}
											</p>
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
									<button
										onClick={() => handleRegisterCourse(course)}
										className="bg-green-400 rounded-md px-4 text-xs font-semibold text-gray-700 cursor-pointer duration-700 hover:bg-green-500"
									>
										Add
									</button>
								</div>
							))
						) : (
							<p className="text-xs text-gray-500">No courses found.</p>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<div className="w-full font-inter flex items-center justify-between">
								<button
									onClick={() => setOpen(false)}
									className="w-full bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
								>
									Close
								</button>
							</div>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShowUnregisteredCourses;
