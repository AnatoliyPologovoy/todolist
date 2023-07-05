import {AppRootStateType} from "app/store";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
		state: AppRootStateType
		dispatch: Dispatch
		rejectValue: null
}>()