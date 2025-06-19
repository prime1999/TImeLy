const FindCourses = ({ handleFindCourse }: any) => {
	return (
		<main className="flex flex-col gap-4 items-center justify-center font-inter p-2">
			<h4>
				Find courses that other students of the same department and level are
				registered for to get there timetables
			</h4>
			<button
				onClick={() => handleFindCourse()}
				className="w-24 text-sm font-semibold p-2 rounded-md bg-green-500 cursor-pointer duration-700 hover:bg-green-600"
			>
				Find
			</button>
		</main>
	);
};

export default FindCourses;
