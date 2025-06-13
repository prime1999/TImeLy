import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	checkAppriteTimeTable,
	createAppwritTimeTable,
	updateAppwriteTimeTable,
} from "../actions/TimeTable.action";

type initialType = {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	reload: boolean;
	data: any;
};

const initialState: initialType = {
	isLoading: false,
	message: "",
	isSuccess: false,
	reload: false,
	data: null,
};

// function to check the time table for any DB data
export const checkTimeTable = createAsyncThunk(
	"timeTable/checkTimeTable",
	async (type: string) => {
		try {
			//call the Appwrite function to check the Db
			const timeTable: any = await checkAppriteTimeTable(type.toLowerCase());
			if (timeTable && timeTable.total > 0) {
				return { exist: true, data: timeTable.documents };
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// function to create a new time table in th DB
export const createTimetable = createAsyncThunk(
	"timeTable/createTimeTable",
	async (data: string) => {
		try {
			// call the Appwrite function to create the time table in the DB
			const timeTable = await createAppwritTimeTable(data);
			if (timeTable) return timeTable;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to update a time table in the DB
export const updateTimeTable = createAsyncThunk(
	"timeTable/updateTimeTable",
	async (data: any) => {
		try {
			// call the Appwrite fucntion to update a time tbale in the DB
			const update: any = await updateAppwriteTimeTable(data);
			if (update && update.$id) {
				return update;
			}
			return;
		} catch (error) {
			console.log(error);
		}
	}
);

export const TimeTableSlice = createSlice({
	name: "timeTable",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(checkTimeTable.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkTimeTable.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(checkTimeTable.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
			})
			.addCase(createTimetable.pending, (state) => {
				state.isLoading = true;
				state.reload = true;
			})
			.addCase(createTimetable.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
				state.reload = false;
			})
			.addCase(createTimetable.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
			})
			.addCase(updateTimeTable.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateTimeTable.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
			})
			.addCase(updateTimeTable.rejected, (state) => {
				state.isLoading = false;
				state.isSuccess = false;
			});
	},
});

export const { reset } = TimeTableSlice.actions;

export default TimeTableSlice.reducer;
