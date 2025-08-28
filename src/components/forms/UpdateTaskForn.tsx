import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { createTaskSchema } from "@/lib/Validation";
import { MdTextFields } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import SubmitButton from "@/lib/utils/SubmitButton";
import { getTasks, updateTask } from "@/lib/slice/TasksSlice";
import TaskBody from "../TaskBody";

const status = [
	{ name: "In-Progress", value: "inProgress" },
	{ name: "Done", value: "done" },
	{ name: "Pending", value: "pending" },
];

type Props = {
	task: any;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateTaskForm = ({ setOpen, task }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	// state for the task body
	const [body, setBody] = useState<string>(task.body);
	// state to store the status value
	const [selectedStatus, setSelectedStatus] = useState<String>(task.status);
	// state to get the task redux state from the rdux store
	const { isLoading } = useSelector((state: any) => state.tasks);
	const form = useForm<z.infer<typeof createTaskSchema>>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: task.title,
			status: task.status,
			startDate: task.startDate ? new Date(task.startDate) : undefined,
			endDate: task.endDate ? new Date(task.endDate) : undefined,
		},
	});

	const onSubmit = async (values: z.infer<any>) => {
		try {
			// dispatch the function to send the task data to redux update task function
			const taskData: any = {
				$id: task.$id,
				title: values.title,
				body,
				status: selectedStatus,
				startDate: values.startDate,
				endDate: values.endDate,
			};

			const res = await dispatch(updateTask(taskData)).unwrap();
			// send the msg gotten from the appwrite add task functionality
			toast(res?.msg);
			if (res && res?.msg === "Document updated Successfully") {
				// dispatch the function to get the tasks
				dispatch(getTasks());
				setOpen(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	console.log(task);
	return (
		<div className="h-[400px] overflow-auto scrollable-div">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 mx-auto max-w-full"
				>
					<div className="w-full">
						<div className="my-2 lg:mb-0">
							<CustomFormField
								fieldType={FormFieldType.input}
								control={form.control}
								name="title"
								label="Title"
								placeholder="Task Title"
								type="text"
								iconSrc={<MdTextFields />}
								className="w-full"
							/>
						</div>
						<div className="col-span-2 my-4 lg:mb-0">
							<TaskBody body={body} setBody={setBody} />
						</div>
						<div className="w-full flex gap-2 items-center mt-4">
							{status.map((stat) => (
								<span
									onClick={() => setSelectedStatus(stat.value)}
									className={`rounded-md text-center text-black font-semibold cursor-pointer duration-700 font-inter text-xs w-1/3 p-2 flex gap-2 items-center justify-center ${
										stat.value === "done"
											? "bg-green-400 hover:bg-green-500"
											: stat.value === "inProgress"
											? "bg-yellow-400 hover:bg-yellow-500"
											: "bg-red-400 hover:bg-red-500"
									}`}
								>
									{stat.name}
									{selectedStatus === stat.value && (
										<IoCheckmarkDoneCircle className="text-white text-md" />
									)}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2 justify-center flex-wrap my-4 lg:mb-0">
							<CustomFormField
								fieldType={FormFieldType.date}
								control={form.control}
								name="startDate"
								label="Start-Date"
								placeholder="Start Date"
								className="w-full"
							/>
							<CustomFormField
								fieldType={FormFieldType.date}
								control={form.control}
								name="endDate"
								label="End-Date"
								placeholder="End Date"
								className="w-full"
							/>
						</div>
					</div>
					<SubmitButton
						isLoading={isLoading}
						className="w-full mx-auto flex justify-center mt-4 bg-green-400 text-black rounded-lg font-inter font-bold"
					>
						Update Task
					</SubmitButton>
				</form>
			</Form>
			<Toaster />
		</div>
	);
};

export default UpdateTaskForm;
