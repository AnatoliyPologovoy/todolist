import {PromiseStatusType, ThunkAction} from "features/todolists-lists/tasks/tasks-reducers";

export const isActionUpdateOrRemoveTodolist =
		(action: ThunkAction<any, any>, promiseStatus: PromiseStatusType) => {
				return action.type.endsWith('updateTodoListTitle/' + promiseStatus)
						|| action.type.endsWith('removeTodolist/' + promiseStatus)
		}