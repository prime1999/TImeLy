export const normalizeString = (value: any) => {
	return value.toLowerCase().replace(/\s+/g, "").trim();
};
