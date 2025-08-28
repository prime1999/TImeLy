import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { FaPlus } from "react-icons/fa6";
import { MdAdsClick } from "react-icons/md";
import { formatDateRange } from "little-date";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CreatetaskModal from "./modals/CreatetaskModal";
import TaskDetailsModal from "./modals/TaskDetailsModal";
import { filterTaskByDate, getTasks } from "@/lib/slice/TasksSlice";
import TableLoader from "@/lib/utils/tableLoader";

const CalendarWithNotes = () => {
	const dispatch = useDispatch<AppDispatch>();
	// state to handle the task selected
	const [selectedTask, setSelectedTask] = useState<any>(null);
	// state to handle the create task modal
	const [open, setOpen] = useState<boolean>(false);
	// state to handle the show full task details modal
	const [openModal, setOpenModal] = useState<boolean>(false);
	// state to handle the current choose date value
	const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));
	// get the tasks gotten from the DB with other states from the redux store
	const { filteredTasks, tasks, isLoading } = useSelector(
		(state: any) => state.tasks
	);

	useEffect(() => {
		// dispatch the fuction to get the users tasks
		const getUsersTasks = async () => {
			try {
				// call the function to get the tasks
				await dispatch(getTasks()).unwrap();
			} catch (error) {
				console.log(error);
			}
		};
		getUsersTasks();
	}, [dispatch]);

	const handleDate = async (value: any) => {
		try {
			// set the show date to th date selected
			setDate(value);
			// dispatch the filter of the task function
			const resTasks = await dispatch(
				filterTaskByDate({ tasks, date: value })
			).unwrap();
			return resTasks;
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Card className="w-fit py-4">
				<CardContent className="px-4">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDate}
						className="bg-transparent p-0"
						required
					/>
				</CardContent>
				<CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
					<div className="flex w-full items-center justify-between px-1 font-inter">
						<div className="text-sm font-medium">
							{date?.toLocaleDateString("en-US", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</div>
						<button onClick={() => setOpen(true)}>
							<FaPlus className="cursor-pointer" />
							<span className="sr-only">Add Task</span>
						</button>
					</div>
					<div className="flex w-full flex-col gap-2">
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
						<span>
							{tasks && tasks.length > 2 && (
								<Link
									to="/tasks"
									className="absolute bottom-3 right-5 font-inter font-semibold text-sm cursor-pointer text-slate-300 duration-700 hover:text-slate-400"
								>
									See All
								</Link>
							)}
						</span>
						<div className="w-full h-full flex items-center justify-center">
							{isLoading && <TableLoader />}
						</div>
						<div className="">
							{!isLoading && filteredTasks && filteredTasks.length < 1 && (
								<h6 className="font-inter font-semibold text-xs">
									No task set for this date
								</h6>
							)}
						</div>
					</div>
				</CardFooter>
			</Card>
			<CreatetaskModal open={open} setOpen={setOpen} />
			<TaskDetailsModal
				task={selectedTask}
				open={openModal}
				setOpen={setOpenModal}
			/>
		</>
	);
};

export default CalendarWithNotes;
