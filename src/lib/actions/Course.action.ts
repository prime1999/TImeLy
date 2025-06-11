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
} from "@/contants/env.file";
import { normalizeString } from "../utils/helperFunctions/helper";
import { checkCurrentSession } from "./Student.actions";

const databases = new Databases(client);

// function to register a course on appwrite
export const addCourse = async (courseData: any) => {
	try {
		// create the cousre data from the data sent (courseData)
		const course = {
			CourseCode: courseData.courseCode,
			CourseTitle: courseData.courseTitle,
			unit: courseData.unit.toString(),
			venue: courseData.venue,
			lecturer: courseData.lecturer,
			schedule: JSON.stringify(courseData.schedule),
		};

		// check if the course already exist in the database
		const checkCourse = await databases.listDocuments(DBID, COURSES_ID, [
			Query.equal("CourseTitle", course.CourseTitle),
			Query.equal("CourseCode", course.CourseCode),
		]);

		// if it does
		if (checkCourse.total > 0) {
			// check if the user already registered for the course
			const checkUserCourse = await databases.listDocuments(
				DBID,
				USER_COURSE_ID,
				[
					Query.equal("userId", courseData.userId),
					Query.equal("courseId", checkCourse.documents[0].$id),
				]
			);
			// if the user hasn't registered for the course,
			if (checkUserCourse.total < 1) {
				// then register the user
				await databases.createDocument(DBID, USER_COURSE_ID, ID.unique(), {
					userId: courseData.userId,
					courseId: checkCourse.documents[0].$id,
				});
			}
			// compare the course infos
			const compared: any = await compareCourseInfo(
				checkCourse.documents[0].$id,
				courseData
			);
			// if a course with the same info exists
			if (compared.exists) {
				return {
					exist: true,
					data: compared.payload,
					courseId: checkCourse.documents[0].$id,
				};
			}
			// if a course with the same info does not exist
			return {
				exist: false,
			};
		}
		// but if the user hasn't registered for the course and the course doesn't exist in the DB
		// create one
		const courseRes = await databases.createDocument(
			DBID,
			COURSES_ID,
			ID.unique(),
			course
		);
		// register the user for the course
		const userCourseRes = await databases.createDocument(
			DBID,
			USER_COURSE_ID,
			ID.unique(),
			{ userId: courseData.userId, courseId: courseRes.$id }
		);
		console.log(userCourseRes);
		return userCourseRes;
	} catch (error) {
		console.log(error);
	}
};

