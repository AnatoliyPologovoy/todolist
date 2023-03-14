import React, {ChangeEvent, KeyboardEvent, useState} from "react";


type TodolistPropsType = {
    header : string,
    tasks : TasksType[],
    removeTask : (id:string) => void,
    changeDoneTask : (id:string) => void
    addTask : (titleTask: string) => void
}

export type TasksType = {
    id : string,
    title : string,
    isDone : boolean
}

type filterType = 'all' | 'complied' | 'active'

export function Todolist(props:TodolistPropsType) {
    let tasks = props.tasks;
    //filtering tasks
    let [filter, setFilter] = useState<filterType>('all')
    if (filter === 'complied') {
        tasks = tasks.filter(task => task.isDone)
    }
    if (filter === 'active') {
        tasks = tasks.filter(task => !task.isDone)
    }
    //Tasks list
    const checkboxChangeHandler = (id : string) => {
        props.changeDoneTask(id);
    }
    const buttonRemoveTaskHandler = (id: string) => {
        props.removeTask(id)
    }
    const renderTasksList = tasks.map(task => {
            return (
                <li key={task.id}>
                    <input type="checkbox"
                           checked={task.isDone}
                           onClick={()=>{checkboxChangeHandler(task.id)}}
                    />&nbsp;
                    {task.title}&nbsp;
                    <button onClick={()=>buttonRemoveTaskHandler(task.id)}>X</button>
                </li>
            )
        })
    //adding new tasks
    const [inputValue, setInputValue] = useState<string>('')
    const addTaskHandler = () => {
        props.addTask(inputValue);
        setInputValue('');
    }
    const inputOnChange = (evt:ChangeEvent<HTMLInputElement>) => {
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
            <input value={inputValue} type="text" onChange={inputOnChange} onKeyDown={inputOnKeyHandler}/>
            <button onClick={addTaskHandler}>+</button>
            <ul>
                {renderTasksList}
            </ul>
            <button onClick={()=>{setFilter('all')}}>All</button>&nbsp;
            <button onClick={()=>{setFilter('complied')}}>Complied</button>&nbsp;
            <button onClick={()=>{setFilter('active')}}>Active</button>
        </div>
    )
}