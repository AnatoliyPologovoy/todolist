import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {TaskActionsType, tasksReducer} from "../reducers/task-reducers";
import {TodoListActionsType, todolistsReducer} from "../reducers/todolists-reducers";
import thunk, {ThunkDispatch} from 'redux-thunk'
import {AppActionsType, appReducer} from "../reducers/app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AuthActionsType, authReducer} from "../reducers/Auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//все actions приложение
export type AppAllActionsType =
    | TaskActionsType
    | TodoListActionsType
    | AppActionsType
    | AuthActionsType

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AppAllActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
//
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
//TypedUseSelectorHook - это типизированный хук,
// который используется для получения типа возвращаемого значения хука useSelector.
