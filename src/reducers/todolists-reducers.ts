import {TodoListType} from "../Components/AppWithRedux";
import {v1} from "uuid";
import {FilterType} from "../Components/TodolistWithRedux";
import {TodoListDomainType} from "../api/todolist-api";

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
    | setTodoListTypeAction

export const tdlId_1 = v1()
export const tdlId_2 = v1()

const initialState: TodoListType[] = [
    // {id: tdlId_1, title: 'What to learn',  addedData: '',  order: 0},
    // {id: tdlId_2, title: 'What to buy', addedData: '',  order: 0}
]

// export type

export const todolistsReducer = (state: TodoListType[] = initialState, action: ActionsType): TodoListType[] => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todos.map(t => ({...t, filter: 'all'}))
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

export const AddTodolistAC = (title: string): AddTodolistAT => {
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

export const setTodoList =
    (todos: TodoListType[]): setTodoListTypeAction => {
    return {
        type: 'SET-TODOLIST',
        todos
    }
}

export type setTodoListTypeAction = {
    type: 'SET-TODOLIST'
    todos: TodoListType[]
}

