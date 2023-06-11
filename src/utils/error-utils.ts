import {Dispatch} from 'redux'
import {ResponseType} from '../api/todolist-api'
import {setAppError, setAppErrorType, setAppStatus, setAppStatusType} from "../reducers/app-reducer";


// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<setAppStatusType | setAppErrorType>
