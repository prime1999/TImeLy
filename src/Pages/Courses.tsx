import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { FaPlus } from "react-icons/fa6";
import AddCourse from "@/components/forms/AddCourse";

const Courses = () => {
	return (
		<main className="w-11/12 mx-auto my-8">
			<h1 className="font-inter font-bold text-3xl">Courses</h1>
			<h4 className="mt-8 font-inter text-sm">
				Check, Add, update and remove your courses here for better App
				experience.
			</h4>
			<hr className="my-8" />
			<Sheet>
				<SheetTrigger className="flex items-center font-inter text-sm font-semibold cursor-pointer duration-700 group">
					Register Course{" "}
					<FaPlus className="text-green-400 ml-2 duration-700 group-hover:ml-4" />
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
		</main>
	);
};

export default Courses;
