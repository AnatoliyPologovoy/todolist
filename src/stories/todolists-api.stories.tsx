import React, { useEffect, useState } from 'react'
import {
    TodolistApi,
    TodoListDomainType,
} from 'features/todolists-lists/todolist-api'

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<TodoListDomainType[] | null>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        TodolistApi.getTodoLists().then((res) => {
            setState(res.data)
        })
    }, [])

    const styleWrapper = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
    } as const
    // return <div>{JSON.stringify(state)}</div>
    return (
        <div style={styleWrapper}>
            {state &&
                state.map((t) => {
                    return (
                        <div>
                            <h1>{t.title}</h1>
                            <p>{t.id}</p>
                        </div>
                    )
                })}
        </div>
    )
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputTitle, setInputTitle] = useState<string>('')

    useEffect(() => {
        if (isFetch) {
            TodolistApi.createTodoList(inputTitle).then((res) => {
                setState(res.data)
                setFetch(false)
                setInputTitle('')
            })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)
    }

    const isDisableButton = !(inputTitle.length > 0 && !isFetch)

    return (
        <div>
            <label htmlFor="">
                Title:
                <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.currentTarget.value)}
                />
            </label>
            <button disabled={isDisableButton} onClick={onClickButtonHandler}>
                Create todoList
            </button>
            {JSON.stringify(state)}
            {/*<div>*/}
            {/*    {state && state.data.item.title}*/}
            {/*</div>*/}
        </div>
    )
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputId, setInputId] = useState<string>('')

    useEffect(() => {
        const todoId = 'cd52da72-f747-4231-bf51-b0f36d84754e'
        if (isFetch) {
            TodolistApi.removeTodoList(inputId).then((res) => {
                setState(res.data)
                setInputId('')
            })
        }
    }, [isFetch])

    const isDisableButton = !(inputId.length > 0 && !isFetch)

    const onClickButtonHandler = () => {
        setFetch(true)
    }

    return (
        <div>
            <label htmlFor="">
                ID:
                <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.currentTarget.value)}
                />
            </label>
            <button disabled={isDisableButton} onClick={onClickButtonHandler}>
                Delete todoList
            </button>
            {JSON.stringify(state)}
        </div>
    )
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [isFetch, setFetch] = useState(false)
    const [inputId, setInputId] = useState<string>('')
    const [inputTitle, setInputTitle] = useState<string>('')

    useEffect(() => {
        // const todoId = '23f1fa4a-b061-4f9d-853b-33ccb40999f2'
        // const title = 'JS -----------00'
        if (isFetch) {
            TodolistApi.changeTitleTodoList(inputTitle, inputId).then((res) => {
                setState(res.data)
                setInputId('')
                setInputTitle('')
            })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)
    }

    const isDisableButton = !(
        inputId.length > 0 &&
        inputTitle.length > 0 &&
        !isFetch
    )

    return (
        <div>
            <label htmlFor="">
                TodoListID:
                <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.currentTarget.value)}
                />
            </label>
            <label htmlFor="">
                Title:
                <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.currentTarget.value)}
                />
            </label>
            <button disabled={isDisableButton} onClick={onClickButtonHandler}>
                Update todoList
            </button>
            {JSON.stringify(state)}
        </div>
    )
}
