import {AppRootStateType} from "app/store";

export const todoListsSelector = (state: AppRootStateType) => state.todolists
export const isLoggedInSelector = (state: AppRootStateType) => state.auth.isLoginIn
export const tasksSelector = (todoListId: string) => {
   return (state: AppRootStateType) => state.tasks[todoListId]
}
