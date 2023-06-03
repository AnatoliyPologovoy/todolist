import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {AddItemForm} from "./addItemForm";
import {
    AppBar,
    Button,
    Checkbox, Container, createTheme, CssBaseline,
    FormControlLabel,
    FormGroup, Grid,
    IconButton, ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from "@mui/icons-material";
import {lightBlue, orange} from "@mui/material/colors";
import {AddTodolistAC, fetchTodoListsTC, setTodoList, TodoListType} from "../reducers/todolists-reducers";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../store";
import {TodolistWithRedux} from "./TodolistWithRedux";
import {useAppDispatch} from "../hooks/useAppDispatch";


function AppWithRedux(): JSX.Element {
    //BLL:
    const todoLists =
        useSelector<AppRootStateType, TodoListType[]>(state => state.todolists)
    //
    // const tasks =
    //     useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])

    const [isDarkMode, setDarkMode] = useState(true)

    const addTodoList = useCallback((title: string) => {
        dispatch(AddTodolistAC(title))
    }, [])


    const todoListsComponents = todoLists.map(tdl => {
        return (
            <Grid item>
                <TodolistWithRedux
                    key={tdl.id}
                    todoListId={tdl.id}
                    title={tdl.title}
                    filter={tdl.filter}
                />
            </Grid>
        )
    })

    const mode = isDarkMode ? 'dark' : 'light'
    const customTheme = createTheme({
        palette: {
            primary: lightBlue,
            secondary: orange,
            mode: mode
        }
    })

    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline>
                <div className="App">
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <Menu/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                TodoLis
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={isDarkMode}
                                        onChange={(e) => setDarkMode(e.currentTarget.checked)}/>}
                                    label={isDarkMode ? "Light mode" : "Dark mode"}
                                />
                            </FormGroup>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                    <Container fixed>
                        <Grid container sx={{p: '15px 0'}}>
                            <AddItemForm addItem={addTodoList}/>
                        </Grid>
                        <Grid container spacing={4}>
                            {todoListsComponents}
                        </Grid>
                    </Container>
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default AppWithRedux;
