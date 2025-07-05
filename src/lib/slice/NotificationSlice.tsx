import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	appwriteMarkAsRead,
	getAppwriteNotifications,
	sendAppwriteNotification,
} from "../actions/Notification.action";

type initialType = {
	isLoading: boolean;
	reload: boolean;
	message: string;
	isSuccess: boolean;
	data: any;
};

const initialState: initialType = {
	isLoading: false,
	reload: false,
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
	"notification/notification",
	async () => {
		try {
			// call the function to get the notifications
			const notifications = await getAppwriteNotifications();
			return notifications;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to the get the APPwrite markAsRead function
export const markAsRead = createAsyncThunk(
	"notification/markAsRead",
	async (notificationId: string) => {
		try {
			// call the appwriteMarkAsread function
			const res = await appwriteMarkAsRead(notificationId);
			return res;
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
			})
			.addCase(markAsRead.fulfilled, (state) => {
				state.reload = true;
			})
			.addCase(markAsRead.rejected, (state) => {
				state.reload = false;
			});
	},
});

export const { reset } = NotificationSlice.actions;

export default NotificationSlice.reducer;
