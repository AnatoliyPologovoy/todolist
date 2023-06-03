import React, {memo, useCallback} from 'react';
import {Checkbox, IconButton, ListItem, ListItemButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {
    changeTaskStatusAC,
    changeTaskTC,
    changeTaskTitleAC,
    removeTaskAC,
    removeTaskTC
} from "../reducers/task-reducers";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../store";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import s from "./todolist.module.css";
import {TaskResponseType, TaskStatues} from "../api/todolist-api";
import {useAppDispatch} from "../hooks/useAppDispatch";

export type TaskPropsType = {
    taskId: string
    todoListId: string
}

export const Task:React.FC<TaskPropsType> = memo((props) => {

    const {taskId, todoListId} = props

    const task =
        useSelector<AppRootStateType, TaskResponseType | undefined>(state => {
        return state.tasks[todoListId].find(t => t.id === taskId)
    })
    let taskTitle = 'undefined'
    let taskIsDone = false

    if (task) {
        taskTitle = task.title
        taskIsDone = task.status === TaskStatues.Completed
    }

    const dispatch = useAppDispatch()

    const changeStatusTaskHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const statusChecked = event.currentTarget.checked ? TaskStatues.Completed : TaskStatues.New
        dispatch(changeTaskStatusAC(taskId, statusChecked, todoListId))
    } // нет нужды в useCallBack потому что чекбокс из matherial UI

    const changeTaskTitle = useCallback ( (newTitle: string) => {
        const changeValue = {
            title: newTitle
        }
        dispatch(changeTaskTC(todoListId, taskId, changeValue))
    }, [taskId, todoListId])

    const onClickRemoveTask = () => {
        dispatch(removeTaskTC(todoListId, taskId))
    }

    return (
        <ListItem
            divider
            key={taskId}
            disableGutters={true}
            disablePadding={true}
            secondaryAction={
                <IconButton
                    size={"small"}
                    onClick={onClickRemoveTask}>
                    <DeleteForeverIcon fontSize={"small"}/>
                </IconButton>
            }
            className={taskIsDone ? s.isDone : ''}
        >

        <ListItemButton onClick={(e)=> {
            const checkbox = e.currentTarget.children[0].children[0] as HTMLInputElement
            const statusChecked = checkbox.checked ? TaskStatues.New : TaskStatues.Completed

            dispatch(changeTaskStatusAC(taskId, statusChecked, todoListId))
        }}>
            <Checkbox
                checked={taskIsDone}
                onChange={changeStatusTaskHandler}
            />
            &nbsp;
            <EditableSpan title={taskTitle} classes={''} changeTitle={changeTaskTitle}/>
        </ListItemButton>
        </ListItem>

    )
})



