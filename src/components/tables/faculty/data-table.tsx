import { useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	VisibilityState,
	getCoreRowModel,
	useReactTable,
	getFilteredRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import TableLoader from "@/lib/utils/tableLoader";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnFilters,
			columnVisibility,
		},
	});

	const filterColumnId = table.getAllLeafColumns()[0]?.id ?? "";

	return (
		<div className="w-full">
			{/* Search Input */}
			<div className="w-full flex items-center py-4">
				<Input
					placeholder={`Filter by ${filterColumnId || "column"}...`}
					value={
						(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
					}
					className="w-[200px] font-inter text-sm font-semibold lg:w-[300px]"
				/>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="border-none">
						<button className="text-xs ml-auto py-2 px-4 rounded-lg border border-gray-500 font-inter font-semibold duration-500 cursor-pointer focus:border-green-500 focus:text-green-500 hover:border-green-500 hover:text-green-500 lg:text-lg">
							Filter days
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table Section */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="w-6">
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="w-6 border border-gray-500"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="border border-gray-800 text-xs leading-snug"
											style={{ width: cell.column.getSize() }}
										>
											{Array.isArray(cell.getValue())
												? (cell.getValue() as string[]).map((item, index) => (
														<div
															key={index}
															className="border-b border-gray-500 p-2 flex flex-col items-start"
														>
															{item}
														</div>
												  ))
												: flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
												  )}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<TableLoader />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
