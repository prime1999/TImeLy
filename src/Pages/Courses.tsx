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
			<h4 className="mt-8 font-inter">
				Check, Add, update and remove your courses here for better App
				experience.
			</h4>
			<Sheet>
				<SheetTrigger>
					Register Course <FaPlus />
				</SheetTrigger>
				<SheetContent className="overflow-y-auto scrollable-div">
					<SheetHeader>
						<SheetTitle>Are you absolutely sure?</SheetTitle>
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
