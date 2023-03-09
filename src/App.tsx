import React, {useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./Todolist";


function App() {
    const h1 = 'What i must to do';


    let [tasks, setTask] = useState([
            { id: 1, title: "HTML&CSS", isDone: true },
            { id: 2, title: "JS", isDone: true },
            { id: 3, title: "ReactJS", isDone: false }
        ])

    const removeTask = (id : number) => {
        setTask(
            tasks.filter(el=>el.id !== id)
        )
    }
    const changeDoneTask = (id : number) => {
        const cbChangeIsDone = (task : TasksType) => {
            if (id === task.id) {
                return task.isDone ? {...task, isDone: false} : {...task, isDone: true}
            }
            return task
        }

        setTask(
            tasks.map(cbChangeIsDone)
        )
    }


    return (
        <div className="App">
            <Todolist header={h1}
                     // body={'body'}
                      tasks={tasks}
                      removeTask={removeTask}
                      changeDoneTask = {changeDoneTask}
                      //filterTasks={filterTasks}
            />

        </div>
    );
}

export default App;
