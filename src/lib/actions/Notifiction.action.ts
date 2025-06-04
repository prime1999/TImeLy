import { Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import {
	DBID,
	STUDENTID,
	COURSES_ID,
	USER_COURSE_ID,
	COURSE_UPDATE_REQUEST_ID,
	NOTIFICATION_ID,
} from "@/contants/env.file";
import { getCurrentStudent } from "./Student.actions";

const databases = new Databases(client);

// function to send notification on appwrite
export const sendAppwriteNotification = async (payload: any) => {
	try {
		const newPayload = { ...payload };
		const notificationRes = await databases.createDocument(
			DBID,
			NOTIFICATION_ID,
			ID.unique(),
			newPayload
		);
	} catch (error) {
		console.log(error);
	}
};

// function to get the right user/admin for a notification
export const getUsersToBeNotified = async (curentUserId: string) => {
	try {
		const userRes = await getCurrentStudent(curentUserId);

		// get the list of users to get the notification
		const users = await databases.listDocuments(DBID, STUDENTID, [
			Query.equal("faculty", userRes?.faculty),
		]);
	} catch (error) {
		console.log(error);
	}
};
