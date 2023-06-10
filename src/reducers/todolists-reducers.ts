import {TodolistApi, TodoListDomainType} from "../api/todolist-api";
import {FilterType} from "./task-reducers";
import {Dispatch} from "redux";
import {AppActionsType, setAppStatus} from "./app-reducer";

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

export type ActionsTodoListType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistTitleAT
    | ChangeTodolistFilterAT
    | setTodoListTypeAction

export type TodoListType = {
    id: string
    title: string
    filter: FilterType
} & TodoListDomainType


const initialState: TodoListType[] = [
    // {id: tdlId_1, title: 'What to learn',  addedData: '',  order: 0},
    // {id: tdlId_2, title: 'What to buy', addedData: '',  order: 0}
]

export const todolistsReducer = (state: TodoListType[] = initialState, action: ActionsTodoListType): TodoListType[] => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todos.map(t => ({...t, filter: 'all'}))
        case "REMOVE-TODOLIST":
            return state.filter(td => td.id !== action.payload.id)
        case "ADD-TODOLIST":
            const newTdl: TodoListType = {...action.payload, filter: "all"}
            return [newTdl,...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(td => td.id === action.payload.id ?
                {...td, title: action.payload.title} : td)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(td => td.id === action.payload.id ?
                {...td, filter: action.payload.filter} : td)
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

export const ChangeTodolistFilterAC =
    (filter: FilterType, id: string): ChangeTodolistFilterAT => {
        return {
            type: "CHANGE-TODOLIST-FILTER",
            payload: {
                filter,
                id
            }
        }
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
        })
}

export const removeTodoListTC = (todoList: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        TodolistApi.removeTodoList(todoList)
            .then(res => {
                dispatch(RemoveTodolistAC(todoList))
                dispatch(setAppStatus('succeeded'))

            })
    }
}

export const createTodoListTC = (title: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        TodolistApi.createTodoList(title)
            .then(res => {
                dispatch(createTodolistAC(res.data.data.item))
                dispatch(setAppStatus('succeeded'))

            })
    }
}

export const changeTodoListTitleTC = (title: string, todoId: string) => {
    return (dispatch: Dispatch<ActionsTodoListType | AppActionsType>) => {
        dispatch(setAppStatus('loading'))
        TodolistApi.changeTitleTodoList(title, todoId)
            .then(res => {
                dispatch(changeTodolistTitleAC(title, todoId))
                dispatch(setAppStatus('succeeded'))

            })
    }
}