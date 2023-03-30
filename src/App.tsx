import React, {useState} from 'react';
import './App.css';
import {FilterType, TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type TodoListType = {
    id: string
    title: string
    filter: FilterType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App(): JSX.Element {
    const tdlId_1 = v1()
    const tdlId_2 = v1()
    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: tdlId_1, title: 'What to learn', filter: 'all'},
        {id: tdlId_2, title: 'What to buy', filter: 'all'}
    ])

    let [tasks, setTask] = useState<TasksStateType>(
        {
            [tdlId_1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Redux", isDone: false},
                {id: v1(), title: "SQL", isDone: false},
            ],
            [tdlId_2]: [
                {id: v1(), title: "Milk", isDone: false},
                {id: v1(), title: "Egs", isDone: true},
                {id: v1(), title: "Bread", isDone: false},
            ]
        })

    const removeTask = (id: string) => {
        setTask(
            tasks.filter(el => el.id !== id)
        )
    }

    const changeIsDoneTask = (id: string, newIsDown: boolean) => {
        setTask(tasks.map(
            el => el.id === id ? {...el, isDone: newIsDown} : el))
    }

    const addTask = (titleTask: string) => {
        const newTask = {id: v1(), title: titleTask, isDone: false}
        setTask([newTask, ...tasks])
    }

    const filteringTasks = (tasks: TaskType[], filter: FilterType) => {
        const filteredTasks = tasks
        switch (filter) {
            case "active":
                return filteredTasks.filter(task => !task.isDone)
            case "complied":
                return filteredTasks.filter(task => task.isDone)
            default:
                return filteredTasks
        }
    }

    const todoListsComponents = todoLists.map(tdl => {
        const filteredTasks: TaskType[] = filteringTasks(tasks, tdl.filter)
        return (
            <Todolist
                key={tdl.id}
                id={tdl.id}
                header={tdl.title}
                filter={tdl.filter}
                tasks={filteredTasks}
                removeTask={removeTask}
                changeStatusTask={changeIsDoneTask}
                addTask={addTask}
            />
        )
    })


    return (
        <div className="App">
            {todoListsComponents}
        </div>
    );
}

export default App;
