import {appActions} from "app/app-reducer";
import {LoginRequestType, ResponseCode} from "features/todos/todolist-api";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice} from "@reduxjs/toolkit";
import {authAPI} from "features/auth/auth.api";

const initialState = {
		isLoginIn: false,
		isInitialized: false
}

export const slice = createSlice({
		name: 'auth',
		initialState,
		reducers: {},
		extraReducers: builder => {
				builder
						.addCase(login.fulfilled, (state, action) => {
								state.isLoginIn = action.payload.isLoginIn
						})
						.addCase(logout.fulfilled, (state, action) => {
								state.isLoginIn = action.payload.isLoginIn
						})
						.addCase(initializeApp.fulfilled, (state, action) => {
								state.isInitialized = action.payload.isInitialized
						})
		}
})
export const authReducer = slice.reducer
export const authActions = slice.actions


//thunks
const login = createAppAsyncThunk<{ isLoginIn: true }, LoginRequestType>(
		'auth/loginIn',
		async (formData, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus({status: 'loading'}))
				try {
						const res = await authAPI.login(formData)
						if (res.data.resultCode === ResponseCode.Ok) {
								dispatch(appActions.setAppStatus({status: 'succeeded'}))
								return {isLoginIn: true}
						} else {
								//fieldsErrors to handler in Formik
								const isShowAppError = !res.data.fieldsErrors.length
								handleServerAppError(res.data, dispatch, isShowAppError)
								return rejectWithValue(res.data)
						}
				} catch (e) {
						handleServerNetworkError(e, dispatch)
						return rejectWithValue(null)
				}
		})

const initializeApp = createAppAsyncThunk<{ isInitialized: true }, void>(
		'auth/initializeApp',
		async (_, thunkAPI) => {
				const {dispatch} = thunkAPI
				try {
						const res = await authAPI.me()
						if (res.data.resultCode === ResponseCode.Ok) {
								dispatch(login.fulfilled(
										{isLoginIn: true},
										'requestId',
										{
												email: '',
												password: ''
										}
								))
						}
				} catch (e) {
						handleServerNetworkError(e, dispatch)
				} finally {
						return {isInitialized: true}
				}
		}
)

const logout = createAppAsyncThunk<{isLoginIn: false}, void>(
		'auth/logout',
		async (_, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus({status: 'loading'}))
				try {
						const res = await authAPI.logout()
						if (res.data.resultCode === ResponseCode.Ok) {
								dispatch(appActions.setAppStatus({status: 'succeeded'}))
							return {isLoginIn: false}
						} else {
								handleServerAppError(res.data, dispatch)
								return rejectWithValue(null)
						}
				} catch (e) {
						handleServerNetworkError(e, dispatch)
						return rejectWithValue(null)
				}
		}
)

export const authThunk = {login, initializeApp, logout}