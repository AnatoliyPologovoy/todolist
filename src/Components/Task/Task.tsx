import React, {memo, useCallback} from 'react';
import {Checkbox, ListItem} from "@mui/material";
import EditableSpan from "../EditableSpan/EditableSpan";
import {changeTaskTC, tasksThunks, TaskType} from "reducers/task-reducers";
import s from "../TodoList/todolist.module.css";
import {TaskRequestUpdateType, TaskStatues} from "api/todolist-api";
import {useAppDispatch} from "hooks/useAppDispatch";
import cl from "./task.module.css"

export type TaskPropsType = {
    task: TaskType
    // rejectedRequestUpdateTaskTitle: string | null
}

export const Task: React.FC<TaskPropsType> = memo((props) => {
    const taskId = props.task.id
    const taskTitle = props.task.title
    const taskIsDone = props.task.status === TaskStatues.Completed
    const todoListId = props.task.todoListId
    const isDisable = props.task.entityStatus === 'loading'

    const dispatch = useAppDispatch()

    const changeTaskTitle = useCallback(
        (newTitle: string, setRejectTitle: (title: string) => void) => {

        const changeValue: TaskRequestUpdateType = {
            title: newTitle,
        }

        dispatch(changeTaskTC(todoListId, taskId, changeValue, setRejectTitle))
    }, [taskId, todoListId])


    const removeTask = () => {
        dispatch(tasksThunks.removeTaskTC({todoListId, taskId}))
    }

    // changing status
    const onClickCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const statusChecked = event.currentTarget.checked
            ? TaskStatues.Completed
            : TaskStatues.New
        const changingValue: TaskRequestUpdateType = {
            status: statusChecked
        }
        dispatch(changeTaskTC(todoListId, taskId, changingValue))
    } // нет нужды в useCallBack потому что чекбокс из matherial UI

    return (
        <ListItem
            divider
            key={taskId}
            disableGutters={true}
            disablePadding={true}
            className={taskIsDone ? s.isDone : ''}
        >
            <Checkbox
                checked={taskIsDone}
                onChange={onClickCheckbox}
            />
            &nbsp;
            <EditableSpan
                sizeButtons={'small'}
                disabled={isDisable}
                title={taskTitle}
                classes={cl.title}
                changeTitle={changeTaskTitle}
                removeItem={removeTask}
            />
        </ListItem>
    )
})



