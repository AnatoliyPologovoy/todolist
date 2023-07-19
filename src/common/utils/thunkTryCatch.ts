import {AppRootStateType, AppThunkDispatch} from 'app/store';
import { handleServerNetworkError } from 'common/utils/handle-server-network-error';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import {appActions} from "app/app-reducer";
import {ResponseType} from "features/todolists-lists/todolist-api";


/**
 * Обертка для асинхронных санков (thunks) в Redux,
 * которая обрабатывает ошибки и устанавливает статус приложения.
 *
 * @param {BaseThunkAPI<AppRootStateType, any, AppThunkDispatch, null | ResponseType>} thunkAPI - Объект `BaseThunkAPI`, содержащий методы `dispatch` и `rejectWithValue`.
 * @param {Function} tryLogic - Функция, выполняющая основную логику санкции.
 * @param {Function=} catchLogic - Функция, вызываемая в случае возникновения ошибки. По умолчанию, это пустая функция.
 * @returns {Promise<null | ResponseType>} - Промис, который разрешается либо значением `null`, если произошла ошибка, либо значением типа `ResponseType`.
 */
export const thunkTryCatch = async (
		thunkAPI: BaseThunkAPI<AppRootStateType, any, AppThunkDispatch, null | ResponseType>,
		tryLogic: Function,
		catchLogic: Function = () => {}) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(appActions.setAppStatus({status: 'loading'}))
		try {
				return await tryLogic()
		} catch (e) {
				handleServerNetworkError(e, dispatch)
				catchLogic()
				return rejectWithValue(null)
		} finally {
				// в handleServerNetworkError можно удалить убирание крутилки
				dispatch(appActions.setAppStatus({status: 'idle'}))
		}
}
