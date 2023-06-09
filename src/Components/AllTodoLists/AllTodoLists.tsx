import React, {useCallback, useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {createTodoListTC, fetchTodoListsTC, TodoListType} from "../../reducers/todolists-reducers";
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {Todolist} from "../TodoList/Todolist";

export const AllTodoLists = () => {

    const todoLists =
        useSelector<AppRootStateType, TodoListType[]>(state => state.todolists)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])


    const createTodoList = useCallback((title: string) => {
        dispatch(createTodoListTC(title))
    }, [])


    const todoListsComponents = todoLists.map(tdl => {
        return (
            <Grid item>
                <Todolist
                    key={tdl.id}
                    todoListId={tdl.id}
                    title={tdl.title}
                    filter={tdl.filter}
                />
            </Grid>
        )
    })

    return (
        <Container fixed>
            <Grid container sx={{p: '15px 0'}}>
                <AddItemForm addItem={createTodoList}/>
            </Grid>
            <Grid container spacing={4}>
                {todoListsComponents}
            </Grid>
        </Container>
    );
};
