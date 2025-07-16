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
		// Get the current user
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return "User not Authorized";
		// check if the course already exist in the database
		const checkCourse = await databases.listDocuments(DBID, COURSES_ID, [
			Query.equal(
				"CourseTitle",
				courseData.courseTitle || courseData.CourseTitle
			),
			Query.equal("CourseCode", courseData.courseCode || courseData.CourseCode),
		]);
		// if it does
		if (checkCourse.total > 0) {
			// check if the user already registered for the course
			const checkUserCourse = await databases.listDocuments(
				DBID,
				USER_COURSE_ID,
				[
					Query.equal("userId", user.$id),
					Query.equal("courseId", checkCourse.documents[0].$id),
				]
			);
			// if the user hasn't registered for the course,
			if (checkUserCourse.total < 1) {
				// then register the user
				await databases.createDocument(DBID, USER_COURSE_ID, ID.unique(), {
					userId: user.$id,
					courseId: checkCourse.documents[0].$id,
				});
			}
			// compare the course infos
			const compared: any = await compareCourseInfo(
				checkCourse.documents[0].$id,
				courseData
			);
			// TODO
			// check if the user is an admin so has to update the course directly
			if (user.admin === true) {
				// TODO
				// update the course without creating the course update ticket
				// send the notification to confirm the course update
			}
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
		// check if the user is an admin
		// if yes, then create the course directly and register the user
		if (user.admin === true) {
			//TODO
			// create the course and the register the user
			const courseRes = await databases.createDocument(
				DBID,
				COURSES_ID,
				ID.unique(),
				courseData
			);
			// check if the course was created, and register the student that initialized the course to be added
			if (courseRes) {
				// register the user for the course
				const userCourseRes = await databases.createDocument(
					DBID,
					USER_COURSE_ID,
					ID.unique(),
					{ userId: user.$id, courseId: courseRes.$id }
				);
				return userCourseRes;
			}
		} else {
			// if the user is not an admin
			// send notification to add the course and register the user to the admins of the course

			// create the actions array
			let actions = [
				{
					// to update the course title and course code if they change
					label: "approve and Update",
					function: "addAndUpdate()",
					payload: { data: courseData },
				},
				{
					label: "approve key",
					function: "approveAddCourse()",
					payload: { data: courseData },
				},
				{
					label: "decline key",
					function: "declineAddCourse()",
					payload: { data: courseData },
				},
				{
					label: "show details",
					function: "showDetails()",
					payload: { data: courseData },
				},
			];
			const notificationData = {
				title: "Request to add a course",
				message: `There is a request to add a course, Please do review.`,
				type: "request",
				actions: JSON.stringify(actions),
				isRead: false,
				createdAt: new Date().toISOString(),
				student: [user.$id],
			};
			// create the notification
			const notification = await databases.createDocument(
				DBID,
				NOTIFICATION_ID,
				ID.unique(),
				notificationData
			);
			// if the notification was created
			if (notification) {
				// get the current user's info
				const student = await databases.getDocument(DBID, STUDENTID, user.$id);
				// get the list of admins
				const admins = await databases.listDocuments(DBID, STUDENTID, [
					Query.equal("school", student.school),
					Query.equal("faculty", student.faculty),
					Query.equal("department", student.department),
					Query.equal("level", student.level),
					Query.equal("admin", true),
				]);

				// send the notification to each admin
				await Promise.all(
					admins.documents.map((user) =>
						databases.createDocument(DBID, USER_REALTION_ID, ID.unique(), {
							student: user.$id,
							notifications: [notification.$id],
						})
					)
				);

				return {
					exist: false,
					description:
						"Request submitted to admin, Course will be registered soon",
				};
			}
		}
	} catch (error) {
		console.log(error);
	}
};

