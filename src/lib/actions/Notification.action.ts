import { Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import {
	DBID,
	STUDENTID,
	NOTIFICATION_ID,
	USER_REALTION_ID,
} from "@/contants/env.file";
import { checkCurrentSession, getCurrentStudent } from "./Student.actions";

// const account = new Account(client);

const databases = new Databases(client);

// function to send notification on appwrite
export const sendAppwriteNotification = async (payload: any) => {
	try {
		const newPayload = { ...payload };
		await databases.createDocument(
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
		await databases.listDocuments(DBID, STUDENTID, [
			Query.equal("faculty", userRes?.faculty),
		]);
	} catch (error) {
		console.log(error);
	}
};

// function to get the notifications for the current student
export const getAppwriteNotifications = async () => {
	try {
		// get the current user
		const user: any = await checkCurrentSession();
		if (!user) return "User not Authorized";
		// if the user is authorized
		// get the user relations (collection that hold the link to other collection except the course collection)
		const userRelations = await databases.listDocuments(
			DBID,
			USER_REALTION_ID,
			[Query.equal("student", user.$id)]
		);
		// if the user relations is empty
		if (userRelations.total < 1) return "Notifications box empty";

		// get the notifications
		const notifications: any[] = [];
		userRelations.documents.forEach((relation) => {
			relation.notifications.forEach((doc: any) => notifications.push(doc));
		});
		console.log(notifications);
		return notifications;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// function to mark a notification as read
export const appwriteMarkAsRead = async (notificationId: string) => {
	try {
		console.log(notificationId);
		// check if the notificationId exists
		const checkNotification = await databases.getDocument(
			DBID,
			NOTIFICATION_ID,
			notificationId
		);
		// if the notification does not exist then
		if (!checkNotification) {
			return "Notification does not exist";
		}
		// if it does
		// mark the notification as read
		const res = await databases.updateDocument(
			DBID,
			NOTIFICATION_ID,
			notificationId,
			{ isRead: true, updateAt: new Date() }
		);
		if (res) {
			return res;
		}
	} catch (error) {
		console.log(error);
	}
};
