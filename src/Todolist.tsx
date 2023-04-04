import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./todolist.module.css";
import {AddItemForm} from "./addItemForm";
import EditableSpan from "./EditableSpan";


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
        const changeTaskTitle = (newTitle: string) => {
            changeTitleTask(task.id ,newTitle, todoListId)
        }
        return (
            <li key={task.id} className={task.isDone ? s.isDone : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={(event) => {
                           changeStatusTask(task.id, event.currentTarget.checked, todoListId)
                       }}
                />&nbsp;
                <EditableSpan title={task.title} classes={''} changeTitle={changeTaskTitle}/>
                <button onClick={() => removeTask(task.id, todoListId)}>X</button>
            </li>
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
        <div>
            <div>
                <h2>
                    <EditableSpan title={title} classes={''} changeTitle={changeTitleTodolistCallBack}/>
                    <button onClick={removeTodoListOnClickHandler}>X</button>
                </h2>
            </div>
            <AddItemForm addItem={addItem}/>
            <ul>
                {renderTasksList}
            </ul>
            <button onClick={() => {
                changeFilter('all', todoListId)
            }} className={filter === 'all' ? s.activeFilter : ''}>All
            </button>
            &nbsp;
            <button onClick={() => {
                changeFilter('complied', todoListId)
            }} className={filter === 'complied' ? s.activeFilter : ''}>Complied
            </button>
            &nbsp;
            <button onClick={() => {
                changeFilter('active', todoListId)
            }} className={filter === 'active' ? s.activeFilter : ''}>Active
            </button>
        </div>
    )
}
