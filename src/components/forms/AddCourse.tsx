import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { courseSchema } from "@/lib/Validation";
import { MdNumbers, MdTextFields } from "react-icons/md";
import DayAndTime from "../DayAndTime";
import SubmitButton from "@/lib/utils/SubmitButton";
import { registerCourse, submitUpdateRequest } from "@/lib/slice/CourseSlice";
import { formatScheduleTime } from "@/lib/utils/helperFunctions/TimeFormater";
import { checkCurrentSession } from "@/lib/actions/Student.actions";
import SubmitCourseUpdateRequest from "../modals/SubmitCourseUpdateRequest";

const days = [
	{ name: "Monday", value: "monday" },
	{ name: "Tuesday", value: "tuesday" },
	{ name: "Wednesday", value: "wednesday" },
	{ name: "Thursday", value: "thursday" },
	{ name: "Friday", value: "friday" },
];

const AddCourse = () => {
	const dispatch = useDispatch<AppDispatch>();

	const [startDate, setStartDate] = useState<any>(new Date());
	const [endDate, setEndDate] = useState<any>(new Date());
	const [day, setDay] = useState<string>("");
	const [venue, setVenue] = useState("");
	const [schedule, setSchedule] = useState<any>([]);
	const form = useForm<z.infer<typeof courseSchema>>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			courseCode: "",
			courseTitle: "",
			courseUnit: 0,
			lecturer: "",
			venue: "",
		},
	});
	// state for opening or closing the modal
	const [open, setOpen] = useState<boolean>(false);
	const { getValues } = form;
	// get the course and student states from the redux state
	const { isLoading, data, courseToUpdate } = useSelector(
		(state: any) => state.course
	);
	const { student } = useSelector((state: any) => state.student);

	// function to select the day
	const handleSelect = (value: string) => {
		setDay(value);
	};
	// function to set the date
	const handleSetDate = (e: any) => {
		// prevent the default form submission function
		e.preventDefault();
		// put the schedule data together
		const newSchedule = {
			venue: getValues("venue"),
			day,
			startDate: formatScheduleTime(startDate),
			endDate: formatScheduleTime(endDate),
		};
		// check if any of the data is available before adding the schedule to the array
		if (day !== "" && startDate !== "" && endDate !== "")
			setSchedule((prev: any) => [...prev, newSchedule]);
	};

	// function to remove a schedule when filling the add course form
	const removeSchedule = (day: string, startDate: string, endDate: string) => {
		// filter the schedule the user wants to remove the schedule
		const filteredSchedule = schedule.filter(
			(list: any) =>
				list.day !== day ||
				list.startDate !== startDate ||
				list.endDate !== endDate
		);
		setSchedule(filteredSchedule);
	};

	// function to submit the add course form
	const onSubmit = async (values: z.infer<any>) => {
		try {
			const student = await checkCurrentSession();
			// put the data to send together
			const data = {
				userId: student?.$id,
				courseCode: values.courseCode,
				courseTitle: values.courseTitle,
				unit: values.courseUnit,
				lecturer: values.lecturer,
				schedule,
			};
			// dispatch the function to register course
			const res: any = await dispatch(registerCourse(data)).unwrap();
			// check if the course info exist and if the user info corresponds
			if (res && res.exist) {
				// if it exists and does not correspond,
				// open the submit request modal
				setOpen(true);
			}
			if (res && res.description) {
				// show sent success msg
				toast(res.description);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// function to call the dispatch function to submit the course request
	const handleUpdate = async () => {
		try {
			// check if the student is an admin
			if (student?.admin === true) {
				// TODO
				// update directly
			} else {
				// create the actions array
				let actions = [
					{
						label: "approve key",
						function: "approveUpdate()",
						payload: {
							courseId: courseToUpdate.courseId,
							data: courseToUpdate.data,
						},
					},
					{
						label: "decline key",
						function: "declineUpdate()",
						payload: {
							courseId: courseToUpdate.courseId,
							data: courseToUpdate.data,
						},
					},
					{
						label: "show details",
						function: "showDetails()",
						payload: {
							courseId: courseToUpdate.courseId,
							data: courseToUpdate.data,
						},
					},
				];
				const notificationData = {
					title: "Request to update course details",
					message: `There is a request to correct course info, Please do review.`,
					type: "request",
					actions: JSON.stringify(actions),
					isRead: false,
					createdAt: new Date().toISOString(),
				};
				const updateData = {
					updateData: courseToUpdate.data,
					courseId: courseToUpdate.courseId,
				};
				// dispatch the function to submit the course request
				const updateRes = await dispatch(
					submitUpdateRequest({ notificationData, updateData })
				);
				// check if the request was submitted
				if (updateRes) {
					// close the modal
					setOpen(false);
					// show success toast
					toast("Your request has been sent.");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main>
			<div className="mt-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 mx-auto"
					>
						<div>
							<div className="col-span-2 mb-4 lg:mb-0">
								<CustomFormField
									fieldType={FormFieldType.input}
									control={form.control}
									name="courseTitle"
									label="Course Title"
									placeholder="Title of the course"
									type="text"
									iconSrc={<MdTextFields />}
									className="w-full"
								/>
							</div>
							<div className="my-4 mg:my-0">
								<CustomFormField
									fieldType={FormFieldType.input}
									control={form.control}
									name="courseCode"
									label="Course-Code"
									placeholder="course code"
									type="text"
									iconSrc={<MdTextFields />}
								/>
							</div>
							<CustomFormField
								fieldType={FormFieldType.input}
								control={form.control}
								name="courseUnit"
								label="Course-Unit"
								placeholder="course unit"
								type="number"
								inputMode="numeric"
								iconSrc={<MdNumbers />}
							/>
							<div className="mt-4">
								<CustomFormField
									fieldType={FormFieldType.input}
									control={form.control}
									name="lecturer"
									label="Lecturer"
									placeholder="lecturer"
									type="text"
									iconSrc={<MdTextFields />}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-4 mt-4">
							{/* <CustomFormField
								fieldType={FormFieldType.input}
								control={form.control}
								name="venue"
								label="Venue"
								placeholder="venue"
								type="text"
								iconSrc={<MdOutlineLocationOn />}
							/> */}
							<DayAndTime
								startDate={startDate}
								endDate={endDate}
								day={day}
								setStartDate={setStartDate}
								setEndDate={setEndDate}
								setDay={setDay}
								setVenue={setVenue}
								handleSelect={handleSelect}
								form={form}
								array={days}
								handleSetDate={handleSetDate}
								schedule={schedule}
								removeSchedule={removeSchedule}
							/>
						</div>

						<SubmitButton
							isLoading={isLoading}
							className="w-full mx-auto flex justify-center mt-4 bg-green-400 text-black rounded-lg font-inter font-bold"
						>
							Add Course
						</SubmitButton>
					</form>
				</Form>
			</div>
			<SubmitCourseUpdateRequest
				setOpen={setOpen}
				open={open}
				handleUpdate={handleUpdate}
			/>
			<Toaster />
		</main>
	);
};

export default AddCourse;
