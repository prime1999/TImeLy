import { Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import { DBID, STUDENTID, TIME_TABLE_ID } from "@/contants/env.file";
import { checkCurrentSession } from "./Student.actions";

const databases = new Databases(client);

// Appwrite function to check the time-table in the DB
export const checkAppriteTimeTable = async (type: string) => {
	try {
		// get the current user
		const user: any = await checkCurrentSession();
		if (!user) return "User not Authorized";
		// get the user's doc
		const student = await databases.getDocument(DBID, STUDENTID, user.$id);
		// check the DB for timetables based on the users faculty
		const res = await databases.listDocuments(DBID, TIME_TABLE_ID, [
			Query.equal("type", type),
			Query.equal(
				"part",
				type === "faculty" ? student.faculty : student.department
			),
		]);
		return res;
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function to create a new faculty timeTable in the DB
export const createAppwritTimeTable = async (data: string) => {
	try {
		// get the current user
		const user: any = await checkCurrentSession();
		if (!user) return "User not Authorized";
		// get the user's doc
		const student = await databases.getDocument(DBID, STUDENTID, user.$id);
		const dataToSent = {
			type: "faculty",
			part: student.faculty,
			level: student.level,
			uploadedBy: user.$id,
			table: data,
		};
		// create the timetable for the faculty
		const res = await databases.createDocument(
			DBID,
			TIME_TABLE_ID,
			ID.unique(),
			dataToSent
		);
		if (res) return res;
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function to update a time table doc in the DB
export const updateAppwriteTimeTable = async (data: any) => {
	try {
		// get the current user
		const user: any = await checkCurrentSession();
		if (!user) return "User not Authorized";
		// get the user's doc
		const student = await databases.getDocument(DBID, STUDENTID, user.$id);
		// get the timetable's doc
		const timetable = await databases.listDocuments(DBID, TIME_TABLE_ID, [
			Query.equal("type", data.type === "faculty" ? "faculty" : "department"),
			Query.equal("part", student.faculty),
			Query.equal("level", student.level),
		]);
		if (timetable && timetable.total < 1) return "No document found";
		// create the timetable for the faculty
		const res = await databases.updateDocument(
			DBID,
			TIME_TABLE_ID,
			timetable.documents[0].$id,
			{
				table: JSON.stringify(data.payload),
			}
		);
		if (res) return res;
	} catch (error) {
		console.log(error);
	}
};
