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

    const [tasks, setTask] = useState<TasksStateType>(
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
    console.log(tasks)

    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tdl => tdl.id !== todoListId))
        const newTasks = {...tasks}
        delete newTasks[todoListId]
        setTask(newTasks)
    }

    const removeTask = (taskId: string, todoListId: string) => {
        const updatedTasks = tasks[todoListId].filter(task => task.id !== taskId)
        setTask(
            {...tasks, [todoListId]: updatedTasks}
        )
    }
    const changeIsDoneTask = (taskId: string, newIsDown: boolean, todoListId: string) => {
        const updatedTasks = tasks[todoListId].map(task => {
            return task.id === taskId ? {...task, isDone: newIsDown} : task
        })
        setTask({...tasks, [todoListId]: updatedTasks})
    }
    const addTask = (titleTask: string, todoListId: string) => {
        const newTask = {id: v1(), title: titleTask, isDone: false}
        const updatedTasks = [newTask, ...tasks[todoListId]]
        setTask({...tasks, [todoListId]: updatedTasks})
    }
    const changeFilter = (filterValue: FilterType, todoListId: string) => {
        const updatedTodoList = todoLists.map(tdl => {
            return tdl.id === todoListId ? {...tdl, filter: filterValue} : tdl
        })
        setTodoLists(updatedTodoList)
        //or found need todolist, change in it filter and them setting copy todolists
        // const foundTodoList = todoLists.find(tdl => tdl.id === todoListId)
        // if (foundTodoList) {
        //     foundTodoList.filter = filterValue
        //     setTodoLists([...todoLists])
        // }

    }

    const filteringTasksForRender = (tasks: TaskType[], filter: FilterType) => {
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
        const filteredTasks: TaskType[] = filteringTasksForRender(tasks[tdl.id], tdl.filter)
        return (
            <Todolist
                key={tdl.id}
                todoListId={tdl.id}
                title={tdl.title}
                filter={tdl.filter}
                tasks={filteredTasks}
                removeTask={removeTask}
                changeStatusTask={changeIsDoneTask}
                addTask={addTask}
                changeFilter={changeFilter}
                removeTodoList={removeTodoList}
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
