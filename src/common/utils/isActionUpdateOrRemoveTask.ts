import {
    PromiseStatusType,
    ThunkAction,
} from 'features/todolists-lists/tasks/tasks-reducers'

export const isActionUpdateOrRemoveTask = (
    action: ThunkAction<any, any>,
    promiseStatus: PromiseStatusType,
) => {
    return (
        action.type.endsWith('updateTask/' + promiseStatus) ||
        action.type.endsWith('removeTasks/' + promiseStatus)
    )
}
