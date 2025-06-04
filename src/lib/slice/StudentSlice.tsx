import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	getCurrentStudent,
	UpdateStudentInfo,
	listDocuments,
	getFacultyTimeTable,
} from "../actions/Student.actions";

type initialType = {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	student: any | null;
};

const initialState: initialType = {
	isLoading: false,
	message: "",
	isSuccess: false,
	student: null,
};

// store function to get the current user
export const getCurrentUser = createAsyncThunk(
	"student/currentUser",
	async (userID: string, thunkAPI: any) => {
		try {
			const user: any = await getCurrentStudent(userID);
			if (user && user.$id) {
				const student = {
					email: user.Email,
					matricNumber: user.MatricNumber,
					gender: user.Gender,
					admin: user.admin,
				};
				console.log(student);
				return student;
			}
			return null;
		} catch (error) {
			console.log(error);
		}
	}
);

// store function to get the current user
export const UpdateUser = createAsyncThunk(
	"student/updateUser",
	async (DataToUpdate: any, thunkAPI: any) => {
		try {
			const data: any = await UpdateStudentInfo(DataToUpdate);
			if (data) {
				return data;
			}
			return null;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to get documents based on a query (matricNumber)
export const getDocuments = createAsyncThunk(
	"student/listDocument",
	async (matricNumber: string, thunkAPI: any) => {
		try {
			console.log(matricNumber);
			const res = await listDocuments(matricNumber);
			return res;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to get the faculty time-table of the curent user
export const getFacultyTable = createAsyncThunk(
	"student/getFacultytable",
	async () => {
		try {
			const res = await getFacultyTimeTable();
			console.log(res);
			return res;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

export const StudentSlice = createSlice({
	name: "student",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(getCurrentUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				console.log(action.payload);
				state.student = action.payload;
			})
			.addCase(getCurrentUser.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.student = null;
			});
	},
});

export const { reset } = StudentSlice.actions;

export default StudentSlice.reducer;
