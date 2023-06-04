import React, {memo, useCallback, MouseEvent, MouseEventHandler, useState} from 'react';
import {ButtonGroup, Checkbox, IconButton, ListItem, ListItemButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {changeTaskStatusAC, changeTaskTC, removeTaskTC} from "../reducers/task-reducers";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../store";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import s from "./todolist.module.css";
import {TaskRequestType, TaskResponseType, TaskStatues} from "../api/todolist-api";
import {useAppDispatch} from "../hooks/useAppDispatch";
import EditIcon from '@mui/icons-material/Edit';

export type TaskPropsType = {
    taskId: string
    todoListId: string
}

export const Task:React.FC<TaskPropsType> = memo((props) => {
    const [isEditMode, setIsEditMode] = useState(false)

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



    const changeTaskTitle = useCallback ( (newTitle: string) => {
        setIsEditMode(false)
        const changeValue: TaskRequestType = {
            title: newTitle,
            // status: TaskStatues.Completed
        }
        dispatch(changeTaskTC(todoListId, taskId, changeValue))
    }, [taskId, todoListId])

    const onClickRemoveTask = () => {
        dispatch(removeTaskTC(todoListId, taskId))
    }

    // changing status
    const onClickItem = (e:React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        const checkbox = e.currentTarget.children[0].children[0] as HTMLInputElement
        //convert status from boolean on TaskStatues type
        const statusChecked = checkbox.checked
            ? TaskStatues.New
            : TaskStatues.Completed
        //changing value must be status or title
        const changingValue = {
            status: statusChecked
        }
        dispatch(changeTaskTC(todoListId, taskId, changingValue))
    }

    const onClickCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const statusChecked = event.currentTarget.checked
            ? TaskStatues.Completed
            : TaskStatues.New
        const changingValue = {
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
            secondaryAction={
            <ButtonGroup   >
                <IconButton
                    size={"small"}
                    onClick={()=>{setIsEditMode(true)}}>
                    <EditIcon fontSize={"small"}/>
                </IconButton>
                <IconButton
                    size={"small"}
                    onClick={onClickRemoveTask}>
                    <DeleteForeverIcon fontSize={"small"}/>
                </IconButton>
                </ButtonGroup>
            }
            className={taskIsDone ? s.isDone : ''}
        >

        <ListItemButton
            // onClick={onClickItem}
        >
            <Checkbox
                checked={taskIsDone}
                onChange={onClickCheckbox}
            />
            &nbsp;
            <EditableSpan
                isEditMode={isEditMode}
                title={taskTitle}
                classes={''}
                changeTitle={changeTaskTitle}
            />

        </ListItemButton>
        </ListItem>

    )
})



