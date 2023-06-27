import {AnyAction, combineReducers} from 'redux';
import {tasksReducer} from "reducers/task-reducers";
import {todoListsReducer} from "reducers/todolists-reducers";
import {appReducer} from "reducers/app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {authReducer} from "reducers/Auth-reducer";
import {configureStore, ThunkAction} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

// непосредственно создаём store
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export const store = configureStore({
    reducer: rootReducer
})

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

//все actions приложение
// export type AppAllActionsType =
//     | TaskActionsType
//     | TodoListActionsType
//     | AppActionsType
//     | AuthActionsType

export type AppThunkDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

// export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AppAllActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
//
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
//TypedUseSelectorHook - это типизированный хук,
// который используется для получения типа возвращаемого значения хука useSelector.
