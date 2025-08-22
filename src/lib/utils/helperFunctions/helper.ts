import {
	format,
	parseISO,
	parse,
	isBefore,
	isAfter,
	isWithinInterval,
	addMinutes,
	addDays,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const normalizeString = (value: any) => {
	return value.toLowerCase().replace(/\s+/g, "").trim();
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

// function to get te next course to notify the student

const daysMap: Record<string, number> = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
};

export const getNextClass = (courses: any) => {
	const now = new Date();
	let nextClass: any = null;

	for (const course of courses) {
		for (const sch of JSON.parse(course.schedule)) {
			// Parse the schedule into a Date
			const classDate = new Date(now);

			const targetDay = daysMap[sch.day.toLowerCase()];
			const todayDay = classDate.getDay();

			// find how many days ahead
			let dayDiff = targetDay - todayDay;
			// next week
			if (dayDiff < 0) dayDiff += 7;

			classDate.setDate(classDate.getDate() + dayDiff);

			// add the class start time
			const [time, modifier] = sch.startDate.split(" ");
			let [hours, minutes] = time.split(":").map(Number);

			if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
			if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

			classDate.setHours(hours, minutes, 0, 0);

			// check only classes within 7 days and in the future
			const diff = classDate.getTime() - now.getTime();
			if (diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000) {
				if (!nextClass || classDate < nextClass.date) {
					nextClass = { course, schedule: sch, date: classDate };
				}
			}
		}
	}

	return nextClass;
};

// fundtion to get the date info (day and time)
export const formatDateInfo = (data: Date): { time: string; day: string } => {
	const date = new Date(data);
	const now = new Date();

	// Format time in hh:mm AM/PM
	const time = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	// If the date is the same day as now
	const isSameDay =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	let day: string;

	if (isSameDay) {
		// If it's earlier today
		if (date.getTime() < now.getTime()) {
			day = "Today";
		} else {
			// Later today
			day = "Today";
		}
	} else {
		// Otherwise show the actual weekday
		day = date.toLocaleDateString("en-US", { weekday: "long" });
	}

	return { time, day };
};
