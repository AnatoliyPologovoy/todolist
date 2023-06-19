import {SetAppErrorType, setAppStatus, SetAppStatusType} from "./app-reducer";
import {Dispatch} from "redux";
import {authAPI, LoginRequestType, ResponseCode} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    isLoginIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType):InitialStateType  => {
    switch (action.type) {
        case "AUTH/SET-IS-LOGIN-IN":
            return {...state, isLoginIn: action.status}
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

type SetIsLoginInType = ReturnType<typeof setIsLoginIn>

export type AuthActionsType =
    | SetIsLoginInType
    | SetAppStatusType
    | SetAppErrorType

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