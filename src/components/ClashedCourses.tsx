import { useEffect } from "react";
import { AppDispatch } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { GrSchedules } from "react-icons/gr";
import { getClashedCourses } from "@/lib/slice/CourseSlice";

const ClashedCourses = () => {
	const dispatch = useDispatch<AppDispatch>();

	// state for the course state selection from the store
	const { isLoading, reload, clashedCourses, data } = useSelector(
		(state: any) => state.course
	);
	useEffect(() => {
		if (data && Array.isArray(data) && data.length > 0) {
			dispatch(getClashedCourses(data));
		}
	}, [reload, dispatch, data]);
	console.log(
		clashedCourses &&
			clashedCourses?.map((course: any) => {
				return course.day;
			})
	);

	return (
		<main className="glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 font-inter text-sm mb-8 w-full py-8 px-4 tracking-wide text-gray-800 rounded-md dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400 lg:h-48 lg:gap-4">
			<h2 className="font-semibold">
				{clashedCourses.length > 0 ? (
					<>
						<span
							className="flex items-center justify-between bg-muted mb-2 after:bg-red-500
									 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]"
						>
							Your have some courses on your time-table that are clashing with
							each other
						</span>
						<button className="flex items-center justify-center mx-auto bg-green-400 p-2 rounded-md mt-4 cursor-pointer duration-700 hover:bg-green-500 text-gray-800 dark:text-slate-200">
							Check
						</button>
					</>
				) : (
					<span
						className="flex items-center justify-between bg-muted mb-2 after:bg-green-500
									 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]"
					>
						None of your courses schedules are clashing
					</span>
				)}
			</h2>
			{/* <h5 className="text-sm font-semibold flex items-center justify-between">
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
					clashedCourses[0] && (
						<div className="">
							<p className="capitalize mb-2 text-sm">
								{firstClashedClass?.day}
							</p>
							{firstClashedClass?.courses.map((courseDetail: any) => (
								<div
									key={courseDetail.$id}
									className="flex items-center justify-between bg-muted mb-2 after:bg-red-500
									 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]"
								>
									<div className="text-xs font-medium capitalize">
										<h6>{courseDetail.CourseCode}</h6>
										<p>{`${firstClashedClass?.timeA.startDate} - ${firstClashedClass?.timeA.endDate}`}</p>
									</div>
									{/* <div className="text-muted-foreground text-xs">
									{formatDateRange(
										new Date(task.startDate),
										new Date(task.endDate)
									)}
								</div> */}
			{/* </div>
							))}
							<button className="my-1">See All</button>
						</div>
					)}
			</div> */}
		</main>
	);
};

export default ClashedCourses;
