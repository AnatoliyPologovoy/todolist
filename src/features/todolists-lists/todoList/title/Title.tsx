import React, {memo, useCallback} from 'react';
import EditableSpan from "common/components/editableSpan/EditableSpan";
import {useActions, useAppDispatch} from "common/hooks";
import {todoListThunk} from "features/todolists-lists/todolists-reducers";

type Props = {
		todoListId: string
		title: string
		isDisableButtons: boolean
		classes?: string
}

export const Title: React.FC<Props> = memo(
		({todoListId, title, isDisableButtons, classes}) => {
				const {removeTodoListTC} = useActions(todoListThunk)
				const dispatch = useAppDispatch()

				const changeTodoListTitle = useCallback(
						(newTitle: string) => {
								return dispatch(
										todoListThunk.updateTodoListTitleTC(
												{title: newTitle, todoListId}))
										.unwrap()
						}, [todoListId])

				const removeTodoList = useCallback(() => {
						removeTodoListTC(todoListId)
				}, [todoListId])

				return <h2>
						<EditableSpan
								disabled={isDisableButtons}
								sizeButtons={"medium"}
								title={title}
								classes={classes || ''}
								changeTitle={changeTodoListTitle}
								removeItem={removeTodoList}
						/>
				</h2>
		})