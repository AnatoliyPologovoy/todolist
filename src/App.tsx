import React, {useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./Todolist";
import {v1} from "uuid";


function App() {
    const h1 = 'What i must to do';

    let [tasks, setTask] = useState([
            { id: v1(), title: "HTML&CSS", isDone: true },
            { id: v1(), title: "JS", isDone: true },
            { id: v1(), title: "ReactJS", isDone: false }
        ])

    const removeTask = (id : string) => {
        setTask(
            tasks.filter(el=>el.id !== id)
        )
    }
    const changeDoneTask = (id : string) => {
        const cbForMapChangeIsDone = (task : TasksType) => {
            if (id === task.id) {
                return task.isDone ? {...task, isDone: false} : {...task, isDone: true}
            }
            return task
        }

        setTask(
            tasks.map(cbForMapChangeIsDone)
        )
    }

    const addTask = (titleTask : string) => {
        const newTask = { id: v1(), title: titleTask, isDone: false }
        setTask([newTask, ...tasks])
    }

    return (
        <div className="App">
            <Todolist header={h1}
                      tasks={tasks}
                      removeTask={removeTask}
                      changeDoneTask = {changeDoneTask}
                      addTask={addTask}
            />

        </div>
    );
}

export default App;
