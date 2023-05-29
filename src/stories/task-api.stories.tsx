import React, {useEffect, useState} from 'react'
import {CreateTaskResponseType, GetTasksRequestType, TaskApi} from "../api/task-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState<GetTasksRequestType | null>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        const todoId = '91423609-70a3-4723-8db7-f074ef403852'

        TaskApi.getTasks(todoId)
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
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        const todoId = '91423609-70a3-4723-8db7-f074ef403852'
        const title = 'Test task333'
        if (isFetch) {
            TaskApi.createTask(todoId, title)
                .then(res => {
                    setState(res.data)
                    setFetch(false)
                })
        }
    }, [isFetch])

    const onClickButtonHandler = () => {
        setFetch(true)
    }


    return <div>
        <button onClick={onClickButtonHandler}>Create task</button>
        {JSON.stringify(state)}
        <div>
            {state && state.data.item.title}
        </div>
    </div>
}