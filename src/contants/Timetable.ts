export const TimeTable = {
	type: "faculty",
	part: "science",
	table: [
		{
			time: "12-1pm",
			Monday: [{ venue: "FLT", courses: ["C-UI-BOT 102T - 30%"] }],
			Tuesday: [{ venue: "CBN", courses: ["C-UI-PHY 103 (30%)"] }],
			Wednesday: [
				{ venue: "FFL", courses: ["C-CHM 107A - 70% "] },

				{ venue: "FFL", courses: ["C-CHM 107B - 70% "] },

				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },

				{ venue: "(C7 & C8)", courses: ["C-BIO 107P - 70%"] },
			],
			Thursday: [
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },

				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },

				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },

				{ venue: "FLT", courses: ["C-UI-MCB 123 - 30%"] },
			],
			Friday: [
				{ venue: "LLT", courses: ["GEO 111"] },

				{ venue: "(C7 & C8)", courses: ["C-BIO 107P - 70%"] },

				{ venue: "...", courses: ["C-PHY 107 - 70%"] },

				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },

				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
			],
		},
		{
			time: "1-2pm",
			Monday: [
				{ venue: "FLT", courses: ["ARC 111"] },
				{ venue: "CBN", courses: ["C-COS 101 - 70%"] },
			],
			Tuesday: [
				{ venue: "LLT", courses: ["GEO 111"] },
				{ venue: "NFLT", courses: ["C-STA 111/114 - 70%"] },
			],
			Wednesday: [{ venue: "NFLT", courses: ["C-UI-ZOO 103 - 30% (NFLT)"] }],
			Thursday: [
				{ venue: "NFLT", courses: ["C-STA 112/115 - 70%"] },
				{ venue: "CBN", courses: ["C-UI-ZOO 103 - 30%"] },
			],
			Friday: [{ venue: "...", courses: "JUMAT" }],
		},
		{
			time: "2-3pm",
			Monday: [
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },
			],
			Tuesday: [
				{ venue: "LAB A1", courses: ["C-UI-MCB 121"] },
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
			],
			Wednesday: [
				"C-CHM 107A - 70% (FFL)",
				"C-CHM 107B - 70% (FFL)",
				"C-PHY 107 - 70%",
			],
			Thursday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "NFLT", courses: ["C-STA 111/114 - 70%"] },
				{ venue: "CBN", courses: ["C-BIO 101 - 70%"] },
			],
			Friday: [
				{ venue: "LLT", courses: ["GEO 111"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "...", courses: ["C-PHY 107 - 70%"] },
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
			],
		},
		{
			time: "3-4pm",
			Monday: [
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },
			],
			Tuesday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "LAB A1", courses: ["C-UI-MCB 121"] },
			],
			Wednesday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },
			],
			Thursday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },
			],
			Friday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L", courses: ["C-PHY 107 - 70%"] },
			],
		},
		{
			time: "4-5pm",
			Monday: [
				{ venue: "CBN", courses: ["ANT 115"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L LAB", courses: ["C-PHY 107 - 70%"] },
			],
			Tuesday: [{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] }],
			Wednesday: [
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L LAB", courses: ["C-PHY 107 - 70%"] },
			],
			Thursday: [
				{ venue: "C7 & C8", courses: ["C-BIO 107P - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107A - 70%"] },
				{ venue: "FFL", courses: ["C-CHM 107B - 70%"] },
				{ venue: "100L LAB", courses: ["C-PHY 107 - 70%"] },
			],
			Friday: [
				{ venue: "SLT", courses: ["STA 122"] },
				{ venue: "FLT", courses: ["C-UI-MCB 121"] },
			],
		},
		{
			time: "5-6pm",
			Monday: [{ venue: "CBN", courses: ["ANT 115"] }],
			Tuesday: [{ venue: "FLT", courses: ["C-GST"] }],
			Wednesday: [{ venue: "CBN", courses: ["C-GST"] }],
			Thursday: [{ venue: "CBN", courses: ["C-GST"] }],
			Friday: [
				"C-GST (CBN)",
				"C-STA 122 - 70% SLT",
				"C-UI-BOT 111/102P - 30% (LAB A1)",
			],
		},
		{
			time: "6-7pm",
			Monday: ["C-STA 111/114 - 70% NFLT"],
			Tuesday: ["C-STA 112/115 - 70% NFLT"],
			Wednesday: ["C-UI-MCB 123 (LAB A8)"],
			Thursday: [],
			Friday: [],
		},
	],
};

