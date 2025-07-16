import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasksFromDB } from "../actions/Tasks.action";

type initType = {
	tasks: any | null;
	isLoading: boolean;
	isSucess: boolean;
	message: string;
};

const initialState: initType = {
	tasks: null,
	isLoading: false,
	isSucess: false,
	message: "",
};

// funntion to get tasks that belong to te current user
export const getTasks = createAsyncThunk("task/getTasks", async () => {
	try {
		// call the function to get the user's tasks from the DB
		const res = await getTasksFromDB();
		if (res && res.tasks) {
			console.log(res.tasks);
			return res;
		}
	} catch (error) {
		console.log(error);
	}
});

export const TaskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		reset: (state) => {
			state.message = "";
			state.isLoading = false;
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(getTasks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getTasks.fulfilled, (state, action) => {
				state.isSucess = true;
				state.isLoading = false;
				state.tasks = action.payload;
			})
			.addCase(getTasks.rejected, (state) => {
				state.isLoading = true;
				state.isSucess = false;
			});
	},
});

export const { reset } = TaskSlice.actions;

export default TaskSlice.reducer;
