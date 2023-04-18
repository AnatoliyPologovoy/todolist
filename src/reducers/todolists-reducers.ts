import {TodoListType} from "../App";
import {v1} from "uuid";
import {FilterType} from "../Todolist";

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
}

export type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    id: string
}

export type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterType
    id: string
}

export type ActionsType = RemoveTodolistAT | AddTodolistAT | ChangeTodolistTitleAT | ChangeTodolistFilterAT

export const todolistsReducers = (state: TodoListType[], action: ActionsType): TodoListType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tdl => tdl.id !== action.id)
        case "ADD-TODOLIST":
            const newTodo: TodoListType = {
                id: v1(),
                title: action.title,
                filter: 'all'
            }
            return ([...state, newTodo])
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tdl => tdl.id === action.id ? {...tdl, title: action.title} : tdl)
        case  "CHANGE-TODOLIST-FILTER":
            return state.map(tdl => {
                return tdl.id === action.id ? {...tdl, filter: action.filter} : tdl
            })

        default:
            return state
    }
}

export const RemoveTodolistAC = (id: string):RemoveTodolistAT => {
    return {
        type: "REMOVE-TODOLIST",
        id
    }
}
export const AddTodolostAC = (title: string):AddTodolistAT => {
    return {
        type: "ADD-TODOLIST",
        title
    }
}
export const ChangeTodolistTitleAC = (title: string, id: string): ChangeTodolistTitleAT => {
    return {
        type: "CHANGE-TODOLIST-TITLE",
        title,
        id
    }
}
export const ChangeTodolistFilterAC = (filter: FilterType, id: string): ChangeTodolistFilterAT => {
    return {
        type: "CHANGE-TODOLIST-FILTER",
        filter,
        id
    }
}
