import axios from "axios";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})


export const TodolistApi = {
    getTodoLists() {
        return instance.get<TodoListDomainType[]>('todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{item: TodoListDomainType}>>('todo-lists', {title})
    },
    deleteTodoList(todoId: string) {
        return instance.delete<ResponseType>('todo-lists/' + todoId)
    },
    changeTitleTodoList(title: string, todoId: string) {
        return instance.put<ResponseType>('todo-lists/' + todoId, {title})
    },
    getTasks(todoListId: string) {
        return instance
            .get<GetTasksRequestType>(`/todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance
            .post<CreateTaskResponseType>
            (`/todo-lists/${todoListId}/tasks`, {
                title
            })
    },
    changeTask(todoListId: string,taskId: string, title: string) {
        return instance
            .put<CreateTaskResponseType>
            (`/todo-lists/${todoListId}/tasks/${taskId}`, {
                title
            })
    },
    deleteTask(todoListId: string,taskId: string) {
        return instance
            .delete<ResponseType>
            (`/todo-lists/${todoListId}/tasks/${taskId}`)
    }
}

export type TodoListDomainType = {
    id: string
    title: string
    addedData: Date
    order: number
}

type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors: []
    message: string[]
    data: T
}

export type CreateTaskResponseType = {
    data: {
        item: TaskResponseType
    }
    resultCode: number
    messages: string[]
}


type TaskResponseType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: Date
    deadline: Date
    id: string
    todoListId: string
    order: number
    addedDate: Date
}

export type GetTasksRequestType = {
    items: TaskResponseType[]
    totalCount: number
    error: string
}

