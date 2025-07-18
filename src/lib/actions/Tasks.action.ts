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
import { normalizeString } from "../utils/helperFunctions/helper";

const databases = new Databases(client);

// function to get the user's tasks from te DB
export const getTasksFromDB = async () => {
	try {
		// Get the current user
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return { msg: "User not Authorized" };
		// get the relations that belongs to the current user
		const userRelations = await databases.listDocuments(
			DBID,
			USER_REALTION_ID,
			[Query.equal("student", user.$id)]
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
		let tasks: any = await Promise.all(
			relationWithTasks.map(async (relation) => {
				try {
					if (!Array.isArray(relation.tasks)) return [];

					const taskDocs = await Promise.all(
						relation.tasks.map(async (task) => {
							try {
								const gottenTask = await databases.getDocument(
									DBID,
									TASKID,
									task.$id
								);
								return gottenTask?.$id ? gottenTask : null;
							} catch (error) {
								console.error("Error fetching task:", error);
								return null;
							}
						})
					);

					return taskDocs.filter(Boolean); // Remove nulls
				} catch (error) {
					console.error("Error in relation:", error);
					return [];
				}
			})
		);
		// Flatten the nested array (array of arrays) to a single array of task objects
		tasks = tasks.flat();
		// Remove any nulls (failed fetches)
		tasks = tasks.filter((task: any) => task !== null);
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
			console.log("here");
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
		return { msg: "Task added", data: task };
	} catch (error) {
		console.log(error);
	}
};

// function to update a task in the DB
export const updateTaskInDB = async (updateData: any) => {
	try {
		// compare the task with the one in the DB
		const compareResult = await compareTask(updateData);
		// if the task data was not updated
		if (compareResult?.exists !== true) return { msg: "No update Required" };
		// if the task data was updated, then proceed to update the task in the DB
		// update the task in appwrite
		const updatedTask = await databases.updateDocument(
			DBID,
			TASKID,
			updateData.$id,
			compareResult?.payload
		);
		if (!updatedTask.$id) return { msg: "Document not updated" };
		// if the document was updated
		return { msg: "Document updated Successfully" };
	} catch (error) {
		console.log(error);
	}
};

// function to compare tasks
export const compareTask = async (taskData: any) => {
	try {
		// get the exiting document from the DB
		const existingTask = await databases.getDocument(
			DBID,
			TASKID,
			taskData.$id
		);
		console.log({ existingTask, taskData });
		// if the document exists
		if (existingTask && existingTask.$id) {
			// create an empty object where the user will store the data to update
			const updatePayload: { [key: string]: any } = {};
			// start checking each field for the data to update and add the data to the empty object created
			if (
				taskData.CourseTitle &&
				normalizeString(taskData.title) !== normalizeString(existingTask.title)
			)
				updatePayload.title = taskData.title;

			if (
				taskData.body &&
				normalizeString(taskData.body) !== normalizeString(existingTask.body)
			)
				updatePayload.body = taskData.body;

			if (taskData.status && taskData.status.toString() !== existingTask.status)
				updatePayload.status = taskData.status;

			if (taskData.startDate && taskData.startDate !== existingTask.startDate)
				updatePayload.startDate = taskData.startDate;

			if (taskData.endDate && taskData.endDate !== existingTask.endDate)
				updatePayload.endDate = taskData.endDate;

			if (Object.keys(updatePayload).length > 0) {
				return {
					exists: true,
					payload: updatePayload,
				};
			}
		}
		return {
			exists: false,
		};
	} catch (error) {
		console.log(error);
	}
};

// function to delete a task in the DB
export const deleteTaskInDB = async (taskId: string) => {
	try {
		// delete the task from appwrite
		const res = await databases.deleteDocument(DBID, TASKID, taskId);
		return res;
	} catch (error) {
		console.log(error);
	}
};
