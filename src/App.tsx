import React, {useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./Todolist";
import {v1} from "uuid";


function App() {
    const h1 = 'What i must to do';

    let [tasks, setTask] = useState([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Redux", isDone: false},
        {id: v1(), title: "SQL", isDone: false},
    ])

    const removeTask = (id: string) => {
        setTask(
            tasks.filter(el => el.id !== id)
        )
    }

    const changeIsDoneTask = (id: string, newIsDown: boolean) => {
        setTask(tasks.map(
            el => el.id === id ? {...el, isDone: newIsDown} : el ))
    }

    const addTask = (titleTask: string) => {
        const newTask = {id: v1(), title: titleTask, isDone: false}
        setTask([newTask, ...tasks])
    }

    return (
        <div className="App">
            <Todolist header={h1}
                      tasks={tasks}
                      removeTask={removeTask}
                      changeStatusTask={changeIsDoneTask}
                      addTask={addTask}
            />

        </div>
    );
}

export default App;
