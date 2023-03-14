import React, {KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import {v1} from "uuid";
import {Button} from "./components/Button.jsx";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (newTask: TaskType) => void
}

export function Todolist(props: PropsType) {
    const [value, setValue] = useState('');
    const addTaskHandler = () => {
        props.addTask({ id: v1(), title: value, isDone: false });
        setValue('')
    }
    const onKeyPressHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addTaskHandler()
        }
    }
    const buttonRemoveHandler = (el:string) => {
        props.removeTask(el)
    }

    const changeFilterHandler = (filterValue:FilterValuesType) => {
        props.changeFilter(filterValue)
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            <input value={value}
                   onChange={(evt)=>{setValue(evt.currentTarget.value)}}
                   onKeyDown={onKeyPressHandler}/>
            <button onClick={addTaskHandler}>+</button>
        </div>
        <ul>
            {
                props.tasks.map(t => {
                    return (
                        <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={() => {
                                buttonRemoveHandler(t.id)
                            }}>x
                            </button>
                        </li>
                    )
                })
            }
        </ul>
        <div>
            {/*<button onClick={ () => changeFilterHandler("all")}>All</button>*/}
            <Button name={'all'} callBack={() => changeFilterHandler("all")} />
            <button onClick={ () => changeFilterHandler("active") }>Active</button>
            <button onClick={ () => changeFilterHandler("completed") }>Completed</button>
        </div>
    </div>
}
