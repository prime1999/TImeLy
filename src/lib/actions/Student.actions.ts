import { Account, Databases, ID, Query } from "appwrite";
import client from "../appwrite.config";
import {
	DBID,
	STUDENTID,
	TIME_TABLE_ID,
	BUG_UPDATE_ID,
} from "@/contants/env.file";

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
			return { error: "User already exists" };
		}
		// else if any other error
		return { error: "An error occurred when creating user, please try again" };
	}
};

// function to create a session for a created user on Appwrite
export const createuserAppwriteSession = async (userdata: any) => {
	try {
		// create a session using the email ans password
		const res = await account.createEmailPasswordSession(
			userdata.email,
			userdata.password
		);
		if (!res.$id) return { msg: "Wrong User credentials" };
		// if the session is created then
		// get the user's documents
		const userDoc = await databases.getDocument(DBID, STUDENTID, res.userId);
		return { msg: "User Authenticated", data: userDoc };
	} catch (error) {
		return { msg: "Wrong User credentials" };
	}
};

// function to create the user document in appwrite collection
export const createAppwriteuserDocument = async (userDocData: any) => {
	try {
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
		return userDoc;
	} catch (error) {
		console.log(error);
		return { error: "Check credentials" };
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
		return null;
	} catch (error) {
		console.log(error);
	}
};

// function to update the student info on appwrite
export const UpdateStudentInfo = async (DataToUpdate: any) => {
	try {
		const { docId, ...data } = DataToUpdate;
		await databases.updateDocument(DBID, STUDENTID, docId, data);
	} catch (error) {
		console.log(error);
	}
};

// function to check for the current session in the database
export const checkCurrentSession = async () => {
	try {
		// get the current session if any
		const resData = await account.get();
		return resData;
	} catch (error) {
		console.log(error);
	}
};

// function to list documents based on a query (matricNumber) in appwrite
export const listDocuments = async (matricNumber: string) => {
	try {
		// get the documents that fit the query
		const resDoc = await databases.listDocuments(DBID, STUDENTID, [
			Query.equal("MatricNumber", matricNumber.toString()),
		]);
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
		// if the session exists
		if (session) {
			// get the user's document using the user's id
			const resDoc = await databases.getDocument(DBID, STUDENTID, session.$id);
			if (resDoc && resDoc.$id) {
				const resTable = await databases.listDocuments(DBID, TIME_TABLE_ID, [
					Query.equal("type", "faculty"),
					Query.equal("part", resDoc.faculty),
				]);
				return resTable;
			}
		}
	} catch (error) {
		console.log(error);
	}
};

// appwrite function to get the student's profile from the DB
export const getStudentProfileFromDB = async () => {
	try {
		// check if the there is a logged in user
		const session: any = await checkCurrentSession();
		if (session) {
			// get the user doc info from appwrite
			const resDoc = await databases.getDocument(DBID, STUDENTID, session.$id);
			if (resDoc && resDoc.$id) {
				return resDoc;
			} else {
				return "Student does not exist";
			}
		}
	} catch (error) {
		console.log(error);
		return "Student does not exist";
	}
};

// Appwrite function to update the student's profile
export const updateProfile = async (data: any) => {
	try {
		// check if the there is a logged in user
		const session: any = await checkCurrentSession();
		// update the document
		const res = await databases.updateDocument(
			DBID,
			STUDENTID,
			session.$id,
			data
		);
		if (res && res.$id) {
			return res;
		}
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function for the create password recovery token
export const createPasswordRecovery = async (email: string) => {
	try {
		// call te function
		const token = await account.createRecovery(
			email,
			"http://localhost:5173/forgotPassword"
		);
		if (token) {
			return token;
		}
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function for the Update password recovery (confirmation)
export const passwordRecovery = async (data: any) => {
	try {
		// call the function
		const res = await account.updateRecovery(
			data.userId,
			data.secret,
			data.password
		);
		if (res) {
			return res;
		}
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function to log a user out
export const logUserOutFromDB = async () => {
	try {
		// get the current session
		const res = await checkCurrentSession();
		if (res && res.$id) {
			await account.deleteSession("current");
		}
	} catch (error) {
		console.log(error);
	}
};

// Appwrite function to report bugs and sugest updates
export const BugAndUpdate = async (data: any) => {
	try {
		// get the current session
		const res = await checkCurrentSession();
		if (!res || !res.$id) {
			return { msg: "User not Authorized" };
		}
		// get the student data
		const student = await databases.getDocument(DBID, STUDENTID, res.$id);
		const dataToSend = {
			title: data.title,
			type: data.type,
			Description: data.message,
			email: student.Email,
		};
		// create the update or report the bug
		const resData = await databases.createDocument(
			DBID,
			BUG_UPDATE_ID,
			ID.unique(),
			dataToSend
		);
		return { msg: `${data.type} report created`, data: resData };
	} catch (error) {
		console.log(error);
	}
};
