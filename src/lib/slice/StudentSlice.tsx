import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	getCurrentStudent,
	UpdateStudentInfo,
	listDocuments,
	getFacultyTimeTable,
	getStudentProfileFromDB,
	updateProfile,
} from "../actions/Student.actions";

type initialType = {
	isLoading: boolean;
	loadingUser: boolean;
	message: string;
	isSuccess: boolean;
	student: any | null;
	data: any;
};

const initialState: initialType = {
	isLoading: false,
	loadingUser: false,
	message: "",
	isSuccess: false,
	student: null,
	data: null,
};

// store function to get the current user
export const getCurrentUser = createAsyncThunk(
	"student/currentUser",
	async (userID: string) => {
		try {
			const user: any = await getCurrentStudent(userID);
			if (user && user.$id) {
				const student = {
					email: user.Email,
					matricNumber: user.MatricNumber,
					gender: user.Gender,
					admin: user.admin,
				};
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
	async (DataToUpdate: any) => {
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
	async (matricNumber: string) => {
		try {
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
			return res;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

// function to call the appwrite funcion to get the student's profile info from appwrite
export const getStudentProfile = createAsyncThunk(
	"student/getStudentProfile",
	async () => {
		try {
			// get the response of the function
			const res: any = await getStudentProfileFromDB();
			if (res && res.$id) {
				return res;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// function to call the appwrite function to update the student profle
export const updateStudentProfile = createAsyncThunk(
	"student/updateProfile",
	async (data) => {
		try {
			// call the function
			const res = await updateProfile(data);
			if (res && res.$id) {
				return res;
			}
		} catch (error) {
			console.log(error);
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
				state.loadingUser = true;
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.loadingUser = false;
				state.isSuccess = true;
				state.student = action.payload;
			})
			.addCase(getCurrentUser.rejected, (state) => {
				state.loadingUser = false;
				state.isSuccess = false;
				state.student = null;
			})
			.addCase(UpdateUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdateUser.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(UpdateUser.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(getStudentProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.data = action.payload;
			})
			.addCase(getStudentProfile.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getStudentProfile.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(updateStudentProfile.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateStudentProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.data = action.payload;
			})
			.addCase(updateStudentProfile.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { reset } = StudentSlice.actions;

export default StudentSlice.reducer;
