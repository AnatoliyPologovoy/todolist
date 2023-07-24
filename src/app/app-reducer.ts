import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AnyAction} from "redux";
import {ThunkAction} from "features/todolists-lists/tasks/tasks-reducers";
import {ResponseType} from "features/todolists-lists/todolist-api";

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
				// setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
				// 		state.status = action.payload.status
				// },
				setAppError(state, action: PayloadAction<{ error: AppErrorType }>) {
						state.error = action.payload.error
				}
		},
		extraReducers: builder => {
				builder
						.addMatcher((action: AnyAction) => {
										return action.type.endsWith('pending')
								},
								(state, action) => {
										state.status = 'loading'
								}
						)
						.addMatcher((action: AnyAction) => {
										return action.type.endsWith('fulfilled')
								},
								(state, action) => {
										console.log(action)
										state.status = 'succeeded'
								})
						.addMatcher((action: AnyAction) => {
										return action.type.endsWith('rejected')
								},
								(state, action: ThunkAction<any, ResponseType>) => {
										console.log(action)
										if (action.payload) {
												//for updateTaskTC case
												if (typeof action.payload === 'string') {
														state.error = action.payload
												}
												//don`t show global error for createTodoList
												else if (!action.type.includes('createTodoList')
														//for loginIn case - fieldsErrors to handle in formik
														&& !action.payload.fieldsErrors.length) {
														state.error = action.payload.messages[0]
												}
										} else {
												state.error = action?.error?.message ? action.error.message : 'Some error occurred'
										}
										state.status = 'failed'
								})
		}
})


export const appReducer = slice.reducer
export const appActions = slice.actions



