import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { DataTable } from "./data-table";
import { generateDynamicColumns } from "./columns";
import { getFacultyTable } from "@/lib/slice/StudentSlice";
import { reStructureTableData } from "@/lib/utils/helperFunctions/helper";

const FacultyTable = () => {
	const [columns, setColumns] = useState<any[]>([]); // Start as empty array
	const dispatch = useDispatch<AppDispatch>();
	const [table, setTable] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true); // Track loading state

	useEffect(() => {
		const getTableData = async () => {
			try {
				const res: any = await dispatch(getFacultyTable()).unwrap();
				const data = JSON.parse(JSON.parse(res.documents[0].table));
				const structuredData = reStructureTableData(data);

				setTable(structuredData);

				const headers = Object.keys(structuredData[0]);
				const dynamicColumns = generateDynamicColumns(headers);
				setColumns(dynamicColumns);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false); // Done loading
			}
		};

		getTableData();
	}, []);

	if (isLoading) {
		return <div>Loading table...</div>;
	}

	if (!columns.length || !table.length) {
		return <div>No timetable data available</div>;
	}

	return (
		<main className="pb-8">
			<DataTable columns={columns} data={table} />
		</main>
	);
};

export default FacultyTable;
