import {ResponseCode, TodolistApi, TodoListDomainType} from "features/todolists-lists/todolist-api";
import {FilterType, tasksThunks} from "features/todolists-lists/tasks/tasks-reducers";
import {appActions, RequestStatusType} from "app/app-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions, authThunk} from "features/auth/auth-reducer";
import {thunkTryCatch} from "common/utils/thunkTryCatch";

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
						//logout case - clean state
						.addCase(authThunk.logout.fulfilled, (state, action) => {
								if (!action.payload.isLoginIn) return initialState
						})
						.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
								return action.payload.todoLists.map(t => ({
										...t,
										filter: 'all',
										entityStatus: 'idle'
								}))
						})
						.addCase(removeTodoListTC.fulfilled, (state, action) => {
								const index = state.findIndex(t => t.id === action.payload)
								if (index !== -1) state.splice(index, 1)
						})
						.addCase(createTodoListTC.fulfilled, (state, action) => {
								const newTdl: TodoListType = {
										...action.payload,
										filter: "all",
										entityStatus: 'idle'
								}
								state.unshift(newTdl)
						})
						.addCase(updateTodoListTitleTC.fulfilled, (state, action) => {
								const index = state.findIndex(t => t.id === action.payload.todoListId)
								if (index) state[index].title = action.payload.title
						})
		}
})


//thunks
const fetchTodoListsTC = createAppAsyncThunk<{ todoLists: TodoListDomainType[] }>
('todoList/fetchTodoList',
		async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				let todoLists
				try {
						const res = await TodolistApi.getTodoLists()
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
('todoList/removeTodolist',
		async (todoListId, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(todoListsActions.changeTodolistEntityStatus(
				{entityStatus: 'loading', id: todoListId}))
		return thunkTryCatch(thunkAPI,
				async () => {
						const res = await TodolistApi.removeTodoList(todoListId)
						if (res.data.resultCode === ResponseCode.Ok) {
								return todoListId
						} else {
								handleServerAppError(res.data, dispatch)
								dispatch(todoListsActions.changeTodolistEntityStatus(
										{entityStatus: 'failed', id: todoListId}))
								return rejectWithValue(null)
						}
				},
				() => {
						dispatch(todoListsActions.changeTodolistEntityStatus(
								{entityStatus: 'failed', id: todoListId}
						))
				})
})

const createTodoListTC =
		createAppAsyncThunk<TodoListDomainType, string>(
				'todoList/createTodoList',
				async (title, thunkAPI) => {
						const {dispatch, rejectWithValue} = thunkAPI
						return thunkTryCatch(thunkAPI,
								async () => {
										const res = await TodolistApi.createTodoList(title)
										if (res.data.resultCode === ResponseCode.Ok) {
												return res.data.data.item
										} else {
												handleServerAppError(res.data, dispatch, false)
												return rejectWithValue(res.data)
										}
								})
				})

type UpdateTodoListOutputArgType = {
		title: string,
		todoListId: string
}

const updateTodoListTitleTC =
		createAppAsyncThunk<UpdateTodoListOutputArgType, UpdateTodoListOutputArgType>
		('todoList/updateTodoListTitle',
				async (arg, thunkAPI) => {
						const {title, todoListId} = arg
						const {dispatch, rejectWithValue} = thunkAPI

						dispatch(todoListsActions.changeTodolistEntityStatus(
								{entityStatus: 'loading', id: todoListId}))

						return thunkTryCatch(thunkAPI,
								async () => {
										const res = await TodolistApi.changeTitleTodoList(title, todoListId)
										if (res.data.resultCode === ResponseCode.Ok) {
												dispatch(todoListsActions.changeTodolistEntityStatus(
														{entityStatus: 'succeeded', id: todoListId}))
												return {title, todoListId}
										} else {
												handleServerAppError(res.data, dispatch)
												dispatch(todoListsActions.changeTodolistEntityStatus(
														{entityStatus: 'failed', id: todoListId}))
												return rejectWithValue(null)
										}
								},
								() => {
										dispatch(todoListsActions.changeTodolistEntityStatus(
												{entityStatus: 'failed', id: todoListId}))
								})
				})


export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions
export const todoListThunk = {fetchTodoListsTC, removeTodoListTC, createTodoListTC, updateTodoListTitleTC}