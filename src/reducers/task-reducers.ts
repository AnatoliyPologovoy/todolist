import {
    ResponseCode,
    TaskRequestType,
    TaskResponseType,
    TaskStatues,
    TodolistApi,
    TodoListDomainType
} from "api/todolist-api";
import {AppRootStateType, AppThunk} from "app/store";
import {appActions, RequestStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todoListsActions} from "reducers/todolists-reducers";

// export type RemoveTaskAT = ReturnType<typeof removeTask>
//
// export type addTaskAT = ReturnType<typeof createTask>
// export type ChangeStatusTask = ReturnType<typeof changeTaskStatusAC>
// export type changeTaskTitle = ReturnType<typeof changeTaskTitleAC>
// export type SetTasks = ReturnType<typeof setTasks>
// export type ChangeTask = ReturnType<typeof updateTask>
// export type  changeTaskEntityStatusType = ReturnType<typeof changeTaskEntityStatus>
//
// export type TaskActionsType =
//     RemoveTaskAT |
//     addTaskAT |
//     ChangeStatusTask |
//     changeTaskTitle |
//     SetTasks |
//     ChangeTask |
//     changeTaskEntityStatusType

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
    // ]
}

const slice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<{ todoListId: string, tasks: TaskResponseType[] }>) {
            state[action.payload.todoListId] = action.payload.tasks.map(t => (
                {...t, entityStatus: 'idle'}))
        },
        removeTask(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        updateTask(state, action: PayloadAction<{ task: TaskResponseType }>) {
            const tasks = state[action.payload.task.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.task.id)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.task}
        },
        createTask(state, action: PayloadAction<{ task: TaskResponseType }>) {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift({...action.payload.task, entityStatus: 'idle'})
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ taskId: string, entityStatus: RequestStatusType, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: builder => {
        builder
            .addCase(todoListsActions.setTodoList,
                (state, action) => {
                    action.payload.todos.forEach(t => {
                        state[t.id] = []
                    })
                })
            .addCase(todoListsActions.createTodolist,
                (state, action) => {
                    state[action.payload.todoItem.id] = []
                })
            .addCase(todoListsActions.removeTodolist,
                (state, action) => {
                    delete state[action.payload.id]
                })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// export const _tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
//     switch (action.type) {
//         case "SET-TASKS":
//             return {
//                 ...state, [action.todoListId]: action.tasks.map(t => (
//                     {...t, entityStatus: 'idle'}))
//             }
//         case "SET-TODOLIST":
//             const copyState = {...state}
//             action.todos.forEach(t => {
//                 return copyState[t.id] = []
//             })
//             return copyState
//         case "REMOVE-TASK":
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
//             }
//         case "CREATE-TASK":
//             return {
//                 ...state,
//                 [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
//             }
//         case "CHANGE-TASK":
//             return {
//                 ...state, [action.task.todoListId]: state[action.task.todoListId].map(t => {
//
//                     return t.id === action.task.id ? {...action.task, entityStatus: 'idle'} : t
//                 })
//             }
//         case "CHANGE-TASK-STATUS":
//             return {
//                 ...state, [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
//             }
//         case "CHANGE-TASK-TITLE":
//             return {
//                 ...state, [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, title: action.newTitle} : t)
//             }
//         case "CHANGE-TASK-ENTITY-STATUS":
//             return {
//                 ...state, [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)
//             }
//         case "ADD-TODOLIST":
//             return {...state, [action.payload.id]: []}
//         case "REMOVE-TODOLIST":
//             const newState = {...state}
//             delete newState[action.payload.id]
//             return newState
//         default:
//             return state
//     }
//
// }
//
// export const removeTask = (taskId: string, todolistId: string) => {
//     return {
//         type: 'REMOVE-TASK',
//         todolistId,
//         taskId
//     } as const
// }
//
// export const createTask = (task: TaskResponseType) => {
//     return {
//         type: 'CREATE-TASK',
//         task
//     } as const
// }
//
// export const changeTaskStatusAC = (taskId: string, status: TaskStatues, todolistId: string) => {
//     return {
//         type: 'CHANGE-TASK-STATUS',
//         taskId,
//         status,
//         todolistId
//     } as const
// }
//
// export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string) => {
//     return {
//         type: 'CHANGE-TASK-TITLE',
//         taskId,
//         newTitle,
//         todolistId
//     } as const
// }
//
// export const changeTaskEntityStatus
//     = (taskId: string, entityStatus: RequestStatusType, todolistId: string) => {
//     return {
//         type: 'CHANGE-TASK-ENTITY-STATUS',
//         taskId,
//         entityStatus,
//         todolistId
//     } as const
// }
//
// export const setTasks = (todoListId: string, tasks: TaskResponseType[]) => {
//     return {
//         type: 'SET-TASKS',
//         todoListId,
//         tasks
//     } as const
// }
//
// export const updateTask =
//     (task: TaskResponseType) => {
//         return {
//             type: 'CHANGE-TASK',
//             task
//         } as const
//     }

//thunk
export const setTasksTC =
    (todoListId: string): AppThunk => (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        TodolistApi.getTasks(todoListId)
            .then(res => {
                dispatch(tasksActions.setTasks(
                    {todoListId: todoListId, tasks: res.data.items}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            }).catch((er) => {
            handleServerNetworkError(er, dispatch)
        })
    }

export const removeTaskTC
    = (todoListId: string, taskId: string): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(tasksActions.changeTaskEntityStatus(
            {taskId,entityStatus: 'loading',todoListId}))
        TodolistApi.removeTask(todoListId, taskId)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(tasksActions.removeTask({taskId, todoListId}))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(tasksActions.changeTaskEntityStatus(
                        {taskId, entityStatus: 'failed', todoListId}))
                }
            })
            .catch((er) => {
                handleServerNetworkError(er, dispatch)
                dispatch(tasksActions.changeTaskEntityStatus(
                    {taskId, entityStatus: 'failed', todoListId}))
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
                    dispatch(tasksActions.createTask({task: res.data.data.item}))
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
            dispatch(tasksActions.changeTaskEntityStatus(
                {taskId,entityStatus: 'loading',todoListId}))

            TodolistApi.changeTask(todoListId, taskId, requestBody)
                .then(res => {
                    if (res.data.resultCode === ResponseCode.Ok) {
                        dispatch(tasksActions.updateTask({task: res.data.data.item}))
                        dispatch(appActions.setAppStatus({status: 'succeeded'}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                        dispatch(tasksActions.changeTaskEntityStatus(
                            {taskId, entityStatus: 'failed', todoListId}))
                        //Saved title
                        changeValue?.title && setRejectTitle &&
                        setRejectTitle(changeValue.title)
                    }
                })
                .catch((er) => {
                    handleServerNetworkError(er, dispatch)
                    dispatch(tasksActions.changeTaskEntityStatus(
                        {taskId, entityStatus: 'failed', todoListId}))
                    //Saved title
                    changeValue?.title && setRejectTitle &&
                    setRejectTitle(changeValue.title)
                })
        }
    }
}


