import React, {memo, useCallback} from 'react';
import EditableSpan from "common/components/EditableSpan/EditableSpan";
import {useActions} from "common/hooks";
import {todoListThunk} from "features/todolists-lists/todolists-reducers";

type Props = {
		todoListId: string
		title: string
		isDisableButtons: boolean
}

export const Title: React.FC<Props> = memo(({todoListId, title, isDisableButtons}) => {
		const {updateTodoListTitleTC, removeTodoListTC} = useActions(todoListThunk)

		const changeTodoListTitle = useCallback(
				(newTitle: string, setRejectTitle: (title: string) => void) => {
						updateTodoListTitleTC({title: newTitle, todoListId, setRejectTitle})
				}, [todoListId])

		const removeTodoList = useCallback(() => {
				removeTodoListTC(todoListId)
		}, [todoListId])

		return <h2>
				<EditableSpan
						disabled={isDisableButtons}
						sizeButtons={"medium"}
						title={title} classes={''}
						changeTitle={changeTodoListTitle}
						removeItem={removeTodoList}
				/>
		</h2>
})