import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	getAppwriteNotifications,
	sendAppwriteNotification,
} from "../actions/Notification.action";

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

// export function to send notification
export const sendNotification = createAsyncThunk(
	"notification/sendNotification",
	async (payload: any, thunkAPI: any) => {
		try {
			const notification: any = await sendAppwriteNotification(payload);
		} catch (error) {
			console.log(error);
		}
	}
);

// export function to get the notification of the current student
export const getNotifications = createAsyncThunk(
	"mnotification/notification",
	async () => {
		try {
			// call the function to get the notifications
			const notifications = await getAppwriteNotifications();
			console.log(notifications);
			return notifications;
		} catch (error) {
			console.log(error);
		}
	}
);

export const NotificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(getNotifications.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getNotifications.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
			})
			.addCase(getNotifications.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { reset } = NotificationSlice.actions;

export default NotificationSlice.reducer;
