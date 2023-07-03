import {ResponseCode, TaskRequestType, TaskResponseType, TodolistApi} from "api/todolist-api";
import {AppRootStateType, AppThunk, AppThunkDispatch} from "app/store";
import {appActions, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todoListsActions} from "reducers/todolists-reducers";
import {authActions} from "reducers/Auth-reducer";
import {Dispatch} from "redux";


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
				// setTasks(state, action: PayloadAction<{ todoListId: string, tasks: TaskResponseType[] }>) {
				// 		state[action.payload.todoListId] = action.payload.tasks.map(t => (
				// 				{...t, entityStatus: 'idle'}))
				// },
				removeTask(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
						const tasks = state[action.payload.todoListId]
						const index = tasks.findIndex(t => t.id === action.payload.taskId)
						if (index !== -1) tasks.splice(index, 1)
				},
				updateTask(state, action: PayloadAction<{ task: TaskResponseType }>) {
						const tasks = state[action.payload.task.todoListId]
						const index = tasks.findIndex(t => t.id === action.payload.task.id)
						if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.task}
				},
				createTask(state, action: PayloadAction<{ task: TaskResponseType }>) {
						const tasks = state[action.payload.task.todoListId]
						tasks.unshift({...action.payload.task, entityStatus: 'idle'})
				},
				changeTaskEntityStatus(state, action: PayloadAction<{ taskId: string, entityStatus: RequestStatusType, todoListId: string }>) {
						const tasks = state[action.payload.todoListId]
						const index = tasks.findIndex(t => t.id === action.payload.taskId)
						if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus
				}
		},
		extraReducers: builder => {
				builder
						.addCase(fetchTasksTC.fulfilled, (state, action) => {
								state[action.payload.todoListId] = action.payload.tasks.map(t => (
										{...t, entityStatus: 'idle'}))
						})
						.addCase(todoListsActions.setTodoList,
								(state, action) => {
										action.payload.todos.forEach(t => {
												state[t.id] = []
										})
								})
						.addCase(todoListsActions.createTodolist,
								(state, action) => {
										state[action.payload.todoItem.id] = []
								})
						.addCase(todoListsActions.removeTodolist,
								(state, action) => {
										delete state[action.payload.id]
								})
						//logout case
						.addCase(authActions.setIsLoginIn, (state, action) => {
								if (!action.payload.status) return initialState
						})
		}
})

const fetchTasksTC =
		createAsyncThunk<
				{todoListId: string, tasks: TaskResponseType[]}, //возвращаемое значение
				string, // принимаемое значение
				{dispatch: Dispatch, rejectValue: null} // методы thunkAPI
				>('tasks/setTasks', async (todoListId, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(appActions.setAppStatus({status: 'loading'}))
		try {
				const res = await TodolistApi.getTasks(todoListId)
				dispatch(appActions.setAppStatus({status: 'succeeded'}))
				return {todoListId: todoListId, tasks: res.data.items}
		} catch (e: any) {
				handleServerNetworkError(e, dispatch)
				return rejectWithValue(null)
		}
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasksTC}


//thunk
// export const _setTasksTC =
// 		(todoListId: string): AppThunk => (dispatch) => {
// 				dispatch(appActions.setAppStatus({status: 'loading'}))
// 				TodolistApi.getTasks(todoListId)
// 						.then(res => {
// 								dispatch(tasksActions.setTasks(
// 										{todoListId: todoListId, tasks: res.data.items}))
// 								dispatch(appActions.setAppStatus({status: 'succeeded'}))
// 						})
// 						.catch((er) => {
// 								handleServerNetworkError(er, dispatch)
// 						})
// 		}

export const removeTaskTC
		= (todoListId: string, taskId: string): AppThunk =>
		(dispatch) => {
				dispatch(appActions.setAppStatus({status: 'loading'}))
				dispatch(tasksActions.changeTaskEntityStatus(
						{taskId, entityStatus: 'loading', todoListId}))
				TodolistApi.removeTask(todoListId, taskId)
						.then(res => {
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(tasksActions.removeTask({taskId, todoListId}))
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
								} else {
										handleServerAppError(res.data, dispatch)
										dispatch(tasksActions.changeTaskEntityStatus(
												{taskId, entityStatus: 'failed', todoListId}))
								}
						})
						.catch((er) => {
								handleServerNetworkError(er, dispatch)
								dispatch(tasksActions.changeTaskEntityStatus(
										{taskId, entityStatus: 'failed', todoListId}))
						})
		}

export const createTaskTC = (
		todoListId: string,
		title: string,
		setRejectTitle: (title: string) => void
): AppThunk =>
		(dispatch) => {
				dispatch(appActions.setAppStatus({status: 'loading'}))
				TodolistApi.createTask(todoListId, title)
						.then(res => {
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(tasksActions.createTask({task: res.data.data.item}))
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
								} else {
										handleServerAppError(res.data, dispatch)
										//Set title in local state AddItemForm
										setRejectTitle(title)
								}
						})
						.catch((er) => {
								//Set title in local state AddItemForm
								setRejectTitle(title)
								handleServerNetworkError(er, dispatch)
						})
		}


export const changeTaskTC = (
		todoListId: string,
		taskId: string,
		changeValue: TaskRequestType,
		setRejectTitle: ((title: string) => void) | null = null
): AppThunk => {
		return (dispatch,
						getState: () => AppRootStateType) => {
				let requestBody = getState()
						.tasks[todoListId].find(t => t.id === taskId)
				if (requestBody) {
						requestBody = {...requestBody, ...changeValue}
						dispatch(appActions.setAppStatus({status: 'loading'}))
						dispatch(tasksActions.changeTaskEntityStatus(
								{taskId, entityStatus: 'loading', todoListId}))

						TodolistApi.changeTask(todoListId, taskId, requestBody)
								.then(res => {
										if (res.data.resultCode === ResponseCode.Ok) {
												dispatch(tasksActions.updateTask({task: res.data.data.item}))
												dispatch(appActions.setAppStatus({status: 'succeeded'}))
												dispatch(tasksActions.changeTaskEntityStatus(
														{taskId, entityStatus: 'succeeded', todoListId}))
										} else {
												handleServerAppError(res.data, dispatch)
												dispatch(tasksActions.changeTaskEntityStatus(
														{taskId, entityStatus: 'failed', todoListId}))
												//Saved title
												changeValue?.title && setRejectTitle &&
												setRejectTitle(changeValue.title)
										}
								})
								.catch((er) => {
										handleServerNetworkError(er, dispatch)
										dispatch(tasksActions.changeTaskEntityStatus(
												{taskId, entityStatus: 'failed', todoListId}))
										//Saved title
										changeValue?.title && setRejectTitle &&
										setRejectTitle(changeValue.title)
								})
				}
		}
}


