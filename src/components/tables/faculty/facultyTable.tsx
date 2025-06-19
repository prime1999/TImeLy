import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFacultyTable } from "@/lib/slice/StudentSlice";
import { AppDispatch } from "@/lib/store";
import { reStructureUniversalTimetable } from "@/lib/utils/helperFunctions/helper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FacultyTable = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [table, setTable] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const getTableData = async () => {
			try {
				const res: any = await dispatch(getFacultyTable()).unwrap();

				if (!res.documents || !res.documents.length) {
					console.error("No documents found.");
					setIsLoading(false);
					return;
				}

				const rawTable = res.documents[0]?.table;
				let data;

				try {
					data = JSON.parse(JSON.parse(rawTable)); // Try double parse first
				} catch {
					try {
						data = JSON.parse(rawTable); // Try single parse
					} catch (error) {
						console.error("Error parsing timetable data.", error);
						setIsLoading(false);
						return;
					}
				}

				const structuredData = reStructureUniversalTimetable(data);
				setTable(structuredData);
			} catch (error) {
				console.error("Error fetching timetable: ", error);
			} finally {
				setIsLoading(false);
			}
		};

		getTableData();
	}, [dispatch]);

	if (isLoading) {
		return <p className="text-center my-10">Loading timetable...</p>;
	}

	if (!table.length) {
		return <p className="text-center my-10">No timetable data available.</p>;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{table.map((dayEntry: any, idx: number) => (
				<Card key={idx} className="bg-white dark:bg-gray-800 shadow-lg p-4">
					<CardHeader>
						<CardTitle className="text-green-600">{dayEntry.day}</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						{dayEntry.slots.map((slot: any, slotIdx: number) => (
							<div key={slotIdx} className="mb-4">
								<h4 className="capitalize font-semibold text-gray-700 dark:text-gray-300 mb-1">
									Venue: {slot.venue}
								</h4>

								<ul className="list-disc list-inside space-y-1">
									{slot.courses.length ? (
										slot.courses.map((course: any, courseIdx: number) => (
											<li
												key={courseIdx}
												className="text-sm text-gray-600 dark:text-gray-400"
											>
												<span className="font-semibold text-green-500">
													{course.time}:
												</span>{" "}
												{course.course}
											</li>
										))
									) : (
										<li className="text-sm italic text-gray-400">Free</li>
									)}
								</ul>
							</div>
						))}
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default FacultyTable;
