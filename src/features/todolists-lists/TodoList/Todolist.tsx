import React, {memo, useCallback} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {List} from "@mui/material";
import {useAppSelector} from "app/store";
import {TodoListType} from "features/todolists-lists/todolists-reducers";
import {Task} from "features/todolists-lists/tasks/Task/Task";
import {tasksSelector} from "app/app.selectors";
import {tasksThunks} from "features/todolists-lists/tasks/tasks-reducers";
import {useActions} from "common/hooks";
import {getFilteredTasks} from "common/utils/getFilteredTasks";
import FilterButtonsGroup from "features/todolists-lists/TodoList/FilterButtonsGroup/FilterButtonsGroup";
import {Title} from "features/todolists-lists/TodoList/Title/Title";
import cl from "./todolist.module.css"
import {Tasks} from "features/todolists-lists/tasks/Tasks";

type Props = {
		todoList: TodoListType
}

export const Todolist: React.FC<Props> = memo(({todoList}) => {
		const {id: todoListId, title, filter, entityStatus} = todoList

		const {createTaskTC} = useActions(tasksThunks)

		let tasks = useAppSelector(tasksSelector(todoListId))
		tasks = getFilteredTasks(tasks, filter)

		const createTask = useCallback(
				(title: string, setRejectTitle: (title: string) => void) => {
						createTaskTC({todoListId, title, setRejectTitle})
				}, [todoListId])

		const isDisableButtons = entityStatus === 'loading'

		return (
				<div className={cl.todoList}>
						<Title todoListId={todoListId}
									 title={title}
									 isDisableButtons={isDisableButtons}
									 classes={cl.title}
						/>
						<AddItemForm
								addItem={createTask}
								disabled={isDisableButtons}
						/>
						<List
								className={cl.list}
								subheader={false}
						>
								<Tasks tasks={tasks}/>
						</List>
						<FilterButtonsGroup
								todoListId={todoListId}
								filter={filter}
						/>
				</div>
		)
})
