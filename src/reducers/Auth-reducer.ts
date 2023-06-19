import {SetAppErrorType, setAppStatus, SetAppStatusType} from "./app-reducer";
import {Dispatch} from "redux";
import {authAPI, LoginRequestType, ResponseCode} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    isLoginIn: false,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case "AUTH/SET-IS-LOGIN-IN":
            return {...state, isLoginIn: action.status}
        case "AUTH/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.status}
        default:
            return state
    }
}

export const setIsLoginIn = (status: boolean) => {
    return {
        type: 'AUTH/SET-IS-LOGIN-IN',
        status
    } as const
}

export const setIsInitialized = (status: boolean) => {
    return {
        type: 'AUTH/SET-IS-INITIALIZED',
        status
    } as const
}


type SetIsLoginInType = ReturnType<typeof setIsLoginIn>
type SetIsInitializedType = ReturnType<typeof setIsInitialized>

export type AuthActionsType =
    | SetIsLoginInType
    | SetAppStatusType
    | SetAppErrorType
    | SetIsInitializedType

//thunks
export const loginIn =
    (formData: LoginRequestType, resetForm: Function) => (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        authAPI.login(formData)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(setIsLoginIn(true))
                    dispatch(setAppStatus('succeeded'))
                    resetForm()
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
            })
    }

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'))
    authAPI.me().then(res => {
        if (res.data.resultCode === ResponseCode.Ok) {
            dispatch(setIsLoginIn(true));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch(e => {
        handleServerNetworkError(e, dispatch)
    }).finally(() => {
        dispatch(setIsInitialized(true));
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResponseCode.Ok) {
                dispatch(setIsLoginIn(false))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
