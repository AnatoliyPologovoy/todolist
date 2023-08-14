import { RequestStatusType } from 'app/app-reducer'
import {
    commonTaskThunkArgType,
    TasksStateType,
} from 'features/todolists-lists/tasks/tasks-reducers'

export const changeTaskEntityStatus = (
    state: TasksStateType,
    thunkActionPayload: commonTaskThunkArgType,
    status: RequestStatusType,
) => {
    const { todoListId, taskId } = thunkActionPayload
    const tasks = state[todoListId]
    const index = tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) tasks[index].entityStatus = status
}
