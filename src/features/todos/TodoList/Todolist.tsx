import React, {memo, useCallback} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import EditableSpan from "common/components/EditableSpan/EditableSpan";
import {List} from "@mui/material";
import {useAppSelector} from "app/store";
import {changeTodoListTitleTC, removeTodoListTC, todoListsActions, TodoListType} from "features/todos/todolists-reducers";
import {Task} from "features/tasks/Task/Task";
import {ButtonWithMemo} from "common/components/Button/ButtonWithMemo";
import {TaskStatues} from "api/todolist-api";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {tasksSelector} from "app/app.selectors";
import {tasksThunks} from "features/tasks/tasks-reducers";


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

    const dispatch = useAppDispatch()

    let taskFromRedux = useAppSelector(tasksSelector(todoListId))

    const changeTodoListTitle = useCallback(
        (newTitle: string, setRejectTitle: (title: string) => void) => {
        dispatch(changeTodoListTitleTC(newTitle, todoListId, setRejectTitle))
    }, [])


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

    //adding new tasks (button)
    const createTask = useCallback(
        (title: string, setRejectTitle: (title: string) => void) => {
        dispatch(tasksThunks.createTaskTC({todoListId, title, setRejectTitle}));
    }, [todoListId])

    //remove todoList
    const removeTodoList = () => {
        dispatch(removeTodoListTC(todoListId))
    }

    const onClickButtonAll = useCallback(() => {
        dispatch(todoListsActions.changeTodolistFilter(
            {filter: 'all',id: todoListId}))
    }, [todoListId])

    const onClickButtonComplied = useCallback(() => {
        dispatch(todoListsActions.changeTodolistFilter(
            {filter: 'complied',id: todoListId}))
    }, [todoListId])

    const onClickButtonActive = useCallback(() => {
        dispatch(todoListsActions.changeTodolistFilter(
            {filter: 'active', id: todoListId}))
    }, [todoListId])

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
