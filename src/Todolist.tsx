import React, {FormEvent} from "react";
import s from "./todolist.module.css";
import {AddItemForm} from "./addItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, ListItemButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


type TodolistPropsType = {
    todoListId: string
    title: string,
    tasks: TaskType[],
    filter: FilterType
    removeTask: (id: string, todoListId: string) => void,
    changeStatusTask: (id: string, newIsDone: boolean, todoListId: string) => void
    addTask: (titleTask: string, todoListId: string) => void
    changeFilter: (filter: FilterType, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTask: (taskId: string, newTitle: string, todoListId: string) => void
    changeTitleTodolist: (todoListId: string, title: string) => void
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'complied' | 'active'

export function Todolist(props: TodolistPropsType) {
    const {
        todoListId,
        title,
        tasks,
        filter,
        removeTask,
        changeStatusTask,
        addTask,
        changeFilter,
        removeTodoList,
        changeTitleTask,
        changeTitleTodolist
    } = props

    const changeTitleTodolistCallBack = (newTitle: string) => {
        changeTitleTodolist(todoListId, newTitle)
    }


    //Tasks array
    const renderTasksList = tasks.map(task => {
        const changeStatusTaskHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
            changeStatusTask(task.id, event.currentTarget.checked, todoListId)
        }

        const changeTaskTitle = (newTitle: string) => {
            changeTitleTask(task.id, newTitle, todoListId)
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
                        onClick={() => removeTask(task.id, todoListId)}>
                        <DeleteForeverIcon fontSize={"small"}/>
                    </IconButton>
                }
                className={task.isDone ? s.isDone : ''}
            >
                <ListItemButton onClick={(e)=> {
                    let divNode = e.target

                    console.log(divNode)
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
        addTask(title, todoListId);
    }

    //remove todoList
    const removeTodoListOnClickHandler = () => {
        removeTodoList(todoListId)
    }

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
                    changeFilter('all', todoListId)
                }}>All
            </Button>
            &nbsp;
            <Button
                size={"small"}
                variant={"contained"}
                disableElevation
                color={filter === 'complied' ? 'secondary' : 'primary'}
                onClick={() => {
                    changeFilter('complied', todoListId)
                }}>Complied
            </Button>
            &nbsp;
            <Button
                size={"small"}
                variant={"contained"}
                disableElevation
                color={filter === 'active' ? 'secondary' : 'primary'}
                onClick={() => {
                    changeFilter('active', todoListId)
                }}>Active
            </Button>
        </div>
    )
}