//  function to just add a course
export const addCourseToAppwrite = async (sentData: any) => {
	try {
		const { data } = sentData.payload;
		// check if the user is an admin and if already authorized
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return "User not Authorized";

		const student = await databases.getDocument(DBID, STUDENTID, user.$id);
		//if the user is not an admin
		if (student.admin !== true) return "User not Authorized";
		// the user is an admin and if the user is authorized
		// check if the course exist in appwrite
		const checkCourse = await databases.listDocuments(DBID, COURSES_ID, [
			Query.equal("CourseCode", data.courseCode),
			Query.equal("CourseTitle", data.courseTitle),
		]);

		if (checkCourse.total > 0) return { msg: "Course not created" };
		// create the course data
		const courseData = {
			CourseTitle: data.courseTitle,
			CourseCode: data.courseCode,
			lecturer: data.lecturer,
			schedule: JSON.stringify(data.schedule),
			unit: `${data.unit}`,
		};
		// add the course to the DB
		const course = await databases.createDocument(
			DBID,
			COURSES_ID,
			ID.unique(),
			courseData
		);
		//  check if the course was created then send it to the course slice
		if (course.$id) {
			return {
				msg: "Course created",
				data: course,
			};
		}
	} catch (error) {
		console.log({ msg: "Course not created", data: error });
		return { msg: "Course not created", data: error };
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

			// if (
			// 	updateData.venue &&
			// 	normalizeString(updateData.venue) !==
			// 		normalizeString(existingCourse.venue)
			// )
			//updatePayload.venue = updateData.venue;

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

// function to submit update a course
export const submitCourseUpdateRequest = async (data: any) => {
	try {
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
				// // create the actions array
				// let actions = [
				// 	{
				// 		label: "approve and merge",
				// 		function: "mergeUpdate()",
				// 		payload: { courseId: data.courseId, data: data.updateData },
				// 	},
				// 	{
				// 		label: "approve key",
				// 		function: "approveUpdate()",
				// 		payload: { courseId: data.courseId, data: data.updateData },
				// 	},
				// 	{
				// 		label: "decline key",
				// 		function: "declineUpdate()",
				// 		payload: { courseId: data.courseId, data: data.updateData },
				// 	},
				// 	{
				// 		label: "show details",
				// 		function: "showDetails()",
				// 		payload: { courseId: data.courseId, data: data.updateData },
				// 	},
				// ];
				// create the notification data to be sent
				const notificationData = {
					title: "Request to update course details",
					message: `There is a request to correct course info, Please do review.`,
					type: "request",
					actions: JSON.stringify(data.actions),
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
					// get the current user's info
					const user = await databases.getDocument(DBID, STUDENTID, userId);
					// get the list of admins
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
								student: user.$id,
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
		console.log(123);
		// get the user's id
		const session = await checkCurrentSession();
		//if the user is not authorized
		if (!session || !session.$id) return "User not Authorized";
		console.log(session);

		// if the user is authorised ten get the courses id the user registered for
		const courses = await databases.listDocuments(DBID, USER_COURSE_ID, [
			Query.equal("userId", session.$id),
		]);
		console.log(courses);
		console.log(789);
		// if the user has not registered for any course
		if (courses.total < 1) return "User not registered to any course";
		// if the user has registered, then get the use the ids to get the courses
		let userCourses = await Promise.all(
			courses.documents.map(async (course) => {
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
		userCourses = userCourses.filter((course) => course !== null);
		return userCourses;
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
		console.log(error);
		return { done: false };
	}
};

// function to update a course in the DB
export const updateCourseInDB = async (dataToBeSent: any) => {
	try {
		const { payload } = dataToBeSent;
		const { data } = dataToBeSent.payload;
		console.log(data);
		// check if the user is an admin and if already authorized
		const user: any = await checkCurrentSession();
		// If somehow the user is not authenticated, then
		if (!user || !user.$id) return "User not Authorized";
		// get the current user document
		const student = await databases.getDocument(DBID, STUDENTID, user.$id);
		//if the user is not an admin
		if (student.admin !== true) return "User not Authorized";
		// the user is an admin and if the user is authorized
		// check if the course exist in appwrite
		const checkCourse = await databases.getDocument(
			DBID,
			COURSES_ID,
			payload.courseId
		);
		if (!checkCourse) {
			console.log({ msg: "Course does not exist" });
			return { msg: "Course does not exist" };
		}
		// if the course exists, then update the course
		const course = await databases.updateDocument(
			DBID,
			COURSES_ID,
			payload.courseId,
			data
		);
		if (!course) return { msg: "Course does not exist" };
		return { msg: "Course update done", data: course };
	} catch (error) {
		console.log(error);
	}
};
