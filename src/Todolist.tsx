import React, {useState} from "react";

type PropsType = {
    header : string,
    body? : string, //не обяз св-во
    tasks: TaskType[], // или Array<TaskType>   дженерик(уточнение) <>
    removeTask : (value : number)=> void
    //filterTasks : (stateButton : string)=> void
}

type TaskType={
    id: number,
    title: string,
    isDone: boolean
}

function Todolist (props:PropsType) {
    let [filterValue, setFilterValue] = useState('All')

    const filterTasks = (stateButton:string) => {
        setFilterValue(stateButton);
    }
    let data = props.tasks;
    if (filterValue === 'Active') {
        data =  data.filter(el => !el.isDone)
    }
    if (filterValue === 'Completed') {
        data = data.filter(el => el.isDone)
    }
    const drawLi = data.map((el) => {
            return (
                <li key={el.id}><input type="checkbox" checked={el.isDone}/>
                    <span>{el.title}</span>
                    <button onClick={()=>props.removeTask(el.id)}>X</button>
                </li>
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
                <button onClick={()=>{filterTasks('All')}}>All</button>
                <button onClick={()=>{filterTasks('Active')}}>Active</button>
                <button onClick={()=>{filterTasks('Completed')}}>Completed</button>
            </div>
        </div>
    )
}

export default Todolist;