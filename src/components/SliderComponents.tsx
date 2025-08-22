import { useEffect } from "react";
import { AppDispatch } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { MdAdsClick, MdNoteAlt } from "react-icons/md";
import { GiDuration } from "react-icons/gi";
import { PiClockCountdownFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { PiNotepadFill } from "react-icons/pi";
import { getTasks } from "@/lib/slice/TasksSlice";
import { formatDateRange } from "little-date";
import TableLoader from "@/lib/utils/tableLoader";
import { forNextCourse } from "@/lib/slice/CourseSlice";
import { formatDateInfo } from "@/lib/utils/helperFunctions/helper";
import { getDuration } from "@/lib/utils/helperFunctions/TimeFormater";

type Props = {
	setOpenModal: React.Dispatch<any>;
	setSelectedTask: React.Dispatch<React.SetStateAction<boolean>>;
};

type props = {
	data: any;
};

// schedule slide
export const Tasks = ({ setSelectedTask, setOpenModal }: Props) => {
	// get the tasks gotten from the DB with other states from the redux store
	const { filteredTasks, isLoading } = useSelector((state: any) => state.tasks);

	return (
		<div className="relative glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 flex flex-col justify-start w-full h-full p-4 text-gray-800 rounded-md dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400 lg:h-48 lg:gap-4">
			{filteredTasks &&
				filteredTasks?.map((task: any) => (
					<div
						key={task.title}
						className={`flex items-center justify-between bg-muted ${
							task.status === "done"
								? "after:bg-green-500"
								: task.status === "inProgress"
								? "after:bg-yellow-500"
								: "after:bg-red-500"
						} relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]`}
					>
						<div>
							{" "}
							<div className="font-medium">{task.title}</div>
							<div className="text-muted-foreground text-xs">
								{formatDateRange(
									new Date(task.startDate),
									new Date(task.endDate)
								)}
							</div>
						</div>
						<button
							onClick={() => {
								setSelectedTask(task);
								setOpenModal(true);
							}}
						>
							<MdAdsClick />
						</button>
					</div>
				))}
			<span className="absolute bottom-2 right-5">
				<button className="text-xs font-inter duration-700 hover:text-slate-300">
					See full tasks
				</button>
			</span>
			<div className="h-full flex items-center justify-center">
				{isLoading && <TableLoader />}
			</div>
		</div>
	);
};
// count down slide
export const CountDown = () => {
	return (
		<div className="glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 flex flex-col justify-center items w-full h-full p-4 text-gray-800 rounded-md dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400 lg:h-48 lg:gap-4">
			<div className="flex justify-between items-center">
				<h4 className="font-inter font-semibold text-md lg:text-2xl">
					Count-Down
				</h4>
				<PiClockCountdownFill className="text-lg text-green-400 font-semibold lg:text-2xl" />
			</div>
			<p className="text-lg font-inter text-green-400 font-bold mt-4">
				{/* TODO  show count down to next examination*/}100 Days
			</p>

			<p className="text-sm font-inter font-semibold mt-2">
				To your next examination
			</p>
		</div>
	);
};

// next course timer slide
export const NextCourse = ({ data }: props) => {
	const dispatch = useDispatch<AppDispatch>();
	const { nextCourse } = useSelector((state: any) => state.course);
	useEffect(() => {
		if (data) {
			dispatch(forNextCourse(data));
		}
	}, [data, dispatch]);
	return (
		<div className="w-full">
			<div className="flex justify-between items-start text-gray-800">
				<h4 className="font-inter font-semibold text-xl dark:text-slate-400">
					Next Course: <br />
					<span className="text-sm text-green-400 font-medium">
						{nextCourse && nextCourse?.course?.CourseTitle}
					</span>
				</h4>
				<MdNoteAlt className="text-xl text-green-400 font-semibold mb-2" />
			</div>
			<span className="flex gap-2 items-center text-sm font-inter font-semibold mt-4">
				<h6>{formatDateInfo(nextCourse?.date)?.day}</h6> -{" "}
				<h6>{nextCourse?.schedule?.startDate}</h6>
			</span>
			<span className="flex items-center gap-2 mt-6">
				<GiDuration className="text-md text-green-400 duration-1000 group-hover:ml-2" />
				<p className="text-xs font-inter text-slate-700 font-semibold duration-500 dark:text-slate-300">
					{getDuration(
						nextCourse?.schedule?.startDate,
						nextCourse?.schedule?.endDate
					)}
				</p>
			</span>
		</div>
	);
};
// courses slide
export const Schedule = () => {
	return (
		<div className="glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 flex flex-col justify-center items w-full h-full p-4 text-gray-800 rounded-md dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400 lg:h-48 lg:gap-4">
			<div className="flex justify-between items-center">
				<h4 className="font-inter font-semibold text-md lg:text-2xl">
					Your Courses
				</h4>
				<MdNoteAlt className="text-md text-green-400 font-semibold lg:text-2xl" />
			</div>
			<span className="flex justify-between items-center text-xs font-inter mt-4 lg:text-lg">
				<p className="text-xs font-inter lg:text-md">
					{/* TODO  show students courses*/}Your courses will show here
				</p>
				<button className="text-green-400 font-semibold cursor-pointer duration-700 hover:text-green-500">
					See all
				</button>
			</span>
			<span className="flex items-center gap-2 mt-6 cursor-pointer group">
				<p className="text-xs font-inter font-semibold cursor-pointer duration-500 group-hover:text-gray-9000 lg:text-sm">
					Add more courses
				</p>
				<FaCirclePlus className="text-md text-green-400 mt-1 duration-1000 group-hover:ml-2" />
			</span>
		</div>
	);
};
