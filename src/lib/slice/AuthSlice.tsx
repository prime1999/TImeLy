import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	checkCurrentSession,
	createAppwriteUser,
	createPasswordRecovery,
	createuserAppwriteSession,
	logUserOutFromDB,
	passwordRecovery,
} from "../actions/Student.actions";

type initType = {
	student: any | null;
	isLoading: boolean;
	isAuthenticated: any;
	theme?: string;
	message: string;
	token: string;
};

// Retrieve and parse the student log in status from localStorage
// const studentStatus = localStorage?.getItem("studentStatus");
// const currentStudentData: any = studentStatus
// 	? JSON.parse(studentStatus)
// 	: {
// 			isAuthenticated: false,
// 			student: null,
// 			// theme: theme ? theme : "light",
// 	  };

// declare initial state data
const initialState: initType = {
	student: null,
	isLoading: false,
	isAuthenticated: false,
	//theme: currentStudentData.theme,
	message: "",
	token: "",
};

// store function for creating a user
export const createUser = createAsyncThunk(
	"auth/createStudent",
	async (userData: any) => {
		try {
			// paa the user data to the function that will send it to appwrite
			const studentRes: any = await createAppwriteUser(userData);

			// if positive res was gotten, then
			if (studentRes && studentRes.$id) {
				// const student = {
				// 	id: studentRes.$id,
				// 	email: studentRes.email,
				// 	MatricNumber: studentRes.MatricNumber,
				// };

				// return the response after formatting the the response
				return {
					isAuthenticated: true,
					student: { ...studentRes },
				};
			}
			// else return a false response
			return {
				isAuthenticated: false,
				student: null,
				message: studentRes.error,
			};
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

// store function to authenticate a user
export const authUser = createAsyncThunk(
	"auth/authStudent",
	async (userData: any) => {
		try {
			// send the user data to the function that will send it to appwrite
			const studentRes: any = await createuserAppwriteSession(userData);
			// if positive res was gotten, then
			if (studentRes && studentRes.msg === "User Authenticated") {
				const student = {
					id: studentRes.data.$id,
					email: studentRes.data.email,
					MatricNumber: studentRes.data.MatricNumber,
				};

				// return the response after formatting the the response
				return {
					isAuthenticated: true,
					student,
				};
			} else {
				// else return a false response
				return { isAuthenticated: false, student: null, msg: studentRes.msg };
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

// get the current logged in user
export const getCurrentSession = createAsyncThunk(
	"auth/getSession",
	async () => {
		try {
			const currentSession = await checkCurrentSession();
			return currentSession;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to call the appwrite funtion for the forgot password function
export const forgotPassword = createAsyncThunk(
	"auth/forgotPassword",
	async (email: string) => {
		try {
			// call the  appwrite function
			const token = await createPasswordRecovery(email);
			if (token) {
				return token;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// function call Update password recovery (confirmation)
export const UpdatePasswordRecovery = createAsyncThunk(
	"auth/passwordRecovery",
	async (data) => {
		try {
			// call the  appwrite function
			const res = await passwordRecovery(data);
			if (res) {
				return res;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// function to call the appwrite log out function
export const logUserOut = createAsyncThunk("auth/logOut", async () => {
	try {
		// call the Appwrite function to log a usre out
		await logUserOutFromDB();
	} catch (error) {
		console.log(error);
	}
});

export const AuthSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(createUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createUser.fulfilled, (state, action: any) => {
				state.isLoading = false;
				state.isAuthenticated = action.payload.isAuthenticated as any;
				state.student = action.payload.student;
			})
			.addCase(createUser.rejected, (state, action: any) => {
				state.isLoading = false;
				state.student = action.payload.student;
				state.isAuthenticated = action.payload.isAuthenticated;
			})
			.addCase(authUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(authUser.fulfilled, (state, action: any) => {
				state.isLoading = false;
				state.isAuthenticated = action.payload.isAuthenticated as any;
				state.student = action.payload.student;
			})
			.addCase(authUser.rejected, (state, action: any) => {
				state.isLoading = false;
				state.student = action.payload.student;
				state.isAuthenticated = action.payload.isAuthenticated;
			})
			.addCase(forgotPassword.fulfilled, (state, action: any) => {
				state.isLoading = false;
				state.token = action.payload;
			})
			.addCase(forgotPassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(forgotPassword.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(UpdatePasswordRecovery.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(UpdatePasswordRecovery.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdatePasswordRecovery.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { reset } = AuthSlice.actions;

export default AuthSlice.reducer;
