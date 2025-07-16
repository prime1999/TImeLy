import { Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import {
	DBID,
	COURSES_ID,
	USER_COURSE_ID,
	COURSE_UPDATE_REQUEST_ID,
	NOTIFICATION_ID,
	USER_REALTION_ID,
	STUDENTID,
	TASKID,
} from "@/contants/env.file";
import { checkCurrentSession } from "./Student.actions";

const databases = new Databases(client);

// function to get the user's tasks from te DB
export const getTasksFromDB = async () => {
	try {
		// Get the current user
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return { msg: "User not Authorized" };
		// get te relations that belongs to the current user
		const userRelations = await databases.listDocuments(
			DBID,
			USER_REALTION_ID,
			[Query.equal("userId", user.$id)]
		);
		// if user is yet to have a relation
		if (userRelations.total < 1) return { msg: "Tasks empty" };
		// if the user has a relation, check each one of them and filter the one that as a tasks relation
		const relationWithTasks = userRelations.documents.filter(
			(doc: any) => doc.tasks
		);
		// if the tasks relation does not exist
		if (relationWithTasks.length === 0) return { msg: "Tasks empty" };
		// if the tasks relation exists, then
		let tasks = await Promise.all(
			relationWithTasks.map(async (relation) => {
				try {
					let list = await databases.getDocument(DBID, TASKID, relation.tasks);
					return list?.$id ? list : null;
				} catch (error) {
					console.error("Error fetching course:", error);
					return null;
				}
			})
		);
		// Remove any nulls (failed fetches)
		tasks = tasks.filter((task) => task !== null);
		return { tasks };
	} catch (error) {
		console.log(error);
	}
};
