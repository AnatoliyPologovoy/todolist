import React, {memo, useCallback} from 'react';
import {Checkbox, IconButton, ListItem, ListItemButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../reducers/task-reducers";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../store";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import s from "./todolist.module.css";
import {TaskResponseType, TaskStatues} from "../api/todolist-api";

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

    const dispatch = useDispatch()

    const changeStatusTaskHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(taskId, event.currentTarget.checked, todoListId))
    } // нет нужды в useCallBack потому что чекбокс из matherial UI

    const changeTaskTitle = useCallback ( (newTitle: string) => {
        dispatch(changeTaskTitleAC(taskId, newTitle, todoListId))
    }, [taskId, todoListId])


    return (
        <ListItem
            divider
            key={taskId}
            disableGutters={true}
            disablePadding={true}
            secondaryAction={
                <IconButton
                    size={"small"}
                    onClick={() => dispatch(removeTaskAC(taskId, todoListId))}>
                    <DeleteForeverIcon fontSize={"small"}/>
                </IconButton>
            }
            className={taskIsDone ? s.isDone : ''}
        >

        <ListItemButton onClick={(e)=> {
            const checkbox = e.currentTarget.children[0].children[0] as HTMLInputElement
            dispatch(changeTaskStatusAC(taskId, !checkbox.checked, todoListId))
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



