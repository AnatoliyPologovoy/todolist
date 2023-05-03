import React, {FormEvent, useRef} from "react";
import s from "./todolist.module.css";
import {AddItemForm} from "./addItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, FormControlLabel, IconButton, List, ListItem, ListItemButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC
} from "./reducers/todolists-reducers";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/task-reducers";
import {TasksStateType, TodoListType} from "./AppWithRedux";


type TodolistPropsType = {
    todoListId: string
    title: string,
    filter: FilterType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'complied' | 'active'

export function TodolistWithRedux(props: TodolistPropsType) {
    const {
        todoListId,
        title,
        filter,
    } = props

    const dispatch = useDispatch()

    const changeTitleTodolistCallBack = (newTitle: string) => {
        dispatch(ChangeTodolistTitleAC(newTitle, todoListId))
    }

    let taskFromRedux = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todoListId])

    switch (filter) {
        case "active":
            taskFromRedux = taskFromRedux.filter(task => !task.isDone)
            break
        case "complied":
            taskFromRedux = taskFromRedux.filter(task => task.isDone)
            break
    }

    //Tasks array
    const renderTasksList = taskFromRedux.map(task => {
        const changeStatusTaskHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(changeTaskStatusAC(task.id, event.currentTarget.checked, todoListId))
        }

        const changeTaskTitle = (newTitle: string) => {
            dispatch(changeTaskTitleAC(task.id, newTitle, todoListId))
        }

        return (
            <ListItem
                divider
                key={task.id}
                disableGutters={true}
                disablePadding={true}
                secondaryAction={
                    <IconButton
                        size={"small"}
                        onClick={() => dispatch(removeTaskAC(task.id, todoListId))}>
                        <DeleteForeverIcon fontSize={"small"}/>
                    </IconButton>
                }
                className={task.isDone ? s.isDone : ''}
            >
                <ListItemButton onClick={(e)=> {
                    const checkbox = e.currentTarget.children[0].children[0] as HTMLInputElement
                    dispatch(changeTaskStatusAC(task.id, !checkbox.checked, todoListId))
                }}>
                    <Checkbox
                        checked={task.isDone}
                        onChange={changeStatusTaskHandler}
                    />
                    &nbsp;
                    <EditableSpan title={task.title} classes={''} changeTitle={changeTaskTitle}/>
                </ListItemButton>
            </ListItem>
        )
    })


    //adding new tasks (button)
    const addItem = (title: string) => {
        dispatch(addTaskAC(title, todoListId));
    }

    //remove todoList
    const removeTodoListOnClickHandler = () => {
        dispatch(RemoveTodolistAC(todoListId))
    }

    // @ts-ignore
    return (
        <div className={'todolist'}>
            <div>
                <h2>
                    <EditableSpan title={title} classes={''} changeTitle={changeTitleTodolistCallBack}/>
                    <IconButton
                        onClick={removeTodoListOnClickHandler}>
                        <DeleteForeverIcon fontSize={"medium"}/>
                    </IconButton>
                </h2>
            </div>
            <AddItemForm addItem={addItem}/>
            <List sx={{width: '100%', maxWidth: 360}}
                  subheader
            >
                {renderTasksList}
            </List>
            <Button
                size={"small"}
                variant={"contained"}
                disableElevation
                color={filter === 'all' ? 'secondary' : 'primary'}
                onClick={() => {
                    dispatch(ChangeTodolistFilterAC('all', todoListId))
                }}>All
            </Button>
            &nbsp;
            <Button
                size={"small"}
                variant={"contained"}
                disableElevation
                color={filter === 'complied' ? 'secondary' : 'primary'}
                onClick={() => {
                    dispatch(ChangeTodolistFilterAC('complied', todoListId))
                }}>Complied
            </Button>
            &nbsp;
            <Button
                size={"small"}
                variant={"contained"}
                disableElevation
                color={filter === 'active' ? 'secondary' : 'primary'}
                onClick={() => {
                    dispatch(ChangeTodolistFilterAC('active', todoListId))
                }}>Active
            </Button>
        </div>
    )
}
