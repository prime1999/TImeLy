import { ColumnDef } from "@tanstack/react-table";

export function generateDynamicColumns<T extends Record<string, any>>(
	headers: string[]
): ColumnDef<T>[] {
	return headers?.map((header) => {
		if (header.toLowerCase() === "time") {
			return {
				accessorKey: header,
				header: header.charAt(0).toUpperCase() + header.slice(1),
			} as ColumnDef<T>;
		}

		return {
			accessorKey: header,
			header: header.charAt(0).toUpperCase() + header.slice(1),
		} as ColumnDef<T>;
	});
}
