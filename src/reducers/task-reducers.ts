import {AddTodolistAT, RemoveTodolistAT, setTodoListTypeAction} from "./todolists-reducers";
import {ResponseCode, TaskRequestType, TaskResponseType, TaskStatues, TodolistApi} from "api/todolist-api";
import {AppRootStateType, AppThunk} from "app/store";
import {appActions, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>

export type addTaskAT = ReturnType<typeof createTaskAC>
export type ChangeStatusTask = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitle = ReturnType<typeof changeTaskTitleAC>
export type SetTasks = ReturnType<typeof setTasksAC>
export type ChangeTask = ReturnType<typeof changeTaskAC>
export type  changeTaskEntityStatusType = ReturnType<typeof changeTaskEntityStatus>

export type TaskActionsType =
    RemoveTaskAT |
    addTaskAT |
    ChangeStatusTask |
    changeTaskTitle |
    AddTodolistAT |
    RemoveTodolistAT |
    setTodoListTypeAction |
    SetTasks |
    ChangeTask |
    changeTaskEntityStatusType

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type TaskType = TaskResponseType & {
    entityStatus: RequestStatusType
}

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

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {
                ...state, [action.todoListId]: action.tasks.map(t => (
                    {...t, entityStatus: 'idle'}))
            }
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
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case "CHANGE-TASK":
            return {
                ...state, [action.task.todoListId]: state[action.task.todoListId].map(t => {

                    return t.id === action.task.id ? {...action.task, entityStatus: 'idle'} : t
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
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.payload.id]: []}
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

export const changeTaskEntityStatus
    = (taskId: string, entityStatus: RequestStatusType, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        taskId,
        entityStatus,
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
    (task: TaskResponseType) => {
        return {
            type: 'CHANGE-TASK',
            task
        } as const
    }

//thunk
export const setTasksTC =
    (todoListId: string): AppThunk => (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        TodolistApi.getTasks(todoListId)
            .then(res => {
                dispatch(setTasksAC(todoListId, res.data.items))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
        })
    }

export const removeTaskTC
    = (todoListId: string, taskId: string): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(changeTaskEntityStatus(taskId, 'loading', todoListId))
        TodolistApi.removeTask(todoListId, taskId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(removeTaskAC(taskId, todoListId))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTaskEntityStatus(taskId, 'failed', todoListId))
                }
            })
            .catch((er) => {
                handleServerNetworkError(er, dispatch)
                dispatch(changeTaskEntityStatus(taskId, 'failed', todoListId))
            })
    }

export const createTaskTC = (
    todoListId: string,
    title: string,
    setRejectTitle: (title: string) => void
): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        TodolistApi.createTask(todoListId, title)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(createTaskAC(res.data.data.item))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    //Set title in local state AddItemForm
                    setRejectTitle(title)
                }
            })
            .catch((er) => {
                //Set title in local state AddItemForm
                setRejectTitle(title)
                handleServerNetworkError(er, dispatch)
            })
    }


export const changeTaskTC = (
    todoListId: string,
    taskId: string,
    changeValue: TaskRequestType,
    setRejectTitle: ((title: string) => void) | null = null
): AppThunk => {
    return (dispatch,
            getState: () => AppRootStateType) => {
        let requestBody = getState()
            .tasks[todoListId].find(t => t.id === taskId)
        if (requestBody) {
            requestBody = {...requestBody, ...changeValue}
            dispatch(appActions.setAppStatus({status: 'loading'}))
            dispatch(changeTaskEntityStatus(taskId, 'loading', todoListId))

            TodolistApi.changeTask(todoListId, taskId, requestBody)
                .then(res => {
                    if (res.data.resultCode === ResponseCode.Ok) {
                        dispatch(changeTaskAC(res.data.data.item))
                        dispatch(appActions.setAppStatus({status: 'succeeded'}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                        dispatch(changeTaskEntityStatus(taskId, 'failed', todoListId))
                        //Saved title
                        changeValue?.title && setRejectTitle &&
                        setRejectTitle(changeValue.title)
                    }
                })
                .catch((er) => {
                    handleServerNetworkError(er, dispatch)
                    dispatch(changeTaskEntityStatus(taskId, 'failed', todoListId))
                    //Saved title
                    changeValue?.title && setRejectTitle &&
                    setRejectTitle(changeValue.title)
                })
        }
    }
}


