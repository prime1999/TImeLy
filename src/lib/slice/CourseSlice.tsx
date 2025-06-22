import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	addCourse,
	getCoursesFromAppwrite,
	submitCourseUpdateRequest,
	unRegisterCourse,
} from "../actions/Course.action";
import { findUnRegisteredCouresInDB } from "../actions/TimeTable.action";

type initialType = {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	reload: boolean;
	loadingCourses: boolean;
	data: any;
	unRegisteredCourses: any;
};

const initialState: initialType = {
	isLoading: false,
	message: "",
	isSuccess: false,
	reload: false,
	loadingCourses: false,
	data: null,
	unRegisteredCourses: null,
};

// function to register a course
export const registerCourse = createAsyncThunk(
	"course/registerCourse",
	async (dataSent: any) => {
		try {
			// call the function to carry out the appwrite function
			const response = await addCourse(dataSent);
			if (response) {
				return response;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// function to submit update request
export const submitUpdateRequest = createAsyncThunk(
	"course/requestUpdate",
	async (data: any) => {
		try {
			// call the function to carry out the appwrite function
			const res = await submitCourseUpdateRequest(data);
			return res;
		} catch (error) {
			console.log(error);
		}
	}
);

// export function to handle the get courses function int the redux slice
export const getCourses = createAsyncThunk("course/getCourse", async () => {
	try {
		// call the function to carry out the appwrite function
		const courses = await getCoursesFromAppwrite();
		return courses;
	} catch (error) {
		console.log(error);
	}
});

// export function to handle the un-register request in the redux store
export const removeCourse = createAsyncThunk(
	"course/removeCourse",
	async (courseId: string) => {
		try {
			// call the function to un-register a course in the DB
			const res: any = await unRegisterCourse(courseId);
			if (res && res.done) {
				return res;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// export function to handle the find related un-registered courses in the redux store
export const findUnRegisteredCourses = createAsyncThunk(
	"course/findCourses",
	async () => {
		try {
			// call the function to find the courses in the DB
			const res: any = await findUnRegisteredCouresInDB();
			if (res) {
				return res;
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

export const CourseSlice = createSlice({
	name: "course",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(registerCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerCourse.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.reload = true;
			})
			.addCase(registerCourse.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.reload = false;
			})
			.addCase(submitUpdateRequest.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(submitUpdateRequest.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(submitUpdateRequest.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
			})
			.addCase(getCourses.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
			})
			.addCase(getCourses.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
			})
			.addCase(getCourses.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(findUnRegisteredCourses.pending, (state) => {
				state.loadingCourses = true;
			})
			.addCase(findUnRegisteredCourses.fulfilled, (state, action) => {
				state.loadingCourses = false;
				state.unRegisteredCourses = action.payload;
			})
			.addCase(findUnRegisteredCourses.rejected, (state) => {
				state.loadingCourses = false;
			})
			.addCase(removeCourse.pending, (state) => {
				state.reload = true;
			})
			.addCase(removeCourse.fulfilled, (state) => {
				state.reload = false;
			})
			.addCase(removeCourse.rejected, (state) => {
				state.reload = false;
			});
	},
});

export const { reset } = CourseSlice.actions;

export default CourseSlice.reducer;
