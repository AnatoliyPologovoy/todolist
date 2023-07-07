import {appActions} from "app/app-reducer";
import {LoginRequestType, ResponseCode} from "features/todos/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {authAPI} from "features/auth/auth.api";

const initialState = {
    isLoginIn: false,
    isInitialized: false
}

export const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoginIn(state, action: PayloadAction<{ status: boolean }>) {
            state.isLoginIn = action.payload.status
        },
        setIsInitialized(state, action: PayloadAction<{ status: boolean }>) {
            state.isInitialized = action.payload.status
        }
    }
})
export const authReducer = slice.reducer
export const authActions = slice.actions


//thunks
export const loginIn =
    (formData: LoginRequestType): AppThunk => (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        authAPI.login(formData)
            .then(res => {
                if (res.data.resultCode === ResponseCode.Ok) {
                    dispatch(authActions.setIsLoginIn({status: true}))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
            })
    }

export const initializeAppTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    authAPI.me().then(res => {
        if (res.data.resultCode === ResponseCode.Ok) {
            dispatch(authActions.setIsLoginIn({status: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch(e => {
        handleServerNetworkError(e, dispatch)
    }).finally(() => {
        dispatch(authActions.setIsInitialized({status: true}));
    })
}

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResponseCode.Ok) {
                dispatch(authActions.setIsLoginIn({status: false}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
