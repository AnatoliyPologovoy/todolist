import React, {memo, useCallback} from 'react';
import {Checkbox, ListItem} from "@mui/material";
import EditableSpan from "common/components/EditableSpan/EditableSpan";
import {tasksThunks, TaskType} from "features/tasks/tasks-reducers";
import s from "features/todos/TodoList/todolist.module.css";
import {TaskRequestUpdateType, TaskStatues} from "features/todos/todolist-api";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import cl from "features/tasks/Task/task.module.css"
import {useActions} from "common/hooks";

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

    const {removeTaskTC, updateTaskTC} = useActions(tasksThunks)

    const changeTaskTitle = useCallback(
        (newTitle: string, setRejectTitle: (title: string) => void) => {

        const changeValue: TaskRequestUpdateType = {
            title: newTitle,
        }

       updateTaskTC({todoListId, taskId, changeValue, setRejectTitle})
    }, [taskId, todoListId])


    const removeTask = () => {
        removeTaskTC({todoListId, taskId})
    }

    // changing status
    const onClickCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const statusChecked = event.currentTarget.checked
            ? TaskStatues.Completed
            : TaskStatues.New
        const changeValue: TaskRequestUpdateType = {
            status: statusChecked
        }
        updateTaskTC({todoListId, taskId, changeValue})
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



