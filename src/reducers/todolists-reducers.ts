import {ResponseCode, TodolistApi, TodoListDomainType} from "../api/todolist-api";
import {FilterType} from "./task-reducers";
import {Dispatch} from "redux";
import {
    AppActionsType,
    RequestStatusType,
    setAppError,
    setAppStatus,
    setRejectedRequestChangeTitle,
    setRejectedRequestNewTitle
} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        title: string
        id: string
    }
}

export type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        filter: FilterType
        id: string
    }
}

export type AddTodolistAT = ReturnType<typeof createTodolistAC>
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatus>

export type ActionsTodoListType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistTitleAT
    | ChangeTodolistFilterAT
    | setTodoListTypeAction
    | ChangeTodolistEntityStatusType

export type TodoListType = {
    filter: FilterType
    entityStatus: RequestStatusType
} & TodoListDomainType


const initialState: TodoListType[] = []

export const todolistsReducer = (state: TodoListType[] = initialState, action: ActionsTodoListType): TodoListType[] => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todos.map(t => ({
                ...t,
                filter: 'all',
                entityStatus: 'idle'
            }))
        case "REMOVE-TODOLIST":
            return state.filter(td => td.id !== action.payload.id)
        case "ADD-TODOLIST":
            const newTdl: TodoListType = {
                ...action.payload,
                filter: "all",
                entityStatus: 'idle'
            }
            return [newTdl, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(td => td.id === action.payload.id ?
                {...td, title: action.payload.title} : td)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(td => td.id === action.payload.id ?
                {...td, filter: action.payload.filter} : td)
        case "CHANGE-ENTITY-STATUS":
            return state.map(td => td.id === action.payload.id ?
                {...td, entityStatus: action.payload.entityStatus} : td)
        default:
            return state
    }
}

export const RemoveTodolistAC = (id: string): RemoveTodolistAT => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    }
}

export const createTodolistAC = (todoItem: TodoListDomainType) => {
    return {
        type: "ADD-TODOLIST",
        payload: todoItem
    } as const
}

export const changeTodolistTitleAC =
    (title: string, id: string): ChangeTodolistTitleAT => {
        return {
            type: "CHANGE-TODOLIST-TITLE",
            payload: {
                title,
                id
            }
        }
    }

export const changeTodolistFilter =
    (filter: FilterType, id: string): ChangeTodolistFilterAT => {
        return {
            type: "CHANGE-TODOLIST-FILTER",
            payload: {
                filter,
                id
            }
        }
    }

export const changeTodolistEntityStatus =
    (entityStatus: RequestStatusType, id: string) => {
        return {
            type: "CHANGE-ENTITY-STATUS",
            payload: {
                entityStatus,
                id
            }
        } as const
    }

export const setTodoList =
    (todos: TodoListDomainType[]): setTodoListTypeAction => {
        return {
            type: 'SET-TODOLIST',
            todos
        }
    }

export type setTodoListTypeAction = {
    type: 'SET-TODOLIST'
    todos: TodoListDomainType[]
}

//thunk
export const fetchTodoListsTC =
    () => (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        TodolistApi.getTodoLists()
            .then((res) => {
                dispatch(setTodoList(res.data))
                dispatch(setAppStatus('succeeded'))
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
        })
    }

export const removeTodoListTC = (todoListId: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatus('loading', todoListId))
        TodolistApi.removeTodoList(todoListId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(RemoveTodolistAC(todoListId))
                    dispatch(setAppStatus('succeeded'))
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

export const tempIdTodo = 'newTodo'

export const createTodoListTC = (title: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        //clearing rejectedRequestTitle:
        dispatch(setRejectedRequestNewTitle(tempIdTodo, ''))
        TodolistApi.createTodoList(title)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {

                    dispatch(createTodolistAC(res.data.data.item))
                    dispatch(setAppStatus('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                    //Saved title
                    dispatch(setRejectedRequestNewTitle(tempIdTodo, title))
                }
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
            //Saved title
            dispatch(setRejectedRequestNewTitle(tempIdTodo, title))
        })
    }
}

export const changeTodoListTitleTC = (title: string, todoId: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatus('loading', todoId))
        //clearing rejectedRequestTitle:
        dispatch(setRejectedRequestChangeTitle(todoId, ''))

        TodolistApi.changeTitleTodoList(title, todoId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(changeTodolistTitleAC(title, todoId))
                    dispatch(setAppStatus('succeeded'))
                    dispatch(changeTodolistEntityStatus('succeeded', todoId))

                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTodolistEntityStatus('failed', todoId))
                    //Saved title
                    dispatch(setRejectedRequestChangeTitle(todoId, title))
                }
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
            dispatch(changeTodolistEntityStatus('failed', todoId))
            //Saved title
            dispatch(setRejectedRequestChangeTitle(todoId, title))
        })
    }
}