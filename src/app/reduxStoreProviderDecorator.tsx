import React from 'react'
import { Provider } from 'react-redux'
import { AppRootStateType, store } from './store'
import { combineReducers, legacy_createStore } from 'redux'
import { tasksReducer } from 'features/todolists-lists/tasks/tasks-reducers'
import { todoListsReducer } from 'features/todolists-lists/todolists-reducers'
import { v1 } from 'uuid'
import {
    TaskPriorities,
    TaskStatues,
} from 'features/todolists-lists/todolist-api'
import { appReducer } from 'app/app-reducer'
import { authReducer } from 'features/auth/auth-reducer'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

const todolistId1 = v1()
const todolistId2 = v1()

const initialGlobalState = {
    todolists: [
        {
            id: todolistId1,
            title: 'What to learn',
            filter: 'all',
            addedData: new Date(),
            order: 0,
            entityStatus: 'idle',
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: 'all',
            addedData: new Date(),
            order: 0,
            entityStatus: 'idle',
        },
    ],
    tasks: {
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatues.New,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId1',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatues.Completed,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId1',
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatues.Completed,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId1',
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'bread',
                status: TaskStatues.Completed,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId2',
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatues.New,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId2',
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatues.Completed,
                description: '',
                entityStatus: 'idle',
                completed: false,
                priority: TaskPriorities.Low,
                startDate: new Date(),
                addedDate: new Date(),
                order: 0,
                deadline: new Date(),
                todoListId: 'todolistId2',
            },
        ],
    },
    app: {
        status: 'idle',
        error: null,
    },
    auth: {
        isLoginIn: false,
        isInitialized: false,
    },
}

export const storyBookStore = legacy_createStore(
    rootReducer,
    initialGlobalState as AppRootStateType,
)

export const reduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
