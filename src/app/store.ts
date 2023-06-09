import {applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import {ActionsTaskType, tasksReducer} from "../reducers/task-reducers";
import {ActionsTodoListType, todolistsReducer} from "../reducers/todolists-reducers";
import thunk, { ThunkDispatch } from 'redux-thunk'

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//все actions приложение
export type AppActionsType = ActionsTaskType | ActionsTodoListType

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;