import { useEffect, useState } from "react";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { MdAdsClick, MdEditDocument } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { getTasks } from "@/lib/slice/TasksSlice";
import { TaskCountdown } from "@/lib/utils/helperFunctions/TimeFormater";
import TaskDetailsModal from "./modals/TaskDetailsModal";
import TableLoader from "@/lib/utils/tableLoader";

const TaskList = () => {
	const dispatch = useDispatch<AppDispatch>();
	// state to handle the task selected
	const [selectedTask, setSelectedTask] = useState<any>(null);
	// state to handle the create task modal
	const [open, setOpen] = useState<boolean>(false);
	// state to handle the show full task details modal
	const [openModal, setOpenModal] = useState<boolean>(false);

	const { tasks, filteredTasks, isLoading, isSuccess } = useSelector(
		(state: any) => state.tasks
	);

	useEffect(() => {
		// dispatch the fuction to get the users tasks
		const getUsersTasks = async () => {
			try {
				// call the function to get the tasks
				const res = await dispatch(getTasks()).unwrap();
				console.log(res);
			} catch (error) {
				console.log(error);
			}
		};
		getUsersTasks();
	}, [dispatch]);

	return (
		<main className="w-full glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 rounded-md p-4 mt-4 dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400">
			<div className="flex flex-col gap-4">
				{tasks &&
					tasks?.map((task: any) => (
						<div
							key={task.title}
							className={`grid grid-cols-3 bg-muted ${
								task.status === "done"
									? "after:bg-green-500"
									: task.status === "inProgress"
									? "after:bg-yellow-500"
									: "after:bg-red-500"
							} relative rounded-md p-4 pl-6 text-sm duration-500 after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)] hover:shadow-lg dark:shadow-slate-800`}
						>
							<div>
								{" "}
								<h1 className="font-medium w-24 truncate capitalize">
									{task.title}
								</h1>
								{/* <div className="text-muted-foreground text-xs">
									{formatDateRange(
										new Date(task.startDate),
										new Date(task.endDate)
									)}
								</div> */}
								<p className="w-24 truncate">{task.body ? task.body : "..."}</p>
							</div>
							<div className="flex gap-2 items-center">
								{" "}
								<button
									onClick={() => {
										setSelectedTask(task);
										setOpenModal(true);
									}}
									className="cursor-pointer bg-green-400 p-2 rounded-full dark:text-slate-200"
								>
									<MdAdsClick />
								</button>
								<span className="flex gap-1 items-center text-xs">
									<FaRegClock />
									<p className="font-semibold">
										{TaskCountdown(task.startDate)}
									</p>
								</span>
							</div>
							<button className="flex justify-center items-center text-sm gap-4 cursor-pointer duration-500 hover:gap-6">
								<p className="font-semibold">Attach a note</p>{" "}
								<MdEditDocument className="text-lg text-green-400" />
							</button>
						</div>
					))}
				{!tasks && <h1>No Task to show</h1>}
				<div className="flex items-center justify-center">
					{isLoading && <TableLoader />}
				</div>
			</div>
			<TaskDetailsModal
				task={selectedTask}
				open={openModal}
				setOpen={setOpenModal}
			/>
		</main>
	);
};

export default TaskList;
