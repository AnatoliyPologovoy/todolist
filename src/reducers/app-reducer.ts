export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null


const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as AppErrorType,
}
//значение перед as RequestStatusType дополняет(расширяет) RequestStatusType
//поэтому оно может отличаваться от уже затипизированных значений

export type InitialAppStateType = typeof initialState

export const appReducer =
    (state: InitialAppStateType = initialState, action: AppActionsType): InitialAppStateType => {
        switch (action.type) {
            case 'APP/SET-STATUS':
                return {...state, status: action.status}
            case 'APP/SET-ERROR':
                return {...state, error: action.error}
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

export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>


export type AppActionsType =
    | setAppStatusType
    | setAppErrorType

