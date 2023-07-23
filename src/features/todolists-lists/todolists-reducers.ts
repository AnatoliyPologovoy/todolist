import {ResponseCode, TodolistApi, TodoListDomainType} from "features/todolists-lists/todolist-api";
import {FilterType, tasksThunks, ThunkAction} from "features/todolists-lists/tasks/tasks-reducers";
import {RequestStatusType} from "app/app-reducer";
import {createAppAsyncThunk} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authThunk} from "features/auth/auth-reducer";
import {isActionUpdateOrRemoveTodolist} from "common/utils/isActionUpdateOrRemoveTodolist";
import {changeTodolistEntityStatus} from "common/utils/changeTodolistEntityStatus";

export type TodoListType = {
		filter: FilterType
		entityStatus: RequestStatusType
} & TodoListDomainType

type UpdateTodoListArgType = {
		title: string,
		todoListId: string
}

export type commonTodoListArgType = UpdateTodoListArgType | string


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
						.addMatcher((action) => {
										return isActionUpdateOrRemoveTodolist(action, 'pending')
								},
								(state, action: ThunkAction<commonTodoListArgType, any>) => {
										changeTodolistEntityStatus(state, action.meta.arg, 'loading')
								})
						.addMatcher((action) => {
										return isActionUpdateOrRemoveTodolist(action, 'fulfilled')
								},
								(state, action: ThunkAction<commonTodoListArgType, any>) => {
										changeTodolistEntityStatus(state, action.meta.arg, 'succeeded')
								})
						.addMatcher((action) => {
										return isActionUpdateOrRemoveTodolist(action, 'rejected')
								},
								(state, action: ThunkAction<commonTodoListArgType, any>) => {
										changeTodolistEntityStatus(state, action.meta.arg, 'failed')
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
				}
				// catch (e) {
				// 		return rejectWithValue(null)
				// }
				finally {
						todoLists?.forEach(t => {
								dispatch(tasksThunks.fetchTasksTC(t.id))
						})
				}
		})

const removeTodoListTC = createAppAsyncThunk<string, string>
('todoList/removeTodolist',
		async (todoListId, thunkAPI) => {
				const {rejectWithValue} = thunkAPI
				const res = await TodolistApi.removeTodoList(todoListId)
				if (res.data.resultCode === ResponseCode.Ok) {
						return todoListId
				} else {
						return rejectWithValue(res.data)
				}
		})

const createTodoListTC =
		createAppAsyncThunk<TodoListDomainType, string>(
				'todoList/createTodoList',
				async (title, thunkAPI) => {
						const {rejectWithValue} = thunkAPI
						const res = await TodolistApi.createTodoList(title)
						if (res.data.resultCode === ResponseCode.Ok) {
								return res.data.data.item
						} else {
								return rejectWithValue(res.data)
						}
				})


const updateTodoListTitleTC =
		createAppAsyncThunk<UpdateTodoListArgType, UpdateTodoListArgType>
		('todoList/updateTodoListTitle',
				async (arg, thunkAPI) => {
						const {title, todoListId} = arg
						const {rejectWithValue} = thunkAPI
						const res = await TodolistApi.changeTitleTodoList(title, todoListId)
						if (res.data.resultCode === ResponseCode.Ok) {
								return {title, todoListId}
						} else {
								return rejectWithValue(res.data)
						}
				})


export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions
export const todoListThunk = {fetchTodoListsTC, removeTodoListTC, createTodoListTC, updateTodoListTitleTC}