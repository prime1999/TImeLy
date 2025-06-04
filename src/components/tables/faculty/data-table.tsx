"use client";

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
// shadcn UI components
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

	return (
		<div className="w-full">
			<div className="w-full flex items-center py-4">
				<Input
					placeholder="Filter time..."
					value={(table.getColumn("time")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("time")?.setFilterValue(event.target.value)
					}
					className="w-[200px] font-inter text-sm font-semibold lg:w-[300px]"
				/>
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
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="border border-gray-500 text-center"
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
									{row.getVisibleCells().map((cell: any) => (
										<TableCell
											key={cell.id}
											className="border border-gray-800 p-2"
										>
											{Array.isArray(cell.getValue()) ? (
												<ul className="space-y-1">
													{cell
														.getValue()
														.map((course: string, index: number) => {
															// Check for a word in brackets
															const bracketMatch = course.match(/\([^)]+\)/);

															if (bracketMatch) {
																const main = course
																	.replace(bracketMatch[0], "")
																	.trim();
																const location = bracketMatch[0];

																return (
																	<li
																		key={index}
																		className="text-sm leading-snug"
																	>
																		<span>{main} </span>
																		<span className="text-green-600 font-semibold">
																			{location}
																		</span>
																	</li>
																);
															} else {
																// No bracket, check last word and if it's uppercase
																const words = course.trim().split(" ");
																const lastWord = words[words.length - 1];
																const isUpper =
																	lastWord === lastWord.toUpperCase();

																if (isUpper && words.length > 1) {
																	words.pop(); // remove last word
																	const main = words.join(" ");
																	return (
																		<li
																			key={index}
																			className="text-sm leading-snug"
																		>
																			<span>{main} </span>
																			<span className="text-green-500 font-inter font-bold">
																				{lastWord}
																			</span>
																		</li>
																	);
																} else {
																	return (
																		<li
																			key={index}
																			className="text-sm leading-snug"
																		>
																			<span>{course}</span>
																		</li>
																	);
																}
															}
														})}
												</ul>
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
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