export const text = {
	time: "8-9am",
	Monday: [
		{ venue: "CBN", courses: ["C-PHY 101 - 70%"] },
		{ venue: "NLT", courses: ["CHE 256 (C)"] },
		{ venue: "CBN", courses: ["CHE 275"] },
	],
	Tuesday: [
		{ venue: "...", courses: ["C-UI-BOT 111 - 30%"] },
		{ venue: "...", courses: ["GEY 101"] },
		{ venue: "...", courses: ["ARC 211"] },
		{ venue: "...", courses: ["CSC 242P"] },
		{ venue: "NLT", courses: ["ICH 266 (R)"] },
		{ venue: "MLT", courses: ["MAT 251"] },
		{ venue: "D11", courses: ["BIO 311"] },
		{ venue: "A9", courses: ["CHE 318"] },
		{ venue: "A5", courses: ["PHY 315"] },
		{ venue: "C", courses: ["CSC 351"] },
		{ venue: "036", courses: ["GEO 385"] },
		{ venue: "...", courses: ["GEY 324"] },
		{ venue: "NFLT", courses: ["MAT 341 (R)"] },
		{ venue: "023", courses: ["STA 342 (R)"] },
		{ venue: "C15", courses: ["CHE 477 (R)"] },
		{ venue: "LAB A8", courses: ["MCB 407 (R)"] },
		{ venue: "B1", courses: ["PHY 410"] },
		{ venue: "FYL", courses: ["MCB 405"] },
		{ venue: "...", courses: ["MAT 406"] },
		{ venue: "...", courses: ["CSC 551"] },
	],
	Wednesday: [
		{ venue: "FLT", courses: ["C-UI-BOT 102 T - 30%"] },
		{ venue: "CBN", courses: ["C-UI-PHY 103 - 30%"] },
		{ venue: "...", courses: ["C-UI-COS 103 - 30%"] },
		{ venue: "NLT", courses: ["CHE 256 (C)"] },
		{ venue: "AA", courses: ["CHE 275 (R)"] },
		{ venue: "200L LAB", courses: ["PHY 203"] },
		{ venue: "LLT", courses: ["GEO 211"] },
		{ venue: "...", courses: ["GEY 222"] },
		{ venue: "NFLT", courses: ["MAT 213"] },
		{ venue: "ARC 311", courses: [] },
		{ venue: "A9", courses: ["CHE 325 (R)"] },
		{ venue: "A5", courses: ["PHY 304"] },
		{ venue: "LT", courses: ["MAT 341"] },
		{ venue: "LAB A8", courses: ["MCB 324"] },
		{ venue: "124", courses: ["STA 311/317"] },
		{ venue: "...", courses: ["GEY 398"] },
		{ venue: "H003", courses: ["CHE 351"] },
		{ venue: "D11", courses: ["BIO 417 (C)"] },
		{ venue: "C15", courses: ["CHE 458"] },
		{ venue: "R", courses: ["CSC 412"] },
		{ venue: "036", courses: ["GEO 416 (R)"] },
		{ venue: "019", courses: ["GEY 412 (R)"] },
		{ venue: "...", courses: ["GEY 462"] },
		{ venue: "FYL", courses: ["MCB 405"] },
		{ venue: "R023", courses: ["STA 454 (R)"] },
		{ venue: "R222", courses: ["MAT 403 (R)"] },
	],

	Thursday: [
		{ venue: "CBN", courses: ["C-COS 101 - 70%"] },
		{ venue: "ZLT", courses: ["BIO 216 (T)"] },
		{ venue: "...", courses: ["GEY 285"] },
		{ venue: "SLT", courses: ["STA 211"] },
		{ venue: "NLT", courses: ["CHE 281"] },
		{ venue: "ARC 311", courses: [] },
		{ venue: "D1", courses: ["BIO 317 (T)"] },
		{ venue: "BL11", courses: ["BOT 351 (R)"] },
		{ venue: "NLT", courses: ["CHE 318 (E)"] },
		{ venue: "R", courses: ["CSC 351"] },
		{ venue: "A5", courses: ["PHY 310 (R)"] },
		{ venue: "R023", courses: ["STA 331 (R)"] },
		{ venue: "LAB A8", courses: ["MCB 324"] },
		{ venue: "FYL", courses: ["BOT 431"] },
		{ venue: "C15", courses: ["CHE 477 (R)"] },
		{ venue: "036", courses: ["GEO 435"] },
		{ venue: "125", courses: ["GEY 437T (R)"] },
		{ venue: "D11", courses: ["ZOO 415"] },
		{ venue: "BLT", courses: ["MCB 482"] },
	],

	Friday: [
		{ venue: "CBN", courses: ["C-BIO 101 - 70%"] },
		{ venue: "FLT", courses: ["C-UI-COS 103 - 30%"] },
		{ venue: "...", courses: ["GEY 101 (C)"] },
	],
};
