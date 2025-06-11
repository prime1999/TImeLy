import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import AddCourse from "@/components/forms/AddCourse";
import { Input } from "@/components/ui/input";
import CourseList from "@/components/CourseList";

const Courses = () => {
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
					<Input
						type="text"
						placeholder="Search..."
						className="max-w-[300px] text-xs hidden lg:block"
					/>{" "}
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
				<CourseList />
			</div>
		</main>
	);
};

export default Courses;
