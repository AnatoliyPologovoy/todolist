import {Dispatch} from 'redux'
import {ResponseType} from 'api/todolist-api'
import {appActions} from "reducers/app-reducer";
import axios, {AxiosError} from "axios";


// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError =
    (err: unknown , dispatch: Dispatch) => {
    const e = err as Error | AxiosError<{error: string}>
        if (axios.isAxiosError(e)) {
            const error = e.message ? e.message : 'Some error occurred'
            dispatch(appActions.setAppError({error}))
        } else {
            dispatch(appActions.setAppError({error: `Native error ${e.message}`}))
        }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

// type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>
