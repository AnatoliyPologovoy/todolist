import {TodoListType} from "../App";
import {v1} from "uuid";
import {FilterType} from "../Todolist";

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    payload: {
        title: string
        todolistId: string
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

export type ActionsType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistTitleAT
    | ChangeTodolistFilterAT


export const todolistsReducer = (state: TodoListType[], action: ActionsType):TodoListType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(td => td.id !== action.payload.id)
        case "ADD-TODOLIST":
            const newTdl: TodoListType = {
                id: action.payload.todolistId,
                title: action.payload.title,
                filter: "all"
            }
            return [...state, newTdl]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(td => td.id === action.payload.id ?
                {...td, title: action.payload.title} : td)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(td => td.id === action.payload.id ?
                {...td, filter: action.payload.filter} : td)
    }
    return state
}

export const RemoveTodolistAC = (id: string): RemoveTodolistAT => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    }
}

export const AddTodolistAC = (title: string) : AddTodolistAT => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            title,
            todolistId: v1()
        }
    }
}

export const ChangeTodolistTitleAC =
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