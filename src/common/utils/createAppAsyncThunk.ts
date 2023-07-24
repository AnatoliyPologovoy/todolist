import {AppRootStateType, AppThunkDispatch} from "app/store";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {ResponseType} from "features/todolists-lists/todolist-api";


export const createAppAsyncThunk = createAsyncThunk.withTypes<{
		state: AppRootStateType
		dispatch: AppThunkDispatch
		rejectValue: string | ResponseType
}>()