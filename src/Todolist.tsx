import React from "react";

type PropsType = {
    header : string,
    body? : string, //не обяз св-во
    tasks:TaskType[] // или Array<TaskType>   дженерик(уточнение) <>
}

type TaskType={
    id: number,
    title: string,
    isDone: boolean
}

function Todolist (props:PropsType) {
    const drawLi = props.tasks.map((el) => {
            return (
                <li><input type="checkbox" checked={el.isDone}/><span>{el.title}</span></li>
            )
        })

    return  (
        <div>
            <h3>{props.header} {props.body}</h3>

            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {drawLi}
{/*                <li><input type="checkbox" checked={props.tasks[0].isDone}/> <span>{props.tasks[0].title}</span></li>
                <li><input type="checkbox" checked={props.tasks[1].isDone}/> <span>{props.tasks[1].title}</span></li>
                <li><input type="checkbox" checked={props.tasks[2].isDone}/> <span>{props.tasks[2].title}</span></li>*/}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    )
}

export default Todolist;