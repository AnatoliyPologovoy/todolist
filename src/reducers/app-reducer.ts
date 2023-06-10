import {RemoveTodolistAT} from "./todolists-reducers";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null
type rejectedRequestTitleType = {
    [key: string]: string
}

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as AppErrorType,
    rejectedRequestTitle: {} as rejectedRequestTitleType
}

//значение перед as RequestStatusType дополняет(расширяет) RequestStatusType
//поэтому оно может отличаваться от уже затипизированных значений

export type InitialAppStateType = typeof initialState

export const appReducer = (state: InitialAppStateType = initialState, action: AppActionsType): InitialAppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-REJECTED-REQUEST_TITLE":
            return {
                ...state, rejectedRequestTitle: {
                    ...state.rejectedRequestTitle,
                    [action.id]: action.title
                }
            }
        case "REMOVE-TODOLIST":
            const copyRejectedRequestTitle = {...state.rejectedRequestTitle}
            delete copyRejectedRequestTitle[action.payload.id]
            return {...state, rejectedRequestTitle: copyRejectedRequestTitle}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)

export const setAppError = (error: AppErrorType) => ({
    type: 'APP/SET-ERROR',
    error
} as const)

export const setRejectedRequestTitle = (id: string, title: string) => ({
    type: 'APP/SET-REJECTED-REQUEST_TITLE',
    id,
    title
} as const)

export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>
export type setRejectedRequestTitleType =
    ReturnType<typeof setRejectedRequestTitle>
export type AppActionsType =
    | setAppStatusType
    | setAppErrorType
    | setRejectedRequestTitleType
    | RemoveTodolistAT
