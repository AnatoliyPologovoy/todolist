import React, {memo} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import EditableSpan from "common/components/EditableSpan/EditableSpan";
import {List} from "@mui/material";
import {useAppSelector} from "app/store";
import {todoListsActions, todoListThunk, TodoListType} from "features/todos/todolists-reducers";
import {Task} from "features/tasks/Task/Task";
import {ButtonWithMemo} from "common/components/Button/ButtonWithMemo";
import {TaskStatues} from "features/todos/todolist-api";
import {tasksSelector} from "app/app.selectors";
import {tasksThunks} from "features/tasks/tasks-reducers";
import {useActions} from "common/hooks";


type TodolistPropsType = {
    todoList: TodoListType
}

export const Todolist = memo((props: TodolistPropsType) => {
    const {
        id: todoListId,
        title,
        filter,
        entityStatus
    } = props.todoList

    const {updateTodoListTitleTC, removeTodoListTC, changeTodolistFilter, createTaskTC} =
        useActions({...todoListThunk, ...todoListsActions, ...tasksThunks})

    let taskFromRedux = useAppSelector(tasksSelector(todoListId))

    switch (filter) {
        case "active":
            taskFromRedux = taskFromRedux.filter(task => task.status === TaskStatues.New)
            break
        case "complied":
            taskFromRedux = taskFromRedux.filter(task => task.status === TaskStatues.Completed)
            break
    }

    const isDisableButton = entityStatus === 'loading'

    //Tasks array
    const renderTasksList = taskFromRedux.map(task => {

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
