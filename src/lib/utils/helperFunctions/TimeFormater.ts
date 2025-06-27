import { parse, differenceInMinutes } from "date-fns";
import { formatDistanceToNow } from "date-fns";

export const formatScheduleTime = (date: Date) => {
	console.log(date);
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	// Convert to 12-hour format
	hours = hours % 12 || 12;

	// Add leading zeros
	const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

	return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// function to get the duration of the class
export const getDuration = (classStart: string, classEnd: string) => {
	// Example input
	const timeInput = `${classStart} - ${classEnd}`;

	// Step 1: Split the input
	const [startTime, endTime] = timeInput.split("-");

	// Step 2: Parse using the correct format 'hh:mm a'
	const today = new Date();
	const start = parse(startTime.trim(), "hh:mm a", today);
	const end = parse(endTime.trim(), "hh:mm a", today);

	// Step 3: Calculate duration in minutes
	let duration = differenceInMinutes(end, start);

	// Step 4: Handle overnight case (if time crosses midnight)
	if (duration < 0) {
		duration += 24 * 60; // Add 24 hours
	}
	return `${duration} mins`;
};

// functionto get the name of the day
export const getToday = () => {
	const today = new Date();
	const options: any = { weekday: "long" };
	const dayName = today.toLocaleDateString("en-US", options);

	return dayName;
};

export const timeAgo = (date: string) => {
	const duration = formatDistanceToNow(new Date(date), { addSuffix: true });
	return duration;
};
