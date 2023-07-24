import {LoginRequestType, ResponseCode} from "features/todolists-lists/todolist-api";
import {createAppAsyncThunk} from "common/utils";
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


//thunks
const login = createAppAsyncThunk<{ isLoginIn: true }, LoginRequestType>(
		'auth/loginIn',
		async (formData, thunkAPI) => {
				const res = await authAPI.login(formData)
				if (res.data.resultCode === ResponseCode.Ok) {
						return {isLoginIn: true}
				} else {
						return thunkAPI.rejectWithValue(res.data)
				}
		})

const initializeApp = createAppAsyncThunk<{isInitialized: true}, void>(
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
				}
				finally {
						return {isInitialized: true}
				}
		}
)

const logout = createAppAsyncThunk<{ isLoginIn: false }, void>(
		'auth/logout',
		async (_, thunkAPI) => {
				const {rejectWithValue} = thunkAPI
				const res = await authAPI.logout()
				if (res.data.resultCode === ResponseCode.Ok) {
						return {isLoginIn: false}
				} else {
						return rejectWithValue(res.data)
				}
		})

export const authThunk = {login, initializeApp, logout}