import {AddTodolistAT, RemoveTodolistAT, setTodoListTypeAction} from "./todolists-reducers";
import {
    CreateTaskResponseType,
    TaskPriorities,
    TaskRequestType,
    TaskResponseType,
    TaskStatues,
    TodolistApi
} from "../api/todolist-api";
import {Dispatch} from "redux";

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>

export type addTaskAT = ReturnType<typeof createTaskAC>
export type ChangeStatusTask = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitle = ReturnType<typeof changeTaskTitleAC>
export type SetTasks = ReturnType<typeof setTasksAC>
export type ChangeTask = ReturnType<typeof changeTaskAC>

export type ActionsTaskType =
    RemoveTaskAT |
    addTaskAT |
    ChangeStatusTask |
    changeTaskTitle |
    AddTodolistAT |
    RemoveTodolistAT |
    setTodoListTypeAction |
    SetTasks |
    ChangeTask

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
        case "SET-TASKS":
            return {...state, [action.todoListId]: action.tasks}
        case "SET-TODOLIST":
            const copyState = {...state}
            action.todos.forEach(t => {
                return copyState[t.id] = []
            })
            return copyState
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case "CREATE-TASK":
            return {
                ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case "CHANGE-TASK":
            return {
                ...state, [action.task.todoListId]: state[action.task.todoListId].map(t => {
                    return t.id === action.task.id ? action.task : t
                })
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

export const createTaskAC = (task: TaskResponseType) => {
    return {
        type: 'CREATE-TASK',
        task
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

export const setTasksAC = (todoListId: string, tasks: TaskResponseType[]) => {
    return {
        type: 'SET-TASKS',
        todoListId,
        tasks
    } as const
}

export const changeTaskAC =
    (todoListId: string, taskId: string, task: TaskResponseType) => {
        return {
            type: 'CHANGE-TASK',
            todoListId,
            taskId,
            task
        } as const
    }
//thunk
export const setTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    TodolistApi.getTasks(todoListId).then(res => {
        dispatch(setTasksAC(todoListId, res.data.items))
    })
}

export const removeTaskTC = (todoListId: string, taskId: string) => (dispatch: Dispatch) => {
    TodolistApi.removeTask(todoListId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todoListId))
    })
}

export const createTaskTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    TodolistApi.createTask(todoListId, title).then(res => {
        dispatch(createTaskAC(res.data.data.item))
    })
}

export const changeTaskTC =
    (todoListId: string, taskId: string, changeValue: TaskRequestType) => {

        return (dispatch: Dispatch) => {

            TodolistApi.changeTask(todoListId, taskId, changeValue).then(res => {
                dispatch(createTaskAC(res.data.data.item))

            })
        }
    }
