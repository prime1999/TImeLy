import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { courseSchema } from "@/lib/Validation";
import { MdNumbers, MdTextFields, MdOutlineLocationOn } from "react-icons/md";
import DayAndTime from "../DayAndTime";
import SubmitButton from "@/lib/utils/SubmitButton";
import { registerCourse, submitUpdateRequest } from "@/lib/slice/CourseSlice";
import { formatScheduleTime } from "@/lib/utils/helperFunctions/TimeFormater";
import Loader from "@/lib/utils/Loader";
import { checkCurrentSession } from "@/lib/actions/Student.actions";

const days = [
	{ name: "Monday", value: "monday" },
	{ name: "Tuesday", value: "tuesday" },
	{ name: "Wednesday", value: "wednesday" },
	{ name: "Thursday", value: "thursday" },
	{ name: "Friday", value: "friday" },
];

const AddCourse = () => {
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	// get the pathname from the current url
	const paths = location.pathname.split("/");
	const [startDate, setStartDate] = useState<any>(new Date());
	const [endDate, setEndDate] = useState<any>(new Date());
	const [day, setDay] = useState<string>("");
	const [schedule, setSchedule] = useState<any>([]);
	const form = useForm<z.infer<typeof courseSchema>>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			courseCode: "",
			courseTitle: "",
			courseUnit: 0,
			lecturer: "",
			startTime: "",
			endTime: "",
			venue: "",
		},
	});
	// state for opening or closing the modal
	const [open, setOpen] = useState<boolean>(false);
	// get the course and student states from the redux state
	const { isLoading, data } = useSelector((state: any) => state.course);
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
			day,
			startDate: formatScheduleTime(startDate),
			endDate: formatScheduleTime(endDate),
		};
		// ceck if any of the data is available before adding the schedule to the array
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
				venue: values.venue,
				lecturer: values.lecturer,
				schedule,
			};
			// dispatch the function to register course
			const res = await dispatch(registerCourse(data)).unwrap();
			// check if the course info exist and if the user info corresponds
			if (res && res.exist) {
				// if it existrs and does not correspons,
				// open the submit request modal
				console.log(res);
				setOpen(true);
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
				console.log(data);
				const updateData = {
					updateData: data.data,
					courseId: data.courseId,
				};
				console.log;
				// dispatch the function to submit the course request
				const updateRes = await dispatch(submitUpdateRequest(updateData));
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
			<h4 className="mt-8 font-inter">
				Check, Add, update and remove your courses here for better App
				experience.
			</h4>
			<div className="mt-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-start flex-wrap gap-4 space-y-6 w-full mx-auto"
					>
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="courseTitle"
							label="Course Title"
							placeholder="Title of the course"
							type="text"
							iconSrc={<MdTextFields />}
							className="w-[400px]"
						/>
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="courseCode"
							label="Course-Code"
							placeholder="course code"
							type="text"
							iconSrc={<MdTextFields />}
						/>
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
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="lecturer"
							label="Lecturer"
							placeholder="lecturer"
							type="text"
							iconSrc={<MdTextFields />}
							className="w-[300px]"
						/>
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="venue"
							label="Venue"
							placeholder="venue"
							type="text"
							iconSrc={<MdOutlineLocationOn />}
						/>
						<DayAndTime
							startDate={startDate}
							endDate={endDate}
							day={day}
							setStartDate={setStartDate}
							setEndDate={setEndDate}
							setDay={setDay}
							handleSelect={handleSelect}
							form={form}
							array={days}
							handleSetDate={handleSetDate}
							schedule={schedule}
							removeSchedule={removeSchedule}
						/>
						<SubmitButton
							isLoading={isLoading}
							className="w-1/2 mx-auto flex justify-center mt-4 bg-green-400 text-black rounded-lg font-inter font-bold"
						>
							Add Course
						</SubmitButton>
					</form>
				</Form>
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Course Info Exists.</DialogTitle>
						<DialogDescription className="my-2">
							{student?.admin ? (
								<>
									Would you like to update the course with the submitted info as
									an admin?.
								</>
							) : (
								<>
									The course info is quite different from what is in the current
									database <br />
									Would you like to submit a request to update the course.
									<br />
									Your request will be submitted to the admin for review.
								</>
							)}
						</DialogDescription>
						<button
							onClick={handleUpdate}
							disabled={isLoading}
							className={`w-full bg-green-400 rounded-md text-black font-inter font-semibold py-2 cursor-pointer duration-500 hover:bg-green-600 ${
								isLoading && '"cursor-default py-1"'
							}`}
						>
							{isLoading ? (
								<span className="flex gap-2 justify-center">
									<Loader /> <p>Loading...</p>
								</span>
							) : student?.admin ? (
								<p>Update Course</p>
							) : (
								<p>Submit update request</p>
							)}
						</button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Toaster />
		</main>
	);
};

export default AddCourse;
