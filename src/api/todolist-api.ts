import axios from "axios";
import {number} from "prop-types";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})


export const TodolistApi = {
    getTodoLists() {
        return instance.get<TodoListType[]>('todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{item: TodoListType}>>('todo-lists', {title})
    },
    deleteTodoList(todoId: string) {
        return instance.delete<ResponseType>('todo-lists/' + todoId)
    },
    changeTitleTodoList(title: string, todoId: string) {
        return instance.put<ResponseType>('todo-lists/' + todoId, {title})
    }
}

type TodoListType = {
    id: string
    title: string
    addedData: Date
    order: number
}

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

type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors: []
    message: string[]
    data: T
}

