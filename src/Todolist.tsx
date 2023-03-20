import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./todolist.module.css";


type TodolistPropsType = {
    header: string,
    tasks: TasksType[],
    removeTask: (id: string) => void,
    changeDoneTask: (id: string, newIsDone: boolean) => void
    addTask: (titleTask: string) => void
}

export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

type filterType = 'all' | 'complied' | 'active'

export function Todolist(props: TodolistPropsType) {
    let tasks = props.tasks;

    let [filter, setFilter] = useState<filterType>('all')
    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    //filtering tasks
    if (filter === 'complied') {
        tasks = tasks.filter(task => task.isDone)
    }
    if (filter === 'active') {
        tasks = tasks.filter(task => !task.isDone)
    }

    const filterButtonHandler = (filterWord:filterType) => {
        setFilter(filterWord)
    }

    const checkboxChangeHandler = (id:string, checked:boolean) => {
        props.changeDoneTask(id, checked)
    }

    //Tasks array
    const renderTasksList = tasks.map(task => {

        return (
            <li key={task.id} className={task.isDone ? s.isDone : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={(event) => {checkboxChangeHandler(task.id, event.currentTarget.checked)}}
                />&nbsp;
                {task.title}&nbsp;
                <button onClick={() => buttonRemoveTaskHandler(task.id)}>X</button>
            </li>
        )
    })

    //removing tasks
    const buttonRemoveTaskHandler = (id: string) => {
        props.removeTask(id)
    }
    //adding new tasks
    const addTaskHandler = () => {
        if (inputValue.trim() !== '') {
            props.addTask(inputValue.trim());
        }
        else {
            setError('Field is required')
        }
        setInputValue('');
    }
    //input
    const inputOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setError('')
        setInputValue(evt.currentTarget.value)
    }
    const inputOnKeyHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addTaskHandler()
        }
    }



    return (
        <div>
            <h2>{props.header}</h2>
            <input
                value={inputValue}
                type="text"
                onChange={inputOnChange}
                onKeyDown={inputOnKeyHandler}
                className={error ? s.error : ''}
            />
            <button onClick={addTaskHandler}>+</button>
            { error && <div className={s.errorMessage}>{error}</div>}
            <ul>
                {renderTasksList}
            </ul>
            <button onClick={() => {
                filterButtonHandler('all')
            }} className={filter === 'all' ? s.activeFilter : ''}>All
            </button>
            &nbsp;
            <button onClick={() => {
                filterButtonHandler('complied')
            } } className={filter === 'complied' ? s.activeFilter : ''}>Complied
            </button>
            &nbsp;
            <button onClick={() => {
                filterButtonHandler('active')
            }} className={filter === 'active' ? s.activeFilter : ''}>Active
            </button>
        </div>
    )
}