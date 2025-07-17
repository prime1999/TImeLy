import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { formatDateRange } from "little-date";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CreatetaskModal from "./modals/CreatetaskModal";
const events = [
	{
		title: "Team Sync Meeting",
		status: "pending",
		createdAt: "2025-06-12T09:00:00",
		from: "2025-07-12T09:00:00",
		to: "2025-07-14T10:00:00",
	},
	{
		title: "Design Review",
		status: "done",
		createdAt: "2025-06-12T09:00:00",
		from: "2025-07-12T09:00:00",
		to: "2025-07-14T10:00:00",
	},
	{
		title: "Client Presentation",
		notes: "",
		status: "inProgress",
		createdAt: "2025-06-12T09:00:00",
		from: "2025-07-12T09:00:00",
		to: "2025-07-14T10:00:00",
	},
];

const CalendarWithNotes = () => {
	// state to handle the create task modal
	const [open, setOpen] = useState<boolean>(true);
	const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));
	return (
		<>
			{" "}
			<Card className="w-fit py-4">
				<CardContent className="px-4">
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						className="bg-transparent p-0"
						required
					/>
				</CardContent>
				<CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
					<div className="flex w-full items-center justify-between px-1 font-inter">
						<div className="text-sm font-medium">
							{date?.toLocaleDateString("en-US", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</div>
						<button onClick={() => setOpen(true)}>
							<FaPlus className="cursor-pointer" />
							<span className="sr-only">Add Event</span>
						</button>
					</div>
					<div className="flex w-full flex-col gap-2">
						{events.map((event) => (
							<div
								key={event.title}
								className={`bg-muted ${
									event.status === "done"
										? "after:bg-green-500"
										: event.status === "inProgress"
										? "after:bg-yellow-500"
										: "after:bg-red-500"
								} relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full dark: dark:bg-[rgb(255,255,255,0.05)]`}
							>
								<div className="font-medium">{event.title}</div>
								<div className="text-muted-foreground text-xs">
									{formatDateRange(new Date(event.from), new Date(event.to))}
								</div>
							</div>
						))}
					</div>
				</CardFooter>
			</Card>
			<CreatetaskModal open={open} setOpen={setOpen} />
		</>
	);
};

export default CalendarWithNotes;
