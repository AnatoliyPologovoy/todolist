import React, {memo, useCallback, useEffect} from "react";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import {IconButton, List} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useAppSelector} from "../../app/store";
import {
    changeTodolistFilter,
    changeTodoListTitleTC,
    removeTodoListTC,
    TodoListType
} from "../../reducers/todolists-reducers";
import {createTaskTC, FilterType, setTasksTC} from "../../reducers/task-reducers";
import {Task} from "../Task/Task";
import {ButtonWithMemo} from "../ButtonWithMemo";
import {TaskStatues} from "../../api/todolist-api";
import {useAppDispatch} from "../../hooks/useAppDispatch";


type TodolistPropsType = {
    // todoListId: string
    // title: string,
    // filter: FilterType
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
    const allRejectedRequestTitles =
        useAppSelector(state => state.app.rejectedRequestTitle)
    //check for rejected request title
    const rejectedRequestTitle = allRejectedRequestTitles[todoListId] || ''

    useEffect(() => {
        dispatch(setTasksTC(todoListId))
    }, [])


    const changeTitleTodolist = useCallback((newTitle: string) => {
        dispatch(changeTodoListTitleTC(newTitle, todoListId))
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
    const createTask = useCallback((title: string) => {
        dispatch(createTaskTC(todoListId, title));
    }, [todoListId])

    //remove todoList
    const removeTodoList = () => {
        dispatch(removeTodoListTC(todoListId))
    }

    const onClickButtonAll = useCallback(() => {
        dispatch(changeTodolistFilter('all', todoListId))
    }, [todoListId])

    const onClickButtonComplied = useCallback(() => {
        dispatch(changeTodolistFilter('complied', todoListId))
    }, [todoListId])

    const onClickButtonActive = useCallback(() => {
        dispatch(changeTodolistFilter('active', todoListId))
    }, [todoListId])

    return (
        <div className={'todolist'}>
            <div>
                <h2>
                    <EditableSpan
                        disabled={isDisableButton}
                        sizeButtons={"medium"}
                        title={title} classes={''}
                        changeTitle={changeTitleTodolist}
                        removeItem={removeTodoList}
                    />
                </h2>
            </div>
            <AddItemForm addItem={createTask} value={rejectedRequestTitle}/>
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
