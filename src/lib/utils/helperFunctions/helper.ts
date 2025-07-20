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

	console.log(structuredData);
	return structuredData;
};

export const compareDatesForTasks = (tasks: any, date: any) => {
	console.log(new Date(date));
	console.log(new Date(tasks[0].startDate));
	const isSameDay = (d1: Date, d2: Date) => {
		const date1 = new Date(d1);
		const date2 = new Date(d2);

		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const filteredTasks = tasks.filter((task: any) => {
		return isSameDay(task.startDate, date); // both can be strings, no problem now
	});

	return filteredTasks;
};
