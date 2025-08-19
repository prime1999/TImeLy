import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import { MdTextFields } from "react-icons/md";
import AddCourse from "@/components/forms/AddCourse";
import CourseList from "@/components/CourseList";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { CourseFilterSchema } from "@/lib/Validation";
import SubmitButton from "@/lib/utils/SubmitButton";
import { filterCourses, getCourses } from "@/lib/slice/CourseSlice";
import TableLoader from "@/lib/utils/tableLoader";

const select = [
	{ name: "Course-Title", value: "CourseTitle" },
	{ name: "Course-Code", value: "CourseCode" },
	{ name: "Lecturer", value: "lecturer" },
	{ name: "Day", value: "day" },
	{ name: "Unit", value: "unit" },
];

const Courses = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [value, setValue] = useState<any>("");
	// state for the course state selection from the store
	const { isLoading, reload, data, filteredCourses } = useSelector(
		(state: any) => state.course
	);
	const form = useForm<z.infer<typeof CourseFilterSchema>>({
		resolver: zodResolver(CourseFilterSchema),
		defaultValues: {
			select: "CourseCode",
			value: "",
		},
	});

	useEffect(() => {
		dispatch(getCourses());
	}, [reload]);

	//
	const handleSubmit = async (values: z.infer<any>) => {
		try {
			const searchData = {
				searchKey: values.select,
				searchValue: values.value,
			};
			console.log(searchData);

			await dispatch(filterCourses({ searchData, courses: data }));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className="w-11/12 mx-auto my-8">
			<h1 className="font-inter font-bold text-3xl">Courses</h1>
			<h4 className="mt-8 font-inter text-sm">
				Check, Add, update and remove your courses here for better App
				experience.
			</h4>
			<hr className="my-8" />
			<div className="flex items-center justify-between">
				<h4 className="font-inter text-sm font-semibold">Course List</h4>

				<div className="flex gap-4 items-center justify-end w-2/3">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="flex gap-2 items-center"
						>
							{" "}
							<CustomFormField
								fieldType={FormFieldType.select}
								control={form.control}
								name="select"
								array={select}
								label=""
								handleSelect={(value: string) => setValue(value)}
								placeholder="Filter Key"
								className="w-[250px]"
							/>
							<CustomFormField
								fieldType={FormFieldType.input}
								control={form.control}
								name="value"
								placeholder="Filter courses search"
								type="text"
								iconSrc={<MdTextFields />}
								className="w-full"
							/>
							<SubmitButton
								isLoading={isLoading}
								className="px-6 mx-auto flex justify-center bg-green-400 text-xs text-black rounded-lg font-inter font-bold"
							>
								Search
							</SubmitButton>
						</form>
					</Form>
					<button className="mr-4 text-gray-800 bg-gray-300 rounded-full p-2 cursor-pointer dark:bg-gray-600 dark:text-gray-400 lg:hidden">
						<FaMagnifyingGlass />
					</button>
					<Sheet>
						<SheetTrigger className="flex items-center font-inter text-xs font-semibold text-black p-2 rounded-md bg-gradient-to-l from-green-300 to-green-500 cursor-pointer duration-1000 hover:from-green-500 hover:to-green-300">
							Register Course <FaPlus className="text-black ml-2" />
						</SheetTrigger>
						<SheetContent className="overflow-y-auto scrollable-div">
							<SheetHeader>
								<SheetTitle className="font-inter font-bold">
									Register your course or add a new one
								</SheetTitle>
								<SheetDescription>
									<AddCourse />
								</SheetDescription>
							</SheetHeader>
						</SheetContent>
					</Sheet>
				</div>
			</div>
			<div>
				{isLoading ? (
					<div className="flex items-center justify-center p-8">
						<TableLoader />
					</div>
				) : (
					Array.isArray(data) &&
					!isLoading &&
					(!Array.isArray(filteredCourses) ? (
						<CourseList data={data} />
					) : (
						<CourseList data={filteredCourses} />
					))
				)}
			</div>
		</main>
	);
};

export default Courses;
