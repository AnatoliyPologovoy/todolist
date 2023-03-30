import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./todolist.module.css";


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
        removeTodoList
    } = props

    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)


    //Tasks array
    const renderTasksList = tasks.map(task => {

        return (
            <li key={task.id} className={task.isDone ? s.isDone : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={(event) => {changeStatusTask(task.id, event.currentTarget.checked, todoListId)}}
                />&nbsp;
                {task.title}&nbsp;
                <button onClick={() =>removeTask(task.id, todoListId)}>X</button>
            </li>
        )
    })


    //adding new tasks (button)
    const addTaskButtonHandler = () => {
        if (inputValue.trim() !== '') {
            addTask(inputValue.trim(), todoListId);
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
    const removeTodoListOnClickHandler = () => {
        removeTodoList(todoListId)
    }


    return (
        <div>
            <div>
                <h2 style={{display: "inline"}}>{title}</h2>&nbsp;
                <button onClick={removeTodoListOnClickHandler}>X</button>
            </div>

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
                changeFilter('all', todoListId)
            }} className={filter === 'all' ? s.activeFilter : ''}>All
            </button>
            &nbsp;
            <button onClick={() => {
                changeFilter('complied', todoListId)
            } } className={filter === 'complied' ? s.activeFilter : ''}>Complied
            </button>
            &nbsp;
            <button onClick={() => {
                changeFilter('active', todoListId)
            }} className={filter === 'active' ? s.activeFilter : ''}>Active
            </button>
        </div>
    )
}
