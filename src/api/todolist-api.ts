import axios, {AxiosResponse} from "axios";

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
    removeTodoList(todoId: string) {
        return instance.delete<ResponseType>('todo-lists/' + todoId)
    },
    changeTitleTodoList(title: string, todoId: string) {
        return instance.put<ResponseType>('todo-lists/' + todoId, {title})
    },
    getTasks(todoListId: string) {
        return instance
            .get<GetTasksRequestType>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance
            .post<ResponseType<{ item: TaskResponseType }>>
            (`todo-lists/${todoListId}/tasks`, {
                title
            })
    },
    changeTask(todoListId: string, taskId: string, task: UpdateTaskModelType) {
        return instance
            .put<ResponseType<{ item: TaskResponseType }>>
            (`todo-lists/${todoListId}/tasks/${taskId}`, task)
    },
    removeTask(todoListId: string, taskId: string) {
        return instance
            .delete<ResponseType>
            (`todo-lists/${todoListId}/tasks/${taskId}`)
    }
}

export const authAPI = {
    login(RequestPayload: LoginRequestType) {
        return instance
            .post<ResponseType<{ userId: number }>,
                AxiosResponse<ResponseType<{ userId: number }>>,
                LoginRequestType>('auth/login', RequestPayload)
    },
    me() {
        return instance
            .get<ResponseType<{
                id: string,
                email: string,
                login: string
            }>>('auth/me')
    },
    logout() {
        return instance
            .delete<ResponseType>('auth/login')
    }
}


export type TodoListDomainType = {
    id: string
    title: string
    addedData: Date
    order: number
}

export type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors: []
    messages: string[]
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

export enum ResponseCode {
    Ok = 0,
    Error = 1
}

export type UpdateTaskModelType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: Date
    deadline: Date
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

export type TaskRequestUpdateType = {
    title?: string
    status?: TaskStatues
}


export type GetTasksRequestType = {
    items: TaskResponseType[]
    totalCount: number
    error: string
}

export type LoginRequestType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}