import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as AppErrorType,
}
//значение перед as RequestStatusType дополняет(расширяет) RequestStatusType
//поэтому оно может отличаваться от уже затипизированных значений

export type InitialAppStateType = typeof initialState

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: AppErrorType }>) {
            state.error = action.payload.error
        }
    }
})


export const appReducer = slice.reducer
export const appActions = slice.actions



