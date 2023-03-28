import React, {useState} from 'react';
import './App.css';
import {FilterType, TasksType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type TodoListType = {
    id: string
    title: string
    filter: FilterType
}

type TaskStateType = {
    [todolist: string]: Array<TasksType>
}


function App(): JSX.Element {
    //BLL:
    const todoListId_1 = v1()
    const todoListId_2 = v1()
    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {
            id: todoListId_1,
            title: 'What i must to do',
            filter: 'all'
        },
        {
            id: todoListId_2,
            title: 'What to buy',
            filter: 'all'
        }
    ])

    let [tasks, setTask] = useState<TaskStateType>({
        [todoListId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
            {id: v1(), title: "SQL", isDone: false},
        ],
        [todoListId_2]: [
            {id: v1(), title: "Bread", isDone: false},
            {id: v1(), title: "Water", isDone: true},
            {id: v1(), title: "Salt", isDone: false}
        ]
    })


    const removeTask = (taskId: string, todoListId: string) => {
        const resultOfUpdate: Array<TasksType> = tasks[todoListId].filter(el => el.id !== taskId)
        const copyTasks = {...tasks}
        copyTasks[todoListId] = resultOfUpdate
        setTask(copyTasks)
        //ИЛИ:
        // setTask(
        //     {...tasks, [todoListId] : tasks[todoListId].filter(el => el.id !== taskId)}
        // )
    }
    const addTask = (titleTask: string, todoListId: string) => {
        const newTask: TasksType = {id: v1(), title: titleTask, isDone: false}
        //если title: title можно просто писать title
        setTask({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]})
    }
    const changeIsDoneTask = (taskId: string, newIsDown: boolean, todoListId: string) => {
        setTask(
            {
                ...tasks, [todoListId]: tasks[todoListId].map(
                    el => el.id === taskId ? {...el, isDone: newIsDown} : el)
            }
        )
    }

    const changeTodoListFilter = (filter: FilterType, todoListId: string) => {
        setTodoLists(
            todoLists.map(tdl => tdl.id === todoListId ? {...tdl, filter: filter} : tdl)
        )
    }

    const removeTodoList = (todoListId: string) => {
        setTodoLists(
            todoLists.filter(tdl => tdl.id !== todoListId)
        )
        delete tasks[todoListId]
    }

    //UI:
    const getFilteredTaskForRender = (tasks: Array<TasksType>, filter: FilterType) => {
        switch (filter) {
            case 'active':
                return tasks = tasks.filter(task => task.isDone)
            case 'complied':
                return tasks = tasks.filter(task => !task.isDone)
            default:
                return tasks
        }
    }


    const todoListsComponents = todoLists.map(tdl => {
        const tasksForRender: Array<TasksType> = getFilteredTaskForRender(tasks[tdl.id], tdl.filter)
        return (
            <Todolist
                key={tdl.id}
                todolistId={tdl.id}
                header={tdl.title}
                filter={tdl.filter}
                tasks={tasksForRender}
                addTask={addTask}
                removeTask={removeTask}
                changeStatusTask={changeIsDoneTask}
                removeTodoList={removeTodoList}
                changeTodoListFilter={changeTodoListFilter}
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
