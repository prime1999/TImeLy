"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Table = {
	time: string;
	Monday: string[];
	Tuesday: string[];
	Wednesday: string[];
	Thursday: string[];
	Friday: string[];
};

export const columns: ColumnDef<Table>[] = [
	{
		accessorKey: "time",
		header: "Time",
	},
	{
		accessorKey: "Monday",
		header: "Monday",
		cell: ({ row }) => (
			<ul className="pl-4 space-y-1 list-none">
				{row.original.Monday.map((course, idx) => (
					<li key={idx} className="text-sm leading-tight">
						{course}
					</li>
				))}
			</ul>
		),
	},
	{
		accessorKey: "Tuesday",
		header: "Tuesday",
		cell: ({ row }) => (
			<ul className="pl-4 space-y-1 list-none">
				{row.original.Tuesday.map((course, idx) => (
					<li key={idx} className="text-sm leading-tight">
						{course}
					</li>
				))}
			</ul>
		),
	},
	{
		accessorKey: "Wednesday",
		header: "Wednesday",
		cell: ({ row }) => (
			<ul className="pl-4 space-y-1 list-none">
				{row.original.Wednesday.map((course, idx) => (
					<li key={idx} className="text-sm leading-tight">
						{course}
					</li>
				))}
			</ul>
		),
	},
	{
		accessorKey: "Thursday",
		header: "Thursday",
		cell: ({ row }) => (
			<ul className="pl-4 space-y-1 list-none">
				{row.original.Thursday.map((course, idx) => (
					<li key={idx} className="text-sm leading-tight">
						{course}
					</li>
				))}
			</ul>
		),
	},
	{
		accessorKey: "Friday",
		header: "Friday",
		cell: ({ row }) => (
			<ul className="pl-4 space-y-1 list-none">
				{row.original.Friday.map((course, idx) => (
					<li key={idx} className="text-sm leading-tight">
						{course !== "" ? course : "free"}
					</li>
				))}
			</ul>
		),
	},
];
