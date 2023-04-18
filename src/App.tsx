import React, {useState} from 'react';
import './App.css';
import {FilterType, TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
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

export type TodoListType = {
    id: string
    title: string
    filter: FilterType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App(): JSX.Element {
    //BLL:
    const tdlId_1 = v1()
    const tdlId_2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: tdlId_1, title: 'What to learn', filter: 'all'},
        {id: tdlId_2, title: 'What to buy', filter: 'all'}
    ])

    const [tasks, setTask] = useState<TasksStateType>(
        {
            [tdlId_1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Redux", isDone: false},
                {id: v1(), title: "SQL", isDone: false},
            ],
            [tdlId_2]: [
                {id: v1(), title: "Milk", isDone: false},
                {id: v1(), title: "Egs", isDone: true},
                {id: v1(), title: "Bread", isDone: false},
            ]
        })

    const [isDarkMode, setDarkMode] = useState(true)

    //CRUD todoLists
    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tdl => tdl.id !== todoListId))
        const newTasks = {...tasks}
        delete newTasks[todoListId]
        setTask(newTasks)
    }
    const addTodoList = (title: string) => {
        const newTodo: TodoListType = {
            id: v1(),
            title,
            filter: 'all'
        }
        setTodoLists([...todoLists, newTodo])
        setTask({[newTodo.id]: [], ...tasks})
    }
    const changeTitleTodolist = (todoListId: string, title: string) => {
        setTodoLists(
            todoLists.map(tdl => tdl.id === todoListId ? {...tdl, title} : tdl)
        )
    }
    const changeFilter = (filterValue: FilterType, todoListId: string) => {
        const updatedTodoList = todoLists.map(tdl => {
            return tdl.id === todoListId ? {...tdl, filter: filterValue} : tdl
        })
        setTodoLists(updatedTodoList)
    }
    //CRUD tasks
    const removeTask = (taskId: string, todoListId: string) => {
        const updatedTasks = tasks[todoListId].filter(task => task.id !== taskId)
        setTask(
            {...tasks, [todoListId]: updatedTasks}
        )
    }
    const addTask = (titleTask: string, todoListId: string) => {
        const newTask = {id: v1(), title: titleTask, isDone: false}
        const updatedTasks = [newTask, ...tasks[todoListId]]
        setTask({...tasks, [todoListId]: updatedTasks})
    }
    const changeIsDoneTask = (taskId: string, newIsDown: boolean, todoListId: string) => {
        const updatedTasks = tasks[todoListId].map(task => {
            return task.id === taskId ? {...task, isDone: newIsDown} : task
        })
        setTask({...tasks, [todoListId]: updatedTasks})
    }
    const changeTitleTask = (taskId: string, title: string, todoListId: string) => {
        const updatedTasks = tasks[todoListId].map(task => {
            return task.id === taskId ? {...task, title} : task
        })
        setTask({...tasks, [todoListId]: updatedTasks})
    }

    //UI:
    const filteringTasksForRender = (tasks: TaskType[], filter: FilterType) => {
        const filteredTasks = tasks
        switch (filter) {
            case "active":
                return filteredTasks.filter(task => !task.isDone)
            case "complied":
                return filteredTasks.filter(task => task.isDone)
            default:
                return filteredTasks
        }
    }

    const todoListsComponents = todoLists.map(tdl => {
        const filteredTasks: TaskType[] = filteringTasksForRender(tasks[tdl.id], tdl.filter)
        return (
            <Grid item>
                <Todolist
                    key={tdl.id}
                    todoListId={tdl.id}
                    title={tdl.title}
                    filter={tdl.filter}
                    tasks={filteredTasks}
                    removeTask={removeTask}
                    changeStatusTask={changeIsDoneTask}
                    addTask={addTask}
                    changeFilter={changeFilter}
                    removeTodoList={removeTodoList}
                    changeTitleTask={changeTitleTask}
                    changeTitleTodolist={changeTitleTodolist}
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
                                TodoLists
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={isDarkMode}
                                        onChange={(e)=>setDarkMode(e.currentTarget.checked)} />}
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

export default App;
