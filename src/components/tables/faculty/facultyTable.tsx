import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { TimeTable } from "@/contants/Timetable";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getFacultyTable } from "@/lib/slice/StudentSlice";

const FacultyTable = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [table, setTable] = useState<any>([]);

	useEffect(() => {
		const getTableData = async () => {
			try {
				// call the dispatch function to get the faculty time-table details form the DB
				const res: any = await dispatch(getFacultyTable()).unwrap();
				// get the stringified table form the DB and parse it to an array
				const table = JSON.parse(JSON.parse(res.documents[0].table));
				// set the table data
				const data = table.map((slot: any) => ({
					time: slot.time,
					Monday: slot.Monday,
					Tuesday: slot.Tuesday,
					Wednesday: slot.Wednesday,
					Thursday: slot.Thursday,
					Friday: slot.Friday,
				}));

				setTable(data);
			} catch (error) {
				console.log(error);
			}
		};
		getTableData();
	}, []);
	return (
		<main className="pb-8">
			<DataTable columns={columns} data={table} />
		</main>
	);
};

export default FacultyTable;
