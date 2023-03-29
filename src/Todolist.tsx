import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./todolist.module.css";


type TodolistPropsType = {
    id: string
    header: string,
    tasks: TaskType[],
    filter: FilterType
    removeTask: (id: string) => void,
    changeStatusTask: (id: string, newIsDone: boolean) => void
    addTask: (titleTask: string) => void
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'complied' | 'active'

export function Todolist(props: TodolistPropsType) {
    let tasks = props.tasks;

    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    // const filterButtonHandler = (filterWord:FilterType) => {
    //     setFilter(filterWord)
    // }


    //Tasks array
    const renderTasksList = tasks.map(task => {

        return (
            <li key={task.id} className={task.isDone ? s.isDone : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={(event) => {props.changeStatusTask(task.id, event.currentTarget.checked)}}
                />&nbsp;
                {task.title}&nbsp;
                <button onClick={() => props.removeTask(task.id)}>X</button>
            </li>
        )
    })


    //adding new tasks (button)
    const addTaskButtonHandler = () => {
        if (inputValue.trim() !== '') {
            props.addTask(inputValue.trim());
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



    return (
        <div>
            <h2>{props.header}</h2>
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
                // filterButtonHandler('all')
            }} className={props.filter === 'all' ? s.activeFilter : ''}>All
            </button>
            &nbsp;
            <button onClick={() => {
                // filterButtonHandler('complied')
            } } className={props.filter === 'complied' ? s.activeFilter : ''}>Complied
            </button>
            &nbsp;
            <button onClick={() => {
                // filterButtonHandler('active')
            }} className={props.filter === 'active' ? s.activeFilter : ''}>Active
            </button>
        </div>
    )
}
