import {
		ResponseCode,
		TaskRequestUpdateType,
		TaskResponseType,
		TodolistApi,
		UpdateTaskModelType
} from "features/todolists-lists/todolist-api";
import {appActions, RequestStatusType} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todoListsActions, todoListThunk} from "features/todolists-lists/todolists-reducers";
import {authActions, authThunk} from "features/auth/auth-reducer";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {thunkTryCatch} from "common/utils/thunkTryCatch";


export type TasksStateType = {
		[key: string]: TaskType[]
}

export type TaskType = TaskResponseType & {
		entityStatus: RequestStatusType
}

export type FilterType = 'all' | 'complied' | 'active'

const initialState: TasksStateType = {
		// [tdlId_1]: [
		//     {id: v1(), title: "HTML&CSS", isDone: true},
		// ]
}

const slice = createSlice({
		name: 'task',
		initialState,
		reducers: {
				changeTaskEntityStatus(state, action: PayloadAction<{ taskId: string, entityStatus: RequestStatusType, todoListId: string }>) {
						const tasks = state[action.payload.todoListId]
						const index = tasks.findIndex(t => t.id === action.payload.taskId)
						if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus
				}
		},
		extraReducers: builder => {
				builder
						.addCase(createTaskTC.fulfilled, (state, action) => {
								const tasks = state[action.payload.task.todoListId]
								tasks.unshift({...action.payload.task, entityStatus: 'idle'})
						})
						.addCase(updateTaskTC.fulfilled, (state, action) => {
								const tasks = state[action.payload.todoListId]
								const index = tasks.findIndex(t => t.id === action.payload.taskId)
								if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.changeValue}
						})
						.addCase(fetchTasksTC.fulfilled, (state, action) => {
								state[action.payload.todoListId] = action.payload.tasks.map(t => (
										{...t, entityStatus: 'idle'}))
						})
						.addCase(removeTaskTC.fulfilled, (state, action) => {
								const tasks = state[action.payload.todoListId]
								const index = tasks.findIndex(t => t.id === action.payload.taskId)
								if (index !== -1) tasks.splice(index, 1)
						})
						.addCase(todoListThunk.fetchTodoListsTC.fulfilled,
								(state, action) => {
										action.payload.todoLists.forEach(t => {
												state[t.id] = []
										})
								})
						.addCase(todoListThunk.createTodoListTC.fulfilled,
								(state, action) => {
										state[action.payload.id] = []
								})
						.addCase(todoListThunk.removeTodoListTC.fulfilled,
								(state, action) => {
										delete state[action.payload]
								})
						//logout case - clean state
						.addCase(authThunk.logout.fulfilled, (state, action) => {
								if (!action.payload.isLoginIn) return initialState
						})
		}
})

const fetchTasksTC =
		createAppAsyncThunk<{ todoListId: string, tasks: TaskResponseType[] }, //возвращаемое значение
				string // принимаемое значение
				// {dispatch: Dispatch, rejectValue: null} // методы thunkAPI для createAsyncThunk
				>('tasks/setTasks', async (todoListId, thunkAPI) => {
				const {dispatch} = thunkAPI
				return thunkTryCatch(thunkAPI, async () => {
						const res = await TodolistApi.getTasks(todoListId)
						dispatch(appActions.setAppStatus({status: 'succeeded'}))
						return {todoListId: todoListId, tasks: res.data.items}
				})
		})

type removeTaskArgType = {
		todoListId: string,
		taskId: string
}

const removeTaskTC = createAppAsyncThunk<removeTaskArgType,
		removeTaskArgType>('tasks/removeTasks',
		async ({todoListId, taskId}, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(tasksActions.changeTaskEntityStatus(
						{taskId, entityStatus: 'loading', todoListId}))
				return thunkTryCatch(thunkAPI,
						async () => {
								const res = await TodolistApi.removeTask({todoListId, taskId})
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
										return {taskId, todoListId}
								} else {
										handleServerAppError(res.data, dispatch)
										dispatch(tasksActions.changeTaskEntityStatus(
												{taskId, entityStatus: 'failed', todoListId}))
										return rejectWithValue(null)
								}
						},
						() => {
								dispatch(tasksActions.changeTaskEntityStatus(
										{taskId, entityStatus: 'failed', todoListId}))
						}
				)
		})

const createTaskTC = createAppAsyncThunk<{ task: TaskResponseType },
		{
				todoListId: string,
				title: string
		}>
('tasks/createTask',
		async ({todoListId, title}, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				return thunkTryCatch(thunkAPI,
						async () => {
								const res = await TodolistApi.createTask({todoListId, title})
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
										return {task: res.data.data.item}
								} else {
										handleServerAppError(res.data, dispatch)
										//Set title in local state addItemForm
										// setRejectTitle(title)
										return rejectWithValue(title)
								}
						},
						() => {
								// setRejectTitle(title)
						}
				)
		})

type updateTaskTCOutputArgType = {
		todoListId: string,
		taskId: string,
		changeValue: TaskRequestUpdateType
}

const updateTaskTC = createAppAsyncThunk<updateTaskTCOutputArgType, updateTaskTCOutputArgType>
('task/updateTask', async (
		{todoListId, taskId,	changeValue}, thunkAPI) => {
		const {dispatch, rejectWithValue, getState} = thunkAPI

		dispatch(appActions.setAppStatus({status: 'loading'}))
		dispatch(tasksActions.changeTaskEntityStatus(
				{taskId, entityStatus: 'loading', todoListId}))

		const state = getState()
		const task = state.tasks[todoListId].find(t => t.id === taskId)

		if (!task) {
				dispatch(appActions.setAppError({error: 'task not found'}))
				dispatch(appActions.setAppStatus({status: 'failed'}))
				dispatch(tasksActions.changeTaskEntityStatus(
						{taskId, entityStatus: 'failed', todoListId}))
				return rejectWithValue(null)
		}
		try {
				const requestBody: UpdateTaskModelType = {
						deadline: task.deadline,
						description: task.description,
						priority: task.priority,
						startDate: task.startDate,
						completed: task.completed,
						title: task.title,
						status: task.status,
						...changeValue // rewrite new title or status
				}
				const res = await TodolistApi.changeTask(todoListId, taskId, requestBody)

				if (res.data.resultCode === ResponseCode.Ok) {
						dispatch(appActions.setAppStatus({status: 'succeeded'}))
						dispatch(tasksActions.changeTaskEntityStatus(
								{taskId, entityStatus: 'succeeded', todoListId}))

						return {
								todoListId,
								taskId,
								changeValue
						}
				} else {
						handleServerAppError(res.data, dispatch)
						dispatch(tasksActions.changeTaskEntityStatus(
								{taskId, entityStatus: 'failed', todoListId}))
						let rejectValue = null
						if (changeValue.title || changeValue.title === '') {
								rejectValue = changeValue.title
						}
						return rejectWithValue(rejectValue)
				}
		} catch (e) {
				handleServerNetworkError(e, dispatch)
				dispatch(tasksActions.changeTaskEntityStatus(
						{taskId, entityStatus: 'failed', todoListId}))
				//Saved title
				let rejectValue = null
				if (changeValue.title) {
						rejectValue = changeValue.title
				}
				return rejectWithValue(rejectValue)
		}
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasksTC, removeTaskTC, createTaskTC, updateTaskTC}