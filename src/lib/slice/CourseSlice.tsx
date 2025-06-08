import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCourse, submitCourseUpdateRequest } from "../actions/Course.action";

type initialType = {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	data: any;
};

const initialState: initialType = {
	isLoading: false,
	message: "",
	isSuccess: false,
	data: null,
};

// function to reister a course
export const registerCourse = createAsyncThunk(
	"course/registerCourse",
	async (dataSent: any) => {
		try {
			const response = await addCourse(dataSent);
			if (response) {
				console.log(response);
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
			console.log(data);
			const res = await submitCourseUpdateRequest(data);
			console.log(res);
		} catch (error) {
			console.log(error);
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
			.addCase(registerCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
			})
			.addCase(registerCourse.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
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
			});
	},
});

export const { reset } = CourseSlice.actions;

export default CourseSlice.reducer;
