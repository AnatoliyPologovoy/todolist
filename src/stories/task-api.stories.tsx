import React, {useEffect, useState} from 'react'
import {
    CreateTaskResponseType,
    GetTasksRequestType,
    TaskPriorities,
    TaskStatues,
    TodolistApi
} from "features/todos/todolist-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState<GetTasksRequestType | null>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        const todoId = '91423609-70a3-4723-8db7-f074ef403852'

        TodolistApi.getTasks(todoId)
            .then(res => {

                setState(res.data)
            })
    }, [])
    return <div>
        {JSON.stringify(state)}
        <div>
            {state && state.items.map(t => {
                return (
                    <>
                        <p>
                            {t.title}
                        </p>
                        <p>
                            {t.id}
                        </p>
                    </>
                )
            })}
        </div>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<CreateTaskResponseType | null>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputId, setInputId] = useState<string>('')
    const [inputTitle, setInputTitle] = useState<string>('')

    useEffect(() => {

        const todoId = '91423609-70a3-4723-8db7-f074ef403852'
        const title = 'Test task333'
        if (isFetch) {
            TodolistApi.createTask({
                todoListId: inputId,
                title: inputTitle
            })
                .then(res => {
                    setState(res.data)
                    setFetch(false)
                    setInputId('')
                    setInputTitle('')
                })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)

    }

    const isDisableButton = !(inputId.length > 0 && inputTitle.length > 0 && !isFetch)

    return <div>
        <label htmlFor="">
            TodoListID:
            <input type="text" value={inputId} onChange={(e) => setInputId(e.currentTarget.value)}/>
        </label>
        <label htmlFor="">
            Title:
            <input type="text" value={inputTitle} onChange={(e) => setInputTitle(e.currentTarget.value)}/>
        </label>
        <button disabled={isDisableButton} onClick={onClickButtonHandler}>Create task</button>
        {JSON.stringify(state)}
        <div>
            {state && state.data.item.title}
        </div>
    </div>
}

export const ChangeTask = () => {
    const [state, setState] = useState<CreateTaskResponseType | null>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputId, setInputId] = useState<string>('')
    const [inputTaskId, setInputTaskId] = useState<string>('')
    const [inputTitle, setInputTitle] = useState<string>('')

    useEffect(() => {

        const changingTask = {
            todoListId: inputId,
            id: inputTaskId,
            title: inputTitle,
            status: TaskStatues.Completed,
            description: '',
            completed: false,
            priority: TaskPriorities.Low,
            startDate: new Date(2011, 0, 1),
            addedDate: new Date(2011, 0, 1),
            order: 0,
            deadline: new Date(2011, 0, 1),
        }

        if (isFetch) {
            TodolistApi.changeTask(inputId, inputTaskId, changingTask)
                .then(res => {
                    setState(res.data)
                    setFetch(false)
                    setInputId('')
                    setInputTaskId('')
                    setInputTitle('')
                })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)
    }

    const isDisableButton = !(inputId.length > 0 && inputTaskId.length > 0 && inputTitle.length > 0 && !isFetch)

    return <div>
        <label htmlFor="">
            TodoListID:
            <input type="text" value={inputId} onChange={(e) => setInputId(e.currentTarget.value)}/>
        </label>
        <label htmlFor="">
            TaskID:
            <input type="text" value={inputTaskId} onChange={(e) => setInputTaskId(e.currentTarget.value)}/>
        </label>
        <label htmlFor="">
            Title:
            <input type="text" value={inputTitle} onChange={(e) => setInputTitle(e.currentTarget.value)}/>
        </label>
        <button disabled={isDisableButton} onClick={onClickButtonHandler}>Change task</button>
        {JSON.stringify(state)}
        <div>
            {state && state.data.item.title}
        </div>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputId, setInputId] = useState<string>('')
    const [inputTaskId, setInputTaskId] = useState<string>('')


    useEffect(() => {

        if (isFetch) {
            TodolistApi.removeTask({
                todoListId: inputId,
                taskId: inputTaskId
            })
                .then(res => {
                    setState(res.data)
                    setFetch(false)
                    setInputId('')
                    setInputTaskId('')

                })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)
    }

    const isDisableButton = !(inputId.length > 0 && inputTaskId.length > 0 && !isFetch)

    return <div>
        <label htmlFor="">
            TodoListID:
            <input type="text" value={inputId} onChange={(e) => setInputId(e.currentTarget.value)}/>
        </label>
        <label htmlFor="">
            TaskID:
            <input type="text" value={inputTaskId} onChange={(e) => setInputTaskId(e.currentTarget.value)}/>
        </label>
        <button disabled={isDisableButton} onClick={onClickButtonHandler}>Delete task</button>
        {JSON.stringify(state)}
        <div>
            {/*{state && state.data}*/}
        </div>
    </div>
}