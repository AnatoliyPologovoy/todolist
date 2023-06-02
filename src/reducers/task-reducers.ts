import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT, setTodoListTypeAction} from "./todolists-reducers";
import {TaskPriorities, TaskResponseType, TaskStatues} from "../api/todolist-api";

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>

export type addTaskAT = ReturnType<typeof addTaskAC>
export type ChangeStatusTask = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitle = ReturnType<typeof changeTaskTitleAC>
export type ActionsTaskType =
    RemoveTaskAT |
    addTaskAT |
    ChangeStatusTask |
    changeTaskTitle |
    AddTodolistAT |
    RemoveTodolistAT |
    setTodoListTypeAction

export type TasksStateType = {
    [key: string]: TaskResponseType[]
}

// export type TaskType = {
//     id: string,
//     title: string,
//     isDone: boolean
// }

export type FilterType = 'all' | 'complied' | 'active'

const initialState: TasksStateType = {
    // [tdlId_1]: [
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    //     {id: v1(), title: "JS", isDone: true},
    //     {id: v1(), title: "ReactJS", isDone: false},
    //     {id: v1(), title: "Redux", isDone: false},
    //     {id: v1(), title: "SQL", isDone: false},
    // ],
    // [tdlId_2]: [
    //     {id: v1(), title: "Milk", isDone: false},
    //     {id: v1(), title: "Egs", isDone: true},
    //     {id: v1(), title: "Bread", isDone: false},
    // ]
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsTaskType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const copyState = {...state}
            action.todos.forEach(t => {
                return copyState[t.id] = []
            })
            return copyState
        case "REMOVE-TASK":
            return {...state,
                [action.todolistId]: state[action.todolistId].filter(t=> t.id !== action.taskId) }
        case "ADD-TASK":
            const newTask:TaskResponseType  = {
                id: v1(),
                title: action.title,
                status: TaskStatues.New,
                description: '',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: (new Date),
                deadline: (new Date),
                todoListId: action.todolistId,
                order: 0,
                addedDate: (new Date)
            }
            return {
                ...state, [action.todolistId]: [newTask, ...state[action.todolistId]]
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
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
        default:
            return state
    }

}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        todolistId,
        taskId
    } as const
}

export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        title,
        todolistId
    } as const
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatues, todolistId: string) => {
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