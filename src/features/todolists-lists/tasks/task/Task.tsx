import React, { memo, useCallback } from 'react'
import { Checkbox, ListItem } from '@mui/material'
import EditableSpan from 'common/components/editableSpan/EditableSpan'
import {
    tasksThunks,
    TaskType,
} from 'features/todolists-lists/tasks/tasks-reducers'
import s from 'features/todolists-lists/todoList/todolist.module.css'
import {
    TaskRequestUpdateType,
    TaskStatues,
} from 'features/todolists-lists/todolist-api'
import cl from 'features/todolists-lists/tasks/task/task.module.css'
import { useActions, useAppDispatch } from 'common/hooks'

export type Props = {
    task: TaskType
}

export const Task: React.FC<Props> = memo(({ task }) => {
    const taskId = task.id
    const taskTitle = task.title
    const taskIsDone = task.status === TaskStatues.Completed
    const todoListId = task.todoListId
    const isDisable = task.entityStatus === 'loading'

    const { removeTaskTC, updateTaskTC } = useActions(tasksThunks)
    const dispatch = useAppDispatch()

    const changeTaskTitleHandler = useCallback(
        (newTitle: string) => {
            const changeValue: TaskRequestUpdateType = {
                title: newTitle,
            }
            return dispatch(
                tasksThunks.updateTaskTC({ todoListId, taskId, changeValue }),
            ).unwrap()
        },
        [taskId, todoListId],
    )

    const removeTaskHandler = useCallback(() => {
        removeTaskTC({ todoListId, taskId })
    }, [todoListId, taskId])

    // changing status
    const clickCheckboxHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const statusChecked = event.currentTarget.checked
            ? TaskStatues.Completed
            : TaskStatues.New
        const changeValue: TaskRequestUpdateType = {
            status: statusChecked,
        }
        updateTaskTC({ todoListId, taskId, changeValue })
    } // нет нужды в useCallBack потому что чекбокс из matherial UI

    return (
        <ListItem
            divider
            key={taskId}
            disableGutters={true}
            disablePadding={true}
            className={taskIsDone ? s.isDone : ''}
        >
            <Checkbox checked={taskIsDone} onChange={clickCheckboxHandler} />
            &nbsp;
            <EditableSpan
                sizeButtons={'small'}
                disabled={isDisable}
                title={taskTitle}
                classes={cl.title}
                changeTitle={changeTaskTitleHandler}
                removeItem={removeTaskHandler}
            />
        </ListItem>
    )
})
