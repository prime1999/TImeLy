import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdNumbers, MdTextFields } from "react-icons/md";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { courseSchema } from "@/lib/Validation";
import DayAndTime from "../DayAndTime";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { formatScheduleTime } from "@/lib/utils/helperFunctions/TimeFormater";
import SubmitButton from "@/lib/utils/SubmitButton";
import { compareCourseInfo } from "@/lib/actions/Course.action";
import { AppDispatch } from "@/lib/store";
import { submitUpdateRequest } from "@/lib/slice/CourseSlice";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	course: any;
};

const days = [
	{ name: "Monday", value: "monday" },
	{ name: "Tuesday", value: "tuesday" },
	{ name: "Wednesday", value: "wednesday" },
	{ name: "Thursday", value: "thursday" },
	{ name: "Friday", value: "friday" },
];

const UpdateCourseModal = ({ open, setOpen, course }: Props) => {
	// init the dispatch
	const dispatch = useDispatch<AppDispatch>();
	// state to handle the state needed for this component
	const { isLoading } = useSelector((state: any) => state.course);
	const [startDate, setStartDate] = useState<any>(new Date());
	const [endDate, setEndDate] = useState<any>(new Date());
	const [day, setDay] = useState<string>("");
	const [schedule, setSchedule] = useState<any>(JSON.parse(course.schedule));
	// init the initial form values using the schema for this form
	const form = useForm<z.infer<typeof courseSchema>>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			courseCode: course.CourseCode,
			courseTitle: course.CourseTitle,
			courseUnit: Number(course.unit),
			lecturer: course.lecturer,
			venue: course.venue,
		},
	});
	const { getValues } = form;
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
			venue: getValues().venue === undefined ? "" : getValues().venue,
			day,
			startDate: formatScheduleTime(startDate),
			endDate: formatScheduleTime(endDate),
		};
		// check if any of the data is available before adding the schedule to the array
		if (day !== "" && startDate !== "" && endDate !== "") {
			setSchedule((prev: any) => [...prev, newSchedule]);
		} else if (day === "" || startDate === "" || endDate === "") {
			toast("Course Schedule date not set");
		}
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

	const onSubmit = async (values: z.infer<any>) => {
		try {
			// create the data to send
			const data = {
				venue: values.venue,
				lecturer: values.lecturer,
				CourseCode: values.CourseCode,
				CourseTitle: values.CourseTitle,
				unit: values.unit,
				schedule,
			};
			// check if the course exists with the same info
			const existingCourse: any = await compareCourseInfo(course.$id, data);
			if (existingCourse && !existingCourse.exists) {
				// show error msg
				toast("Course details already existed");
				return;
			}
			// if the course info to updte is different then,
			const updateData = {
				updateData: existingCourse.payload,
				courseId: course.$id,
			};
			// call the function to dispatch the submit update request function in the redux store state
			await dispatch(submitUpdateRequest(updateData)).unwrap();
			// show success msg
			toast("Course update request has been sent");
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main>
			<Toaster />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="h-[90vh] overflow-y-auto scrollable-div">
					<DialogHeader>
						<DialogTitle className="text-md font-inter">
							Suggest the update, It will be sent to the admin for review.
						</DialogTitle>
						<DialogDescription className="my-2">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6 w-full mx-auto"
								>
									<div>
										<div className="col-span-2 mb-4 lg:mb-0">
											<CustomFormField
												fieldType={FormFieldType.input}
												control={form.control}
												name="courseTitle"
												label="Course Title"
												placeholder={course.CourseTitle}
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
												placeholder={course.CourseCode}
												type="text"
												iconSrc={<MdTextFields />}
											/>
										</div>
										<CustomFormField
											fieldType={FormFieldType.input}
											control={form.control}
											name="courseUnit"
											label="Course-Unit"
											placeholder={course.unit}
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
												placeholder={course.lecturer}
												type="text"
												iconSrc={<MdTextFields />}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-4 mt-4">
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
									</div>
									<SubmitButton
										isLoading={isLoading}
										className="w-full mx-auto flex justify-center mt-4 bg-green-400 text-black rounded-lg font-inter font-bold"
									>
										Send Update
									</SubmitButton>
								</form>
							</Form>
						</DialogDescription>
						{/* <button
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
							) : (
								<p>Submit update request</p>
							)}
						</button> */}
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default UpdateCourseModal;
