import React, {useCallback, useEffect} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {useAppSelector} from "app/store";
import {todoListThunk} from "features/todolists-lists/todolists-reducers";
import {useActions, useAppDispatch} from "common/hooks";
import {Todolist} from "features/todolists-lists/todoList/Todolist";
import {Navigate} from "react-router-dom";
import {isLoggedInSelector, todoListsSelector} from "app/app.selectors";


export const AllTodoLists = () => {

    const {fetchTodoListsTC} = useActions(todoListThunk)
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(todoListsSelector)
    const isLoggedIn = useAppSelector(isLoggedInSelector)

    useEffect(() => {
        if (isLoggedIn) {
            fetchTodoListsTC()
        }
    }, [])

    const createTodoList = useCallback(
        (title: string, setRejectTitle: (title: string) => void) => {
            return dispatch(todoListThunk.createTodoListTC(
                {title, setRejectTitle}))
                .unwrap()
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
