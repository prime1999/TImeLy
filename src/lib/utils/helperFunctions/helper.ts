import { format, parseISO, parse, isBefore, isAfter } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const normalizeString = (value: any) => {
	return value.toLowerCase().replace(/\s+/g, "").trim();
};

export const reStructureUniversalTimetable = (data: any[]) => {
	if (!Array.isArray(data)) return [];

	const structuredData: any[] = [];
	let currentDay = "";
	let headerRow: any[] = [];
	let timeSlots: string[] = [];

	data.forEach((row: any) => {
		if (
			!Array.isArray(row) ||
			row.every((cell) => cell === null || cell === "")
		) {
			return; // Skip empty rows
		}

		// Detect header row (contains 'DAY' and 'VENUE')
		if (
			row.some(
				(cell) => typeof cell === "string" && cell.toLowerCase().includes("day")
			)
		) {
			headerRow = row;
			timeSlots = row.slice(2).map((slot: string) => slot?.trim()); // times start from index 2
			return;
		}

		// Detect new day row
		if (row[0] && row[0].toString().trim() !== "") {
			currentDay = row[0].trim();

			structuredData.push({
				day: currentDay,
				slots: [],
			});
		}

		// Add venue and courses to current day
		if (currentDay && structuredData.length) {
			const venue = row[1]?.trim();
			const dayEntry = structuredData.find((entry) => entry.day === currentDay);

			if (venue && dayEntry) {
				const courses = [];

				for (let i = 2; i < row.length; i++) {
					const courseName = row[i]?.trim();
					if (courseName) {
						courses.push({
							time: timeSlots[i - 2], // Times start from index 2
							course: courseName,
						});
					}
				}

				dayEntry.slots.push({
					venue,
					courses,
				});
			}
		}
	});

	return structuredData;
};

// functio to compare tasks date for task filtering by date
export const compareDatesForTasks = (tasks: any, date: any) => {
	const isSameDay = (d1: any, d2: Date) => {
		const date1 = formatInTimeZone(d1, "UTC", "yyyy-MM-dd");
		const date2 = format(d2, "yyyy-MM-dd");

		return date1 === date2;
	};

	const filteredTasks = tasks.filter((task: any) => {
		return isSameDay(task.startDate, date);
	});

	return filteredTasks;
};

// helper function to get the number of tasks for each status (Pending, InProress, done)
export const getStatusTasksLength = (tasks: any, status: string) => {
	const statusTasks =
		tasks && tasks.filter((task: any) => task.status === status);
	return statusTasks && statusTasks.length;
};

// function to get the classes which schedules clashes
export const findTimeClashes = (courses: any) => {
	const clashes = [];

	for (let i = 0; i < courses.length; i++) {
		const courseA = courses[i];

		for (const schedA of courseA.schedule) {
			const startA = parse(schedA.startDate, "hh:mm a", new Date());
			const endA = parse(schedA.endDate, "hh:mm a", new Date());

			for (let j = i + 1; j < courses.length; j++) {
				const courseB = courses[j];

				for (const schedB of courseB.schedule) {
					if (schedA.day !== schedB.day) continue;

					const startB = parse(schedB.startDate, "hh:mm a", new Date());
					const endB = parse(schedB.endDate, "hh:mm a", new Date());

					const overlap = isBefore(startB, endA) && isAfter(endB, startA);
					console.log({ overlap, courseA, courseB });

					if (overlap) {
						clashes.push({
							courses: [courseA, courseB],
							day: schedA.day,
							timeA: schedA,
							timeB: schedB,
						});
					}
				}
			}
		}
	}

	return clashes;
};
