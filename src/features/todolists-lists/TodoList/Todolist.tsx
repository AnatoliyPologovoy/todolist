import React, {memo} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import EditableSpan from "common/components/EditableSpan/EditableSpan";
import {List} from "@mui/material";
import {useAppSelector} from "app/store";
import {todoListsActions, todoListThunk, TodoListType} from "features/todolists-lists/todolists-reducers";
import {Task} from "features/todolists-lists/tasks/Task/Task";
import {ButtonWithMemo} from "common/components/Button/ButtonWithMemo";
import {TaskStatues} from "features/todolists-lists/todolist-api";
import {tasksSelector} from "app/app.selectors";
import {tasksThunks} from "features/todolists-lists/tasks/tasks-reducers";
import {useActions} from "common/hooks";
import {getFilteredTasks} from "common/utils/getFilteredTasks";


type Props = {
    todoList: TodoListType
}

export const Todolist: React.FC<Props> = memo(({todoList}) => {
    const {
        id: todoListId,
        title,
        filter,
        entityStatus
    } = todoList

    const {updateTodoListTitleTC, removeTodoListTC, changeTodolistFilter, createTaskTC} =
        useActions({...todoListThunk, ...todoListsActions, ...tasksThunks})

    let tasks = useAppSelector(tasksSelector(todoListId))
    tasks = getFilteredTasks(tasks, filter)

    const isDisableButton = entityStatus === 'loading'

    const renderTasksList = tasks.map(task => {
        return (
            <Task key={task.id}
                  task={task}
            />
        )
    })

    const changeTodoListTitle =
        (newTitle: string, setRejectTitle: (title: string) => void) => {
            updateTodoListTitleTC({title: newTitle, todoListId, setRejectTitle})
        }

    const createTask =
        (title: string, setRejectTitle: (title: string) => void) => {
        createTaskTC({todoListId, title, setRejectTitle})
    }

    const removeTodoList = () => {
        removeTodoListTC(todoListId)
    }

    const onClickButtonAll = () => {
        changeTodolistFilter({filter: 'all',id: todoListId})
    }

    const onClickButtonComplied = () => {
       changeTodolistFilter({filter: 'complied',id: todoListId})
    }

    const onClickButtonActive = () => {
      changeTodolistFilter({filter: 'active', id: todoListId})
    }

    return (
        <div className={'todolist'}>
            <div>
                <h2>
                    <EditableSpan
                        disabled={isDisableButton}
                        sizeButtons={"medium"}
                        title={title} classes={''}
                        changeTitle={changeTodoListTitle}
                        removeItem={removeTodoList}
                    />
                </h2>
            </div>
            <AddItemForm
                addItem={createTask}
                disabled={isDisableButton}
            />
            <List sx={{width: '100%', maxWidth: 360}}
                  subheader={false}
            >
                {renderTasksList}
            </List>
            <ButtonWithMemo
                title={'All'}
                color={'all'}
                filter={filter}
                onClickHandler={onClickButtonAll}
            />
            &nbsp;
            <ButtonWithMemo
                title={'Complied'}
                color={'complied'}
                filter={filter}
                onClickHandler={onClickButtonComplied}
            />
            &nbsp;
            <ButtonWithMemo
                title={'Active'}
                color={'active'}
                filter={filter}
                onClickHandler={onClickButtonActive}
            />
        </div>
    )
})
