import React, {memo, useCallback, useEffect} from "react";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import {List} from "@mui/material";
import {useAppSelector} from "app/store";
import {changeTodoListTitleTC, removeTodoListTC, todoListsActions, TodoListType} from "reducers/todolists-reducers";
import {createTaskTC, setTasksTC} from "reducers/task-reducers";
import {Task} from "../Task/Task";
import {ButtonWithMemo} from "../ButtonWithMemo";
import {TaskStatues} from "api/todolist-api";
import {useAppDispatch} from "hooks/useAppDispatch";


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

    let taskFromRedux =
        useAppSelector(state => state.tasks[todoListId])

    // useEffect(() => {
    //     dispatch(setTasksTC(todoListId))
    // }, [])



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
        dispatch(createTaskTC(todoListId, title, setRejectTitle));
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
