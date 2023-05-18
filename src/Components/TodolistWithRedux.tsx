import React, {memo, useCallback} from "react";
import {AddItemForm} from "./addItemForm";
import EditableSpan from "./EditableSpan";
import {IconButton, List} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../store";
import {
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC
} from "../reducers/todolists-reducers";
import {addTaskAC} from "../reducers/task-reducers";
import {Task} from "./Task";
import {ButtonWithMemo} from "./ButtonWithMemo";


type TodolistPropsType = {
    todoListId: string
    title: string,
    filter: FilterType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'complied' | 'active'

export const TodolistWithRedux = memo((props: TodolistPropsType) => {
    const {
        todoListId,
        title,
        filter,
    } = props
    const dispatch = useDispatch()

    const changeTitleTodolistCallBack = useCallback((newTitle: string) => {
        dispatch(ChangeTodolistTitleAC(newTitle, todoListId))
    }, [])

    let taskFromRedux = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todoListId])

    switch (filter) {
        case "active":
            taskFromRedux = taskFromRedux.filter(task => !task.isDone)
            break
        case "complied":
            taskFromRedux = taskFromRedux.filter(task => task.isDone)
            break
    }

    //Tasks array
    const renderTasksList = taskFromRedux.map(task => {
        return (
            <Task key={task.id}
                  taskId={task.id}
                  todoListId={todoListId}
            />
        )
    })

    //adding new tasks (button)
    const addItem = useCallback((title: string) => {
        dispatch(addTaskAC(title, todoListId));
    }, [todoListId])

    //remove todoList
    const removeTodoListOnClickHandler = () => {
        dispatch(RemoveTodolistAC(todoListId))
    }

    const onClickButtonAll = useCallback(() => {
        dispatch(ChangeTodolistFilterAC('all', todoListId))
    }, [todoListId])

    const onClickButtonComplied = useCallback(() => {
        dispatch(ChangeTodolistFilterAC('complied', todoListId))
    }, [todoListId])

    const onClickButtonActive = useCallback(() => {
        dispatch(ChangeTodolistFilterAC('active', todoListId))
    }, [todoListId])

    // @ts-ignore
    return (
        <div className={'todolist'}>
            <div>
                <h2>
                    <EditableSpan title={title} classes={''} changeTitle={changeTitleTodolistCallBack}/>
                    <IconButton
                        onClick={removeTodoListOnClickHandler}>
                        <DeleteForeverIcon fontSize={"medium"}/>
                    </IconButton>
                </h2>
            </div>
            <AddItemForm addItem={addItem}/>
            <List sx={{width: '100%', maxWidth: 360}}
                  subheader
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
