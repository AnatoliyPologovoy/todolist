import {ResponseCode, TodolistApi, TodoListDomainType} from "features/todos/todolist-api";
import {FilterType, tasksThunks} from "features/tasks/tasks-reducers";
import {appActions, RequestStatusType} from "app/app-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions, authThunk} from "features/auth/auth-reducer";

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
				// changeTodolistTitle(state, action: PayloadAction<{ title: string, id: string }>) {
				// 		const index = state.findIndex(t => t.id === action.payload.id)
				// 		if (index) state[index].title = action.payload.title
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

type CreateTodoListTCArgType = {
		title: string,
		setRejectTitle: (title: string) => void
}

const createTodoListTC =
		createAppAsyncThunk<TodoListDomainType, CreateTodoListTCArgType>('todoList/createTodoList',
				async ({title, setRejectTitle}, thunkAPI) => {
						const {dispatch, rejectWithValue} = thunkAPI
						dispatch(appActions.setAppStatus({status: 'loading'}))
						try {
								const res = await TodolistApi.createTodoList(title)
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
										return res.data.data.item
								} else {
										handleServerAppError(res.data, dispatch)
										//Set title in local state AddItemForm
										setRejectTitle(title)
										return rejectWithValue(null)
								}
						} catch (e) {
								handleServerNetworkError(e, dispatch)
								//Set title in local state AddItemForm
								setRejectTitle(title)
								return rejectWithValue(null)
						}
				})

type UpdateTodoListOutputArgType = {
		title: string,
		todoListId: string,
}

type UpdateTodoListInputArgType = UpdateTodoListOutputArgType & {
		setRejectTitle: (title: string) => void
}

const updateTodoListTitleTC =
		createAppAsyncThunk<UpdateTodoListOutputArgType, UpdateTodoListInputArgType>
		('todoList/updateTodoListTitle',
				async (arg, thunkAPI) => {
						const {title, todoListId, setRejectTitle} = arg
						const {dispatch, rejectWithValue} = thunkAPI

						dispatch(appActions.setAppStatus({status: 'loading'}))
						dispatch(todoListsActions.changeTodolistEntityStatus(
								{entityStatus: 'loading', id: todoListId}))
						try {
								const res = await TodolistApi.changeTitleTodoList(title, todoListId)
								if (res.data.resultCode === ResponseCode.Ok) {
										dispatch(appActions.setAppStatus({status: 'succeeded'}))
										dispatch(todoListsActions.changeTodolistEntityStatus(
												{entityStatus: 'succeeded', id: todoListId}))
										return {title, todoListId}

								} else {
										handleServerAppError(res.data, dispatch)
										dispatch(todoListsActions.changeTodolistEntityStatus(
												{entityStatus: 'failed', id: todoListId}))
										//Set title in local state EditableSpan
										setRejectTitle(title)
										return rejectWithValue(null)
								}
						} catch (e) {
								handleServerNetworkError(e, dispatch)
								dispatch(todoListsActions.changeTodolistEntityStatus(
										{entityStatus: 'failed', id: todoListId}))
								//Set title in local state EditableSpan
								setRejectTitle(title)
								return rejectWithValue(null)
						}
				})

// export const _changeTodoListTitleTC = (
// 		title: string,
// 		todoId: string,
// 		setRejectTitle: (title: string) => void
// ): AppThunk => {
// 		return (dispatch) => {
// 				dispatch(appActions.setAppStatus({status: 'loading'}))
// 				dispatch(todoListsActions.changeTodolistEntityStatus(
// 						{entityStatus: 'loading', id: todoId}))
//
// 				TodolistApi.changeTitleTodoList(title, todoId)
// 						.then(res => {
// 								if (res.data.resultCode === ResponseCode.Ok) {
// 										dispatch(todoListsActions.changeTodolistTitle({title, id: todoId}))
// 										dispatch(appActions.setAppStatus({status: 'succeeded'}))
// 										dispatch(todoListsActions.changeTodolistEntityStatus(
// 												{entityStatus: 'succeeded', id: todoId}))
//
// 								} else {
// 										handleServerAppError(res.data, dispatch)
// 										dispatch(todoListsActions.changeTodolistEntityStatus(
// 												{entityStatus: 'failed', id: todoId}))
// 										//Set title in local state EditableSpan
// 										setRejectTitle(title)
// 								}
// 						})
// 						.catch((er) => {
// 								handleServerNetworkError(er, dispatch)
// 								dispatch(todoListsActions.changeTodolistEntityStatus(
// 										{entityStatus: 'failed', id: todoId}))
// 								//Set title in local state EditableSpan
// 								setRejectTitle(title)
// 						})
// 		}
// }

export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions
export const todoListThunk = {fetchTodoListsTC, removeTodoListTC, createTodoListTC, updateTodoListTitleTC}