import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { formatDateRange } from "little-date";
import { Calendar } from "@/components/ui/calendar";
import TaskList from "@/components/TaskList";
import { AppDispatch } from "@/lib/store";
import { filterTaskByDate, filterTaskByStatus } from "@/lib/slice/TasksSlice";
import CreatetaskModal from "@/components/modals/CreatetaskModal";
import { getStatusTasksLength } from "@/lib/utils/helperFunctions/helper";

const Tasks = () => {
	const dispatch = useDispatch<AppDispatch>();
	// state to determine if to show the status buttons
	const [showStatus, setShowStatus] = useState<boolean>(true);
	// state to hole the selected status
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	// state to open/close the create task modal
	const [open, setOpen] = useState<boolean>(false);
	// state to handle the current choose date value
	const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));
	const { tasks } = useSelector((state: any) => state.tasks);
	// filter task by their dates
	const handleDate = async (value: any) => {
		try {
			setSelectedStatus("all");
			setShowStatus(true);
			// set the show date to th date selected
			setDate(value);
			// dispatch the filter of the task function
			const resTasks = await dispatch(
				filterTaskByDate({ date: value })
			).unwrap();
			return resTasks;
		} catch (error) {
			console.log(error);
		}
	};

	const handleStatusFilter = async (status: string) => {
		try {
			if (status === "all") {
				setSelectedStatus("");
				setShowStatus(true);
			} else {
				setSelectedStatus(status);
				setShowStatus(false);
			}
			await dispatch(filterTaskByStatus({ status })).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main className="w-11/12 mx-auto mt-4">
			<div className="w-full grid grid-cols-3 gap-8 mt-20">
				<div className="col-span-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-8">
							<h1 className="flex items-center gap-2 font-semibold text-2xl dark:text-slate-300">
								My Tasks
								<span className="text-xs bg-green-400 rounded-full py-1 px-2">
									{tasks && tasks.length}
								</span>
							</h1>
							<div className="flex items-center gap-4 font-inter text-xs font-semibold">
								{tasks && selectedStatus !== "" ? (
									<button
										onClick={() => handleStatusFilter("all")}
										className="flex items-center gap-2 rounded-md py-1 px-2 bg-gray-300 duration-500 cursor-pointer hover:bg-gray-500"
									>
										<p>All</p>
									</button>
								) : (
									showStatus && (
										<>
											<button
												onClick={() => handleStatusFilter("pending")}
												className="flex items-center gap-2 rounded-md py-1 px-2 bg-[rgba(255,0,0,0.2)] duration-500 cursor-pointer hover:bg-[rgba(255,0,0,0.4)]"
											>
												<p>Pending</p>
												<p className="">
													{getStatusTasksLength(tasks, "pending")}
												</p>
											</button>
											<button
												onClick={() => handleStatusFilter("inProgress")}
												className="flex items-center gap-2 rounded-md py-1 px-2 bg-[rgba(255,255,0,0.2)] cursor-pointer duration-500 hover:bg-[rgba(255,255,0,0.4)]"
											>
												<p>In-Progress</p>
												<p>{getStatusTasksLength(tasks, "inProgress")}</p>
											</button>
											<button
												onClick={() => handleStatusFilter("done")}
												className="flex items-center gap-2 rounded-md py-1 px-2 bg-[rgba(144,238,144,0.3)] cursor-pointer duration-500 hover:bg-[rgba(144,238,144,0.5)]"
											>
												<p>Done</p>
												<p>{getStatusTasksLength(tasks, "done")}</p>
											</button>
										</>
									)
								)}
							</div>
						</div>
						<span>
							<button
								onClick={() => setOpen(true)}
								className="flex gap-2 items-center text-sm font-inter font-semibold cursor-pointer duration-700 hover:gap-4"
							>
								Add task{" "}
								<span className="bg-green-400 rounded-full p-2">
									<FaPlus />
								</span>
							</button>
						</span>
					</div>
					<TaskList />
				</div>
				<Calendar
					mode="single"
					selected={date}
					captionLayout="dropdown"
					className="col-span-1 glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
					onSelect={(date) => {
						handleDate(date);
					}}
				/>
			</div>
			<CreatetaskModal open={open} setOpen={setOpen} />
		</main>
	);
};

export default Tasks;
