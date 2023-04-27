import {TasksStateType, TodoListType} from "../App";
import {v1} from "uuid";
import {FilterType} from "../Todolist";
import {AddTodolistAT, ChangeTodolistFilterAT, RemoveTodolistAT} from "./todolists-reducers";

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>
//     {
//     type: 'REMOVE-TASK'
//     id: string
//     taskId: string
// }

export type addTaskAT = ReturnType<typeof addTaskAC>
export type ChangeStatusTask = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitle = ReturnType<typeof changeTaskTitleAC>
export type ActionsType =
    RemoveTaskAT |
    addTaskAT |
    ChangeStatusTask |
    changeTaskTitle |
    AddTodolistAT |
    RemoveTodolistAT



export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {...state,
                [action.todolistId]: state[action.todolistId].filter(t=> t.id !== action.taskId) }
        case "ADD-TASK":
            const newTask = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return {
                ...state, [action.taskId]: [newTask, ...state[action.taskId]]
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, isDone: action.status} : t)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, title: action.newTitle} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.payload.todolistId]: []}
        case "REMOVE-TODOLIST":
            const newState = {...state}
            delete newState[action.payload.id]
            return newState
    }
    return state
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        todolistId,
        taskId
    } as const
}

export const addTaskAC = (title: string, taskId: string) => {
    return {
        type: 'ADD-TASK',
        title,
        taskId
    } as const
}

export const changeTaskStatusAC = (taskId: string, status: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        status,
        todolistId
    } as const
}

export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        newTitle,
        todolistId
    } as const
}