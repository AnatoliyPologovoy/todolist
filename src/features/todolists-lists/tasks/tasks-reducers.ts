import {
    ResponseCode,
    TaskRequestUpdateType,
    TaskResponseType,
    TodolistApi,
    UpdateTaskModelType,
} from 'features/todolists-lists/todolist-api'
import { appActions, RequestStatusType } from 'app/app-reducer'
import {
    changeTaskEntityStatus,
    isActionUpdateOrRemoveTask,
} from 'common/utils'
import { todoListThunk } from 'features/todolists-lists/todolists-reducers'
import { authThunk } from 'features/auth/auth-reducer'
import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'
import { createSlice } from '@reduxjs/toolkit'

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type TaskType = TaskResponseType & {
    entityStatus: RequestStatusType
}

export type FilterType = 'all' | 'complied' | 'active'

export type updateTaskThunkArgType = {
    todoListId: string
    taskId: string
    changeValue: TaskRequestUpdateType
}

export type removeTaskThunkArgType = {
    todoListId: string
    taskId: string
}

export type commonTaskThunkArgType = removeTaskThunkArgType

export type ThunkAction<ThunkArg, PromiseResult> = {
    type: string
    payload: PromiseResult
    error?: {
        name?: string
        message?: string
        stack?: string
        code?: string
    }
    meta: {
        requestId: string
        arg: ThunkArg
    }
}

export type PromiseStatusType = 'pending' | 'fulfilled' | 'rejected'

const initialState: TasksStateType = {
    // [tdlId_1]: [
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    // ]
}

const slice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift({ ...action.payload.task, entityStatus: 'idle' })
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(
                    (t) => t.id === action.payload.taskId,
                )
                if (index !== -1)
                    tasks[index] = {
                        ...tasks[index],
                        ...action.payload.changeValue,
                    }
            })
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks.map(
                    (t) => ({ ...t, entityStatus: 'idle' }),
                )
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(
                    (t) => t.id === action.payload.taskId,
                )
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(
                todoListThunk.fetchTodoListsTC.fulfilled,
                (state, action) => {
                    action.payload.todoLists.forEach((t) => {
                        state[t.id] = []
                    })
                },
            )
            .addCase(
                todoListThunk.createTodoListTC.fulfilled,
                (state, action) => {
                    state[action.payload.id] = []
                },
            )
            .addCase(
                todoListThunk.removeTodoListTC.fulfilled,
                (state, action) => {
                    delete state[action.payload]
                },
            )
            //logout case - clean state
            .addCase(authThunk.logout.fulfilled, (state, action) => {
                if (!action.payload.isLoginIn) return initialState
            })
            // change EntityStatus
            .addMatcher(
                (action) => {
                    return isActionUpdateOrRemoveTask(action, 'pending')
                },
                (state, action: ThunkAction<commonTaskThunkArgType, any>) => {
                    changeTaskEntityStatus(state, action.meta.arg, 'loading')
                },
            )
            .addMatcher(
                (action) => {
                    return isActionUpdateOrRemoveTask(action, 'fulfilled')
                },
                (state, action: ThunkAction<commonTaskThunkArgType, any>) => {
                    changeTaskEntityStatus(state, action.meta.arg, 'succeeded')
                },
            )
            .addMatcher(
                (action) => {
                    return isActionUpdateOrRemoveTask(action, 'rejected')
                },
                (state, action: ThunkAction<commonTaskThunkArgType, any>) => {
                    changeTaskEntityStatus(state, action.meta.arg, 'failed')
                },
            )
    },
})

const fetchTasksTC = createAppAsyncThunk<
    { todoListId: string; tasks: TaskResponseType[] },
    string
>('tasks/setTasks', async (todoListId) => {
    const res = await TodolistApi.getTasks(todoListId)
    return { todoListId: todoListId, tasks: res.data.items }
})

const removeTaskTC = createAppAsyncThunk<
    removeTaskThunkArgType,
    removeTaskThunkArgType
>('tasks/removeTasks', async ({ todoListId, taskId }, thunkAPI) => {
    const res = await TodolistApi.removeTask({ todoListId, taskId })
    if (res.data.resultCode === ResponseCode.Ok) {
        return { taskId, todoListId }
    } else {
        return thunkAPI.rejectWithValue(res.data)
    }
})

const createTaskTC = createAppAsyncThunk<
    { task: TaskResponseType },
    { todoListId: string; title: string }
>('tasks/createTask', async ({ todoListId, title }, thunkAPI) => {
    const res = await TodolistApi.createTask({ todoListId, title })
    if (res.data.resultCode === ResponseCode.Ok) {
        return { task: res.data.data.item }
    } else {
        return thunkAPI.rejectWithValue(res.data)
    }
})

const updateTaskTC = createAppAsyncThunk<
    updateTaskThunkArgType,
    updateTaskThunkArgType
>('task/updateTask', async ({ todoListId, taskId, changeValue }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI

    const state = getState()
    const task = state.tasks[todoListId].find((t) => t.id === taskId)

    if (!task) {
        return rejectWithValue('task not found')
    }

    const requestBody: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        completed: task.completed,
        title: task.title,
        status: task.status,
        ...changeValue, // rewrite new title or status
    }
    const res = await TodolistApi.changeTask(todoListId, taskId, requestBody)
    if (res.data.resultCode === ResponseCode.Ok) {
        return {
            todoListId,
            taskId,
            changeValue,
        }
    } else {
        return rejectWithValue(res.data)
    }
})

export const tasksReducer = slice.reducer
export const tasksThunks = {
    fetchTasksTC,
    removeTaskTC,
    createTaskTC,
    updateTaskTC,
}
