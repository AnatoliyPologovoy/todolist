import React, {useState} from "react";


type TodolistPropsType = {
    header : string,
    tasks : TasksType[],
    removeTask : (id:number) => void,
    changeDoneTask : (id:number) => void
}

export type TasksType = {
    id : number,
    title : string,
    isDone : boolean
}

type filterType = 'all' | 'complied' | 'active'

export function Todolist(props:TodolistPropsType) {
    let drawTasks = props.tasks;
    let [filter, setFilter] = useState<filterType>('all')
    if (filter === 'complied') {
        drawTasks = drawTasks.filter(task => task.isDone)
    }
    if (filter === 'active') {
        drawTasks = drawTasks.filter(task => !task.isDone)
    }


    const drawTasksList =
        drawTasks.map(task => {
            return (
                <li key={task.id}>
                    <input type="checkbox"
                           checked={task.isDone}
                           onClick={()=>{props.changeDoneTask(task.id)}}
                    />&nbsp;
                    {task.title}&nbsp;
                    <button onClick={()=>props.removeTask(task.id)}>X</button>
                </li>
            )
        })

    return (
        <div>
            <h2>{props.header}</h2>
            <ul>
                {drawTasksList}
            </ul>
            <button onClick={()=>{setFilter('all')}}>All</button>&nbsp;
            <button onClick={()=>{setFilter('complied')}}>Complied</button>&nbsp;
            <button onClick={()=>{setFilter('active')}}>Active</button>
        </div>
    )
}