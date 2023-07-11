import {ResponseType} from "features/todos/todolist-api";
import {Dispatch} from "redux";
import {appActions} from "app/app-reducer";

/**
 * Handles server application errors.
 *
 * @template T - The type of the response data.
 * @param {ResponseType<T>} data - The response data.
 * @param {Dispatch} dispatch - The dispatch function from Redux.
 * @param {boolean} [showError=true] - Indicates whether to show the error. Default is true.
 * @returns {void}
 */

export const handleServerAppError =
		<T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
		if (showError) {
				dispatch(appActions.setAppError(
						{error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
		}
		dispatch(appActions.setAppStatus({status: 'failed'}))
}