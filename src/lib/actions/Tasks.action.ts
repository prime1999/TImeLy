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

// function to add the task to the apwrite DB
export const addTaskToAppwrite = async (taskData: any) => {
	try {
		console.log(taskData);
		// Get the current user
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return { msg: "User not Authorized" };
		// get the user relation
		const userRelation = await databases.listDocuments(DBID, USER_REALTION_ID, [
			Query.equal("student", user.$id),
		]);
		console.log(userRelation);
		// if the user relation was not found
		if (userRelation.total < 1) {
			console.log(here);
			// create one for the user
			const relation = await databases.createDocument(
				DBID,
				USER_REALTION_ID,
				ID.unique(),
				{
					student: user.$id,
				}
			);
			// once the relation is created, then
			// add the task to the DB
			const res = await addTaskToDB(taskData, relation.$id);
			return res;
		}
		// if the user relation was found, then
		// add the task to th relation directly
		const res = await addTaskToDB(taskData, userRelation.documents[0].$id);
		return res;
	} catch (error) {
		console.log(error);
	}
};

// function to handle the adding of th task tto the DB
export const addTaskToDB = async (data: any, relationId: any) => {
	try {
		console.log(relationId);
		// create the task in the DB
		const task = await databases.createDocument(DBID, TASKID, ID.unique(), {
			...data,
			userRelations: relationId,
			createdAt: new Date(),
		});
		console.log(task);
		// if th task was created, then update the user relation
		// Get the current relation document
		const relation = await databases.getDocument(
			DBID,
			USER_REALTION_ID,
			relationId
		);

		// Merge existing task IDs with the new one
		const existingTasks = relation.tasks ?? [];
		const updatedTasks = [...existingTasks, task.$id];

		// Update user relation document
		const updatedRelation = await databases.updateDocument(
			DBID,
			USER_REALTION_ID,
			relationId,
			{
				tasks: updatedTasks,
			}
		);

		console.log(updatedRelation);
		// if the relation was update, then
		return { msg: "done", data: task };
	} catch (error) {
		console.log(error);
	}
};
