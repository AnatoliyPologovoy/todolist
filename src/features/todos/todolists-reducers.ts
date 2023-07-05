import {ResponseCode, TodolistApi, TodoListDomainType} from "features/todos/todolist-api";
import {FilterType, tasksThunks} from "features/tasks/tasks-reducers";
import {appActions, RequestStatusType} from "app/app-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/auth/auth-reducer";

export type TodoListType = {
		filter: FilterType
		entityStatus: RequestStatusType
} & TodoListDomainType

const initialState: TodoListType[] = []

const slice = createSlice({
		name: 'todoList',
		initialState,
		reducers: {
				// removeTodolist(state, action: PayloadAction<{ id: string }>) {
				// 		const index = state.findIndex(t => t.id === action.payload.id)
				// 		if (index !== -1) state.splice(index, 1)
				// 		//2 way
				// 		// return state.filter((tl) => tl.id != action.payload.id);
				// 		//использовать return если изменяется весь стейт целиком, будь то массив или обьект
				// },
				createTodolist(state, action: PayloadAction<{ todoItem: TodoListDomainType }>) {
						const newTdl: TodoListType = {
								...action.payload.todoItem,
								filter: "all",
								entityStatus: 'idle'
						}
						state.unshift(newTdl)
				},
				changeTodolistTitle(state, action: PayloadAction<{ title: string, id: string }>) {
						const index = state.findIndex(t => t.id === action.payload.id)
						if (index) state[index].title = action.payload.title
				},
				changeTodolistFilter(state, action: PayloadAction<{ filter: FilterType, id: string }>) {
						const index = state.findIndex(t => t.id === action.payload.id)
						if (index) state[index].filter = action.payload.filter
				},
				changeTodolistEntityStatus(state, action: PayloadAction<{
						entityStatus: RequestStatusType,
						id: string
				}>) {
						const index = state.findIndex(t => t.id === action.payload.id)
						if (index) state[index].entityStatus = action.payload.entityStatus
				}
		},
		extraReducers: builder => {
				builder
						//logout case
						.addCase(authActions.setIsLoginIn, (state, action) => {
								if (!action.payload.status) return initialState
						})
						.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
								return action.payload.todoLists.map(t => ({
										...t,
										filter: 'all',
										entityStatus: 'idle'
								}))
						})
						.addCase(todoListThunk.removeTodoListTC.fulfilled, (state, action) => {
								const index = state.findIndex(t => t.id === action.payload)
								if (index !== -1) state.splice(index, 1)
						})
		}
})


//thunk
const fetchTodoListsTC = createAppAsyncThunk<{ todoLists: TodoListDomainType[] }>
('todoList/fetchTodoList',
		async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus({status: 'loading'}))
				let todoLists
				try {
						const res = await TodolistApi.getTodoLists()
						dispatch(appActions.setAppStatus({status: 'succeeded'}))
						todoLists = res.data
						return {todoLists}
				} catch (e) {
						handleServerNetworkError(e, dispatch)
						return rejectWithValue(null)
				} finally {
						todoLists?.forEach(t => {
								dispatch(tasksThunks.fetchTasksTC(t.id))
						})
				}
		})

const removeTodoListTC = createAppAsyncThunk<string, string>
('todoList/removeTodolist', async (todoListId, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(appActions.setAppStatus({status: 'loading'}))
		dispatch(todoListsActions.changeTodolistEntityStatus(
				{entityStatus: 'loading', id: todoListId}))
		try {
				const res = await TodolistApi.removeTodoList(todoListId)
				if (res.data.resultCode === ResponseCode.Ok) {
						dispatch(appActions.setAppStatus({status: 'succeeded'}))
						return todoListId
				} else {
						handleServerAppError(res.data, dispatch)
						dispatch(todoListsActions.changeTodolistEntityStatus(
								{entityStatus: 'failed', id: todoListId}))
						return rejectWithValue(null)
				}
		} catch (e) {
				handleServerNetworkError(e, dispatch)
				dispatch(todoListsActions.changeTodolistEntityStatus(
						{entityStatus: 'failed', id: todoListId}
				))
				return rejectWithValue(null)
		}
})


export const createTodoListTC = (
		title: string,
		setRejectTitle: (title: string) => void
): AppThunk => {
		return (dispatch) => {
				dispatch(appActions.setAppStatus({status: 'loading'}))
				TodolistApi.createTodoList(title)
						.then(res => {
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(todoListsActions.createTodolist(
												{todoItem: res.data.data.item}))
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
								} else {
										handleServerAppError(res.data, dispatch)
										//Set title in local state AddItemForm
										setRejectTitle(title)
								}
						})
						.catch((er) => {
								handleServerNetworkError(er, dispatch)
								//Set title in local state AddItemForm
								setRejectTitle(title)
						})
		}
}

export const changeTodoListTitleTC = (
		title: string,
		todoId: string,
		setRejectTitle: (title: string) => void
): AppThunk => {
		return (dispatch) => {
				dispatch(appActions.setAppStatus({status: 'loading'}))
				dispatch(todoListsActions.changeTodolistEntityStatus(
						{entityStatus: 'loading', id: todoId}))

				TodolistApi.changeTitleTodoList(title, todoId)
						.then(res => {
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(todoListsActions.changeTodolistTitle({title, id: todoId}))
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
										dispatch(todoListsActions.changeTodolistEntityStatus(
												{entityStatus: 'succeeded', id: todoId}))

								} else {
										handleServerAppError(res.data, dispatch)
										dispatch(todoListsActions.changeTodolistEntityStatus(
												{entityStatus: 'failed', id: todoId}))
										//Set title in local state EditableSpan
										setRejectTitle(title)
								}
						})
						.catch((er) => {
								handleServerNetworkError(er, dispatch)
								dispatch(todoListsActions.changeTodolistEntityStatus(
										{entityStatus: 'failed', id: todoId}))
								//Set title in local state EditableSpan
								setRejectTitle(title)
						})
		}
}

export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions
export const todoListThunk = {fetchTodoListsTC, removeTodoListTC}