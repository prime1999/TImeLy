import { ColumnDef } from "@tanstack/react-table";

export const generateDynamicColumns = (headers: string[]) => {
	return headers.map((header) => {
		if (header.toLowerCase() === "time") {
			return {
				accessorKey: header.toLowerCase(),
				header: header.charAt(0).toUpperCase() + header.slice(1),
			} as ColumnDef<any>;
		}

		return {
			accessorKey: header.toLowerCase(),
			header: header.charAt(0).toUpperCase() + header.slice(1),
			cell: ({ row }) => (
				<ul className="pl-4 space-y-1 list-none">
					{row.original[header.toLowerCase()]?.map(
						(course: string, idx: number) => (
							<li key={idx} className="text-sm leading-tight">
								{course}
							</li>
						)
					)}
				</ul>
			),
		} as ColumnDef<any>;
	});
};