// check if the existing and submitted course info are same
export const compareCourseInfo = async (courseId: string, updateData: any) => {
	try {
		// get the exiting document from the DB
		const existingCourse = await databases.getDocument(
			DBID,
			COURSES_ID,
			courseId
		);
		console.log({ existingCourse, updateData });
		// if the document exists
		if (existingCourse && existingCourse.$id) {
			// create an empty object where the user will store the data to update
			const updatePayload: { [key: string]: any } = {};
			// start checking each field for the data to update and add the data to the empty object created
			if (
				updateData.CourseTitle &&
				normalizeString(updateData.CourseTitle) !==
					normalizeString(existingCourse.CourseTitle)
			)
				updatePayload.CourseTitle = updateData.CourseTitle;

			if (
				updateData.CourseCode &&
				normalizeString(updateData.CourseCode) !==
					normalizeString(existingCourse.CourseCode)
			)
				updatePayload.CourseCode = updateData.CourseCode;

			if (updateData.unit && updateData.unit.toString() !== existingCourse.unit)
				updatePayload.unit = updateData.unit;

			if (
				updateData.venue &&
				normalizeString(updateData.venue) !==
					normalizeString(existingCourse.venue)
			)
				updatePayload.venue = updateData.venue;

			if (
				updateData.lecturer &&
				normalizeString(updateData.lecturer) !==
					normalizeString(existingCourse.lecturer)
			)
				updatePayload.lecturer = updateData.lecturer;

			if (
				updateData.schedule &&
				JSON.stringify(updateData.schedule) !== existingCourse.schedule
			)
				updatePayload.schedule = JSON.stringify(updateData.schedule);

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
		return error;
	}
};

// function to update a course
export const submitCourseUpdateRequest = async (data: any) => {
	try {
		console.log(data);
		// Get the current user
		const user = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return "User not Authorized";
		// if the user authenticated
		const userId = user.$id;
		// submit the request
		const req = await databases.createDocument(
			DBID,
			COURSE_UPDATE_REQUEST_ID,
			ID.unique(),
			{
				proposedChange: JSON.stringify(data.updateData),
				courses: [data.courseId],
				student: [userId],
				createdAt: new Date().toISOString(),
			}
		);
		// if the course update request was created
		if (req && req.$id) {
			const course = await databases.getDocument(
				DBID,
				COURSES_ID,
				data.courseId
			);
			// if the course exists
			if (course) {
				// create the actions array
				let actions = [
					{
						label: "approve and merge",
						function: "mergeUpdate()",
						payload: { courseId: data.courseId, data: data.updateData },
					},
					{
						label: "approve key",
						function: "approveUpdate()",
						payload: { courseId: data.courseId, data: data.updateData },
					},
					{
						label: "decline key",
						function: "declineUpdate()",
						payload: { courseId: data.courseId, data: data.updateData },
					},
					{
						label: "show details",
						function: "showDetails()",
						payload: { courseId: data.courseId, data: data.updateData },
					},
				];
				// create the notification data to be sent
				const notificationData = {
					title: "Request to update course details",
					message: `There is a request to correct course info, Please do review.`,
					type: "request",
					actions: JSON.stringify(actions),
					isRead: false,
					createdAt: new Date().toISOString(),
					student: [userId],
				};
				// create a notification on the course update request
				const notification = await databases.createDocument(
					DBID,
					NOTIFICATION_ID,
					ID.unique(),
					notificationData
				);
				// if the cotification was created
				if (notification) {
					console.log(5);
					// get the current user's info
					const user = await databases.getDocument(DBID, STUDENTID, userId);
					// get the list of admins
					console.log(user);
					const admins = await databases.listDocuments(DBID, STUDENTID, [
						Query.equal("school", user.school),
						Query.equal("faculty", user.faculty),
						Query.equal("department", user.department),
						Query.equal("level", user.level),
						Query.equal("admin", true),
					]);

					// send the notification to each admin
					await Promise.all(
						admins.documents.map((user) =>
							databases.createDocument(DBID, USER_REALTION_ID, ID.unique(), {
								student: [user.$id],
								notifications: [notification.$id],
							})
						)
					);

					return { submitted: true, description: "Request submitted to admin" };
				}
			}
		}
		return { submitted: false, description: "Request not sumitted, try again" };
	} catch (error: any) {
		console.log(error.message);
		return { submitted: false, description: "Request not sumitted, try again" };
	}
};

// function to get the list of the user's courses
export const getCoursesFromAppwrite = async () => {
	try {
		// get the user's id
		const session = await checkCurrentSession();
		//if the user is not authorized
		if (!session || !session.$id) return "User not Authorized";
		// if the user is authorised ten get the courses id the user registered for
		const coursesId = await databases.listDocuments(DBID, USER_COURSE_ID);
		// if the user has not registered for any course
		if (coursesId.total < 1) return "User not register to any course";
		// if the user has regitered, then get the use the ids to get the courses
		let courses = await Promise.all(
			coursesId.documents.map(async (course) => {
				try {
					let list = await databases.getDocument(
						DBID,
						COURSES_ID,
						course.courseId
					);
					return list?.$id ? list : null;
				} catch (error) {
					console.error("Error fetching course:", error);
					return null;
				}
			})
		);

		// Remove any nulls (failed fetches)
		courses = courses.filter((course) => course !== null);
		console.log(courses);
		return courses;
	} catch (error) {
		console.log(error);
	}
};

// function for a user to unregister a course
export const unRegisterCourse = async (courseId: string) => {
	try {
		// get the user's session
		const session = await checkCurrentSession();
		// if the user is not authenticated
		if (!session || !session.$id) return "User not Authorised";
		// if the user is authorised then,
		// get the course to be unregistered from
		const courses: any = await databases.listDocuments(DBID, USER_COURSE_ID, [
			Query.equal("courseId", courseId),
			Query.equal("userId", session.$id),
		]);
		// if the course was not registered for
		if (courses.total < 1) return "Not Registered";

		// if the user registered for the course, the rmove the course
		await databases.deleteDocument(
			DBID,
			USER_COURSE_ID,
			courses.documents[0].$id
		);
		return { done: true };
	} catch (error) {
		return { done: false };
		console.log(error);
	}
};
