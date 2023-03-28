import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./todolist.module.css";


type TodolistPropsType = {
    todolistId: string
    header: string,
    filter: FilterType
    tasks: TasksType[],
    removeTask: (id: string, todoListId: string) => void,
    changeStatusTask: (id: string, newIsDone: boolean, todoListId: string) => void
    addTask: (titleTask: string, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListFilter: (filter:FilterType, todoListId: string) => void
}

export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'complied' | 'active'

export function Todolist(props: TodolistPropsType) {
    let tasks = props.tasks;

    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    //Tasks array
    const renderTasksList = tasks.map(task => {

        return (
            <li key={task.id} className={task.isDone ? s.isDone : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={(event) => {props.changeStatusTask(task.id, event.currentTarget.checked, props.todolistId)}}
                />&nbsp;
                {task.title}&nbsp;
                <button onClick={() => props.removeTask(task.id, props.todolistId)}>X</button>
            </li>
        )
    })

    //adding new tasks (button)
    const addTaskButtonHandler = () => {
        if (inputValue.trim() !== '') {
            props.addTask(inputValue.trim(), props.todolistId);
        }
        else {
            setError('Field is required')
        }
        setInputValue('');
    }
    //input
    const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
        setError('') //remove error when we start change input
        setInputValue(evt.currentTarget.value)
    }
    const onKeyInputHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addTaskButtonHandler()
        }
    }
    //remove todoList
    const removeTodolist = () => props.removeTodoList(props.todolistId)

    return (
        <div>
            <h2>
                {props.header}&nbsp;
                <button onClick={removeTodolist}>X</button>
            </h2>
            <input
                value={inputValue}
                type="text"
                onChange={onChangeInput}
                onKeyDown={onKeyInputHandler}
                className={error ? s.error : ''}
            />
            <button onClick={addTaskButtonHandler}>+</button>
            { error && <div className={s.errorMessage}>{error}</div>}
            <ul>
                {renderTasksList}
            </ul>
            <button onClick={() => {
                props.changeTodoListFilter('all', props.todolistId)
            }} className={props.filter === 'all' ? s.activeFilter : ''}>All
            </button>
            &nbsp;
            <button onClick={() => {
                props.changeTodoListFilter('complied', props.todolistId)
            } } className={props.filter === 'complied' ? s.activeFilter : ''}>Complied
            </button>
            &nbsp;
            <button onClick={() => {
                props.changeTodoListFilter('active', props.todolistId)
            }} className={props.filter === 'active' ? s.activeFilter : ''}>Active
            </button>
        </div>
    )
}