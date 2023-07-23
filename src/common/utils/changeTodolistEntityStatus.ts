import {RequestStatusType} from "app/app-reducer";
import {commonTodoListArgType, TodoListType} from "features/todolists-lists/todolists-reducers";

export const changeTodolistEntityStatus =
		(state: TodoListType[],
		 todoListArg: commonTodoListArgType,
		 status: RequestStatusType) => {
				const todoListId = typeof todoListArg === 'string'
						? todoListArg
						: todoListArg.todoListId
				const index = state.findIndex(t => t.id === todoListId)
				if (index >= 0) state[index].entityStatus = status
		}