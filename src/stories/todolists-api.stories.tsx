import React, {useEffect, useState} from 'react'
import {TodolistApi, TodoListType} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<TodoListType[] | null>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        TodolistApi.getTodoLists()
            .then(res => {

                setState(res.data)
            })
    }, [])

    const styleWrapper = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
    } as const
    // return <div>{JSON.stringify(state)}</div>
    return <div style={styleWrapper}>
        {state && state.map(t => {
            return (
                <div>
                    <h1>{t.title}</h1>
                    <p>{t.id}</p>
                </div>
            )
        })}
    </div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        TodolistApi.createTodoList('Redux')
            .then(res => {

                setState(res.data)
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = 'cd52da72-f747-4231-bf51-b0f36d84754e'

        TodolistApi.deleteTodoList(todoId)
            .then(res => {

                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todoId = '23f1fa4a-b061-4f9d-853b-33ccb40999f2'
        const title = 'JS -----------00'
        TodolistApi.changeTitleTodoList(title, todoId)
            .then(res => {

                setState(res.data)
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>
}

