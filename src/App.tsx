import React from 'react';
import './App.css';
import Todolist from "./Todolist";


function App() {
    const h1 = 'title1';
    const h2 = 'title2';

    const tasks1 = [
        { id: 1, title: "HTML&CSS", isDone: true },
        { id: 2, title: "JS", isDone: true },
        { id: 3, title: "ReactJS", isDone: false }
    ]
    const tasks2 = [
        { id: 1, title: "Hello world", isDone: true },
        { id: 2, title: "I am Happy", isDone: false },
        { id: 3, title: "Yo", isDone: false }
    ]

    return (

        <div className="App">
            <Todolist header={h1} body={'body'} tasks={tasks2}/>
            <Todolist header={h2} tasks={tasks1}/>

        </div>
    );
}

export default App;
