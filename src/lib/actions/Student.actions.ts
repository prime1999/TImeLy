import { Account, Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import { DBID, STUDENTID, TIME_TABLE_ID } from "@/contants/env.file";

const account = new Account(client);

const databases = new Databases(client);

// appwrite function to add a user to appwrite auth
export const createAppwriteUser = async (userData: any) => {
	try {
		// create a user auth on Appwrite
		const user = await account.create(
			ID.unique(),
			userData.email,
			userData.password
		);
		if (user) {
			// create a session for the user
			await createuserAppwriteSession(userData);
			// create the user document in the DB
			const session: any = await checkCurrentSession();
			// if a session exist
			if (session && session.$id) {
				const userDoc = await createAppwriteuserDocument({
					userId: session.$id,
					MatricNumber: userData.MatricNumber.toString(),
					Email: userData.email,
				});
				return userDoc;
			}
		}
	} catch (error: any) {
		// check if the error is a user already exist error
		if (error && error.code === 409) {
			console.log(error);
			return { error: "User already exists" };
		}
		// else if any other error
		console.log(error);
		return { error: "An error occurred when creating user, please try again" };
	}
};

// function to create a session for a created user on Appwrite
export const createuserAppwriteSession = async (userdata: any) => {
	try {
		console.log(userdata);
		// create a session using the email ans password
		const res = await account.createEmailPasswordSession(
			userdata.email,
			userdata.password
		);
		return res;
	} catch (error) {
		console.log(error);
	}
};

// function to create the user document in appwrite collection
export const createAppwriteuserDocument = async (userDocData: any) => {
	try {
		console.log(JSON.stringify({ ...userDocData }));
		// create the document for the student created with the (email & matric-number)
		const userDoc = await databases.createDocument(
			DBID,
			STUDENTID,
			userDocData.userId,
			{
				Email: userDocData.Email,
				MatricNumber: userDocData.MatricNumber,
			}
		);
		console.log("created");

		return userDoc;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// function to get a student based on the id from the appwrite collection
export const getCurrentStudent = async (userID: string) => {
	try {
		const res = await checkCurrentSession();
		if (res && res.$id) {
			// get the student from the DB
			const currentStudent = await databases.getDocument(
				DBID,
				STUDENTID,
				userID
			);
			return currentStudent;
		}
		console.log(res);
		return null;
	} catch (error) {
		console.log(error);
	}
};

// function to update the student info on appwrite
export const UpdateStudentInfo = async (DataToUpdate: any) => {
	try {
		const { docId, ...data } = DataToUpdate;
		const resData = await databases.updateDocument(
			DBID,
			STUDENTID,
			docId,
			data
		);
	} catch (error) {
		console.log(error);
	}
};

// function to check for the current session in the database
export const checkCurrentSession = async () => {
	try {
		// get the current session if any
		const resData = await account.get();
		console.log(resData);
		return resData;
	} catch (error) {
		console.log(error);
	}
};

// function to list documents based on a query (matricNumber) in appwrite
export const listDocuments = async (matricNumber: string) => {
	try {
		console.log(matricNumber);
		// get the documents that fit the query
		const resDoc = await databases.listDocuments(DBID, STUDENTID, [
			Query.equal("MatricNumber", matricNumber.toString()),
		]);
		console.log(resDoc);
		return resDoc;
	} catch (error) {
		console.log(error);
	}
};

// function to get the faculty time-table of a student
export const getFacultyTimeTable = async () => {
	try {
		// check if the there is a logged in user
		const session: any = await checkCurrentSession();
		console.log(session);
		// if the session exists
		if (session) {
			console.log(session.$id);
			// get the user's document using the user's id
			const resDoc = await databases.getDocument(DBID, STUDENTID, session.$id);
			console.log(resDoc);
			if (resDoc && resDoc.$id) {
				const resTable = await databases.listDocuments(DBID, TIME_TABLE_ID, [
					Query.equal("type", "faculty"),
					Query.equal("part", resDoc.faculty),
				]);
				console.log(resTable);
				return resTable;
			}
		}
	} catch (error) {
		console.log(error);
	}
};
