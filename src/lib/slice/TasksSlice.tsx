import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	addTaskToAppwrite,
	deleteTaskInDB,
	getTasksFromDB,
	updateTaskInDB,
} from "../actions/Tasks.action";

type initType = {
	tasks: any | null;
	filteredTasks: any | null;
	isLoading: boolean;
	isSucess: boolean;
	message: string;
};

const initialState: initType = {
	filteredTasks: null,
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
			// get just 2 of the tasks
			const filteredTasks = res.tasks.slice(0, 2);
			return { filteredTasks, tasks: res.tasks };
		}
	} catch (error) {
		console.log(error);
	}
});

// function to call the function to add a task in the DB
export const addTask = createAsyncThunk("task/addTask", async (taskData) => {
	try {
		console.log(taskData);
		// call the apwrite function
		const res: any = await addTaskToAppwrite(taskData);
		console.log(res);
		return res?.data;
	} catch (error) {
		console.log(error);
	}
});

// function to call the function to update a task in the DB
export const updateTask = createAsyncThunk(
	"tasks/updateTask",
	async (updateData) => {
		try {
			console.log(updateData);
			// call the appwrite function
			const res = await updateTaskInDB(updateData);
			return res;
		} catch (error) {
			console.log(error);
		}
	}
);

// function to call the function to delete a task in the DB
export const deleteTask = createAsyncThunk(
	"tasks/deleteTask",
	async (taskId: string) => {
		try {
			// call the appwrite function
			await deleteTaskInDB(taskId);
		} catch (error) {
			console.log(error);
		}
	}
);

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
				state.tasks = action?.payload?.tasks;
				state.filteredTasks = action?.payload?.filteredTasks;
			})
			.addCase(getTasks.rejected, (state) => {
				state.isLoading = true;
				state.isSucess = false;
			})
			.addCase(addTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addTask.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = action.payload;
				state.isSucess = true;
			})
			.addCase(addTask.rejected, (state) => {
				state.isLoading = false;
				state.isSucess = false;
			})
			.addCase(updateTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateTask.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateTask.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(deleteTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteTask.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(deleteTask.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { reset } = TaskSlice.actions;

export default TaskSlice.reducer;
