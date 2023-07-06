import React, {useCallback, useEffect} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {useAppSelector} from "app/store";
import {todoListThunk} from "features/todos/todolists-reducers";
import {useAppDispatch} from "common/hooks";
import {Todolist} from "features/todos/TodoList/Todolist";
import {Navigate} from "react-router-dom";
import {isLoggedInSelector, todoListsSelector} from "app/app.selectors";


export const AllTodoLists = () => {

    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(todoListsSelector)
    const isLoggedIn = useAppSelector(isLoggedInSelector)

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(todoListThunk.fetchTodoListsTC())
        }
    }, [])

    const createTodoList = useCallback(
        (title: string, setRejectTitle: (title: string) => void) => {
            dispatch(todoListThunk.createTodoListTC({title, setRejectTitle}))
        }, [])


    const todoListsComponents = todoLists.map(tdl => {
        return (
            <Grid item key={tdl.id}>
                <Todolist
                    key={tdl.id}
                    todoList={tdl}
                />
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <Container fixed>
            <Grid container sx={{p: '15px 0'}}>
                <AddItemForm
                    disabled={false}
                    addItem={createTodoList}
                />
            </Grid>
            <Grid container spacing={4}>
                {todoListsComponents}
            </Grid>
        </Container>
    );
};
