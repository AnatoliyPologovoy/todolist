import React, {useState} from 'react';
import './App.css';
import Todolist from "./Todolist";


function App() {
    const h1 = 'title1';
    const h2 = 'title2';

    let [tasks, setTask] = useState([
            { id: 1, title: "HTML&CSS", isDone: true },
            { id: 2, title: "JS", isDone: true },
            { id: 3, title: "ReactJS", isDone: false }
        ]
    )

    const removeTask = (id : number) => {
        //console.log(id)
        setTask(tasks.filter(el=> el.id !== id))
    }


    return (
        <div className="App">
            <Todolist header={h1}
                      body={'body'}
                      tasks={tasks}
                      removeTask={removeTask}
                      //filterTasks={filterTasks}
            />

        </div>
    );
}

export default App;
