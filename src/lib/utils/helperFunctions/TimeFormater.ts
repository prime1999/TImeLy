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
