import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

export const TaskApi = {
    getTasks(todoListId: string) {
        return instance
            .get<GetTasksRequestType>(`/todo-lists/${todoListId}/tasks`)
    },
    createTask<CreateTaskResponseType>(todoListId: string, title: string) {
        return instance
            .post(`/todo-lists/${todoListId}/tasks`, {
                title
            })
    }
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










// export const TodolistApi = {
//     getTodoLists() {
//         return instance.get<TodoListType[]>('todo-lists')
//     },
//     createTodoList(title: string) {
//         return instance.post<ResponseType<{item: TodoListType}>>('todo-lists', {title})
//     },
//     deleteTodoList(todoId: string) {
//         return instance.delete<ResponseType>('todo-lists/' + todoId)
//     },
//     changeTitleTodoList(title: string, todoId: string) {
//         return instance.put<ResponseType>('todo-lists/' + todoId, {title})
//     }
// }

// type TodoListType = {
//     id: string
//     title: string
//     addedData: Date
//     order: number
// }

// type CreateTodoListResponseType = {
//     resultCode: number
//     fieldsErrors: []
//     messages: string[]
//     data: {
//         item: TodoListType
//     }
// }
//
// type DeleteTodoListResponseType = {
//     resultCode: number
//     fieldsErrors: []
//     message: string[]
//     data: {}
// }

// type ChangeTitleTodoListResponseType = {
//     resultCode: number
//     fieldsErrors: []
//     message: string[]
//     data: {}
// }

// type ResponseType<T = {}> = {
//     resultCode: number
//     fieldsErrors: []
//     message: string[]
//     data: T
// }

