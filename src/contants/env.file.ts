const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT as string;
const APIKEY = import.meta.env.VITE_APPWRITE_API_KEY as string;
const STUDENTID = import.meta.env.VITE_STUDENT_COLLECTION_ID as string;
const DBID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
const PROJECTID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;
const TIME_TABLE_ID = import.meta.env.VITE_TIME_TABLE_COLLECTION_ID as string;
const NOTEID = import.meta.env.VITE_NOTE_COLLECTION_ID as string;
const EXAM_SCHEDULE_ID = import.meta.env
	.VITE_EXAM_SCHEDULE_COLLECTION_ID as string;
const USER_COURSE_ID = import.meta.env.VITE_USER_COURSE_ID as string;
const COURSES_ID = import.meta.env.VITE_COURSES_ID as string;
const COURSE_UPDATE_REQUEST_ID = import.meta.env
	.VITE_COURSE_UPDATE_REQUEST_ID as string;
const NOTIFICATION_ID = import.meta.env.VITE_NOTIFICATION_ID as string;

export {
	ENDPOINT,
	APIKEY,
	STUDENTID,
	DBID,
	PROJECTID,
	TIME_TABLE_ID,
	NOTEID,
	EXAM_SCHEDULE_ID,
	USER_COURSE_ID,
	COURSES_ID,
	COURSE_UPDATE_REQUEST_ID,
	NOTIFICATION_ID,
};
