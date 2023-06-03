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
        return instance.post<ResponseType<{ item: TodoListDomainType }>>('todo-lists', {title})
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
    changeTask(todoListId: string, taskId: string, changeValue: TaskRequestType) {
        const d1 = new Date(2011, 0, 1)
        const d2 = new Date(2031, 0, 1)

        const requestBody = {
            title: 'CHANGED',
            description: 'required(string)',
            completed: false,
            status: TaskStatues.Completed,
            priority: TaskPriorities.Low,
            startDate: d1,
            deadline: d2
        }
        return instance
            .put<CreateTaskResponseType>
            (`/todo-lists/${todoListId}/tasks/${taskId}`, requestBody)
    },
    removeTask(todoListId: string, taskId: string) {
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

export enum TaskStatues {
    New = 0,
    inProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}


export type TaskResponseType = {
    id: string
    title: string
    status: TaskStatues
    description: string
    completed: boolean
    priority: TaskPriorities
    startDate: Date
    deadline: Date
    todoListId: string
    order: number
    addedDate: Date
}

export type TaskRequestType = {
    title?: string
    status?: TaskStatues
}


export type GetTasksRequestType = {
    items: TaskResponseType[]
    totalCount: number
    error: string
}

