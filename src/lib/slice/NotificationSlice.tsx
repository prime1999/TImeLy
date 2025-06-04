import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendAppwriteNotification } from "../actions/Notifiction.action";

type initialType = {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
};

const initialState: initialType = {
	isLoading: false,
	message: "",
	isSuccess: false,
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
		builders;
	},
});

export const { reset } = NotificationSlice.actions;

export default NotificationSlice.reducer;
