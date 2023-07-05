import {Dispatch} from 'redux'
import {appActions} from "app/app-reducer";
import axios, {AxiosError} from "axios";

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
