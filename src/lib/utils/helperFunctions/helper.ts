export const normalizeString = (value: any) => {
	return value.toLowerCase().replace(/\s+/g, "").trim();
};

export const reStructureTableData = (data: any) => {
	console.log(data);
	// Assume rawData is your provided dataset

	// Step 1: Find the first non-empty row as header
	const headerRow = data.find(
		(row: any) =>
			Array.isArray(row) && row.some((cell) => cell !== null && cell !== "")
	);
	console.log(headerRow);

	// Step 2: Filter out the header row and any row that repeats the header
	const cleanedData = data.filter((row: any) => {
		// Skip the header and any duplicate of the header
		if (!Array.isArray(row) || row.length === 0) return false; // skip empty arrays
		if (JSON.stringify(row) === JSON.stringify(headerRow)) return false; // skip header duplicates
		return row.some((cell) => cell !== null && cell !== ""); // keep non-empty rows
	});
	console.log(cleanedData);

	// Step 3: Structure the data
	const structuredData = cleanedData.map((row: any) => {
		const rowData: any = {};
		headerRow.forEach((header: any, index: number) => {
			rowData[header?.toString().toLowerCase() || `column${index}`] =
				row[index] ?? "";
		});
		return rowData;
	});
	console.log(structuredData);
	return structuredData;
};
