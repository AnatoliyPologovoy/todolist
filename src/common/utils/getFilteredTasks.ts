import {
    FilterType,
    TaskType,
} from 'features/todolists-lists/tasks/tasks-reducers'
import { TaskStatues } from 'features/todolists-lists/todolist-api'

export const getFilteredTasks = (tasks: TaskType[], filter: FilterType) => {
    switch (filter) {
        case 'active':
            return tasks.filter((task) => task.status === TaskStatues.New)
        case 'complied':
            return tasks.filter((task) => task.status === TaskStatues.Completed)
        default:
            return tasks
    }
}
