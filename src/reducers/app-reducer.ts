import {RemoveTodolistAT} from "./todolists-reducers";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null
type rejectedRequestTitleType = {
    [key: string]: {
        newTitle: string,
        updateTitle: string
    }
}

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as AppErrorType,
    rejectedRequestTitle: {} as rejectedRequestTitleType,
    // rejectedRequestChangeTitle: {} as rejectedRequestTitleType
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
        case "APP/SET-REJECTED-REQUEST-TITLE":
            return {
                ...state, rejectedRequestTitle: {
                    ...state.rejectedRequestTitle,
                    [action.id]: {
                        ...state.rejectedRequestTitle[action.id],
                        newTitle: action.title
                    }
                }
            }
        case "APP/SET-REJECTED-REQUEST-CHANGE-TITLE":
            return {
                ...state, rejectedRequestTitle: {
                    ...state.rejectedRequestTitle,
                    [action.id]: {
                        ...state.rejectedRequestTitle[action.id],
                        updateTitle: action.title
                    }
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

export const setRejectedRequestNewTitle = (id: string, title: string) => ({
    type: 'APP/SET-REJECTED-REQUEST-TITLE',
    id,
    title
} as const)

export const setRejectedRequestChangeTitle = (id: string, title: string) => ({
    type: 'APP/SET-REJECTED-REQUEST-CHANGE-TITLE',
    id,
    title
} as const)



export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>
export type setRejectedRequestNewTitleType =
    ReturnType<typeof setRejectedRequestNewTitle>
export type setRejectedRequestChangeTitleType =
    ReturnType<typeof setRejectedRequestChangeTitle>

export type AppActionsType =
    | setAppStatusType
    | setAppErrorType
    | setRejectedRequestNewTitleType
    | setRejectedRequestChangeTitleType
    | RemoveTodolistAT

