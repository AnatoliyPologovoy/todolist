import {AppRootStateType} from "app/store";

export const todoListsSelector = (state: AppRootStateType) => state.todolists
export const isLoggedInSelector = (state: AppRootStateType) => state.auth.isLoginIn
export const tasksSelector = (todoListId: string) => {
   return (state: AppRootStateType) => state.tasks[todoListId]
}
export const statusSelector = (state: AppRootStateType) => state.app.status
export const isInitializedSelector = (state: AppRootStateType) => state.auth.isInitialized
export const isLoginInSelector = (state: AppRootStateType) => state.auth.isLoginIn
