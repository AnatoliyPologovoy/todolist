import {ResponseCode, TodolistApi, TodoListDomainType} from "api/todolist-api";
import {FilterType} from "./task-reducers";
import {appActions, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TodoListType = {
    filter: FilterType
    entityStatus: RequestStatusType
} & TodoListDomainType

const initialState: TodoListType[] = []

const slice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string}>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
            //2 way
            // return state.filter((tl) => tl.id != action.payload.id);
            //использовать return если изменяется весь стейт целиком, будь то массив или обьект
        },
        createTodolist(state, action: PayloadAction<{todoItem: TodoListDomainType}>) {
            const newTdl: TodoListType = {
                ...action.payload.todoItem,
                filter: "all",
                entityStatus: 'idle'
            }
            state.unshift(newTdl)
        },
        changeTodolistTitle(state, action: PayloadAction<{title: string, id: string}>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index) state[index].title = action.payload.title
        },
        changeTodolistFilter(state, action: PayloadAction<{filter: FilterType, id: string}>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{
            entityStatus: RequestStatusType,
            id: string
        }>) {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index) state[index].entityStatus = action.payload.entityStatus
        },
        setTodoList(state, action: PayloadAction<{todos: TodoListDomainType[]}>) {
            return action.payload.todos.map(t => ({
                ...t,
                filter: 'all',
                entityStatus: 'idle'
            }))
        }
    }
})

export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions


//thunk
export const fetchTodoListsTC =
    (): AppThunk => (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        TodolistApi.getTodoLists()
            .then((res) => {
                dispatch(setTodoList(res.data))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
        })
    }

export const removeTodoListTC = (todoListId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatus('loading', todoListId))
        TodolistApi.removeTodoList(todoListId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(removeTodolist(todoListId))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                    dispatch(changeTodolistEntityStatus('succeeded', todoListId))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTodolistEntityStatus('failed', todoListId))
                }
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
            dispatch(changeTodolistEntityStatus('failed', todoListId))
        })
    }
}

export const createTodoListTC = (
    title: string,
    setRejectTitle: (title: string) => void
): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        TodolistApi.createTodoList(title)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {

                    dispatch(createTodolist(res.data.data.item))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    //Set title in local state AddItemForm
                    setRejectTitle(title)
                }
            }).catch((er) => {
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
        dispatch(changeTodolistEntityStatus('loading', todoId))

        TodolistApi.changeTitleTodoList(title, todoId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(changeTodolistTitle(title, todoId))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                    dispatch(changeTodolistEntityStatus('succeeded', todoId))

                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTodolistEntityStatus('failed', todoId))
                    //Set title in local state EditableSpan
                    setRejectTitle(title)
                }
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
            dispatch(changeTodolistEntityStatus('failed', todoId))
            //Set title in local state EditableSpan
            setRejectTitle(title)
        })
    }
}