import React, {useEffect, useState} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    Checkbox,
    CircularProgress,
    createTheme,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from "@mui/icons-material";
import {lightBlue, orange} from "@mui/material/colors";
import {AllTodoLists} from "Components/AllTodoLists/AllTodoLists";
import {LinearLoader} from "Components/LinearLoader/LinearLoader";
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "Components/ErrorSnackBar/ErrorSnackBar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "Components/Login/Login";
import {useAppDispatch} from "hooks/useAppDispatch";
import {initializeAppTC, logoutTC} from "reducers/Auth-reducer";
import {isInitializedSelector, isLoginInSelector, statusSelector} from "reducers/app.selectors";


function App(): JSX.Element {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector(statusSelector)
    const isInitialized = useAppSelector(isInitializedSelector)
    const isLoggedIn = useAppSelector(isLoginInSelector)
    const isLoadingStatus = appStatus === 'loading'

    const [isDarkMode, setDarkMode] = useState(true)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const mode = isDarkMode ? 'dark' : 'light'

    const customTheme = createTheme({
        palette: {
            primary: lightBlue,
            secondary: orange,
            mode: mode
        }
    })

    const logoutHandler = () => {
        isLoggedIn && dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

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
                                TodoList
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={isDarkMode}
                                        onChange={(e) => setDarkMode(e.currentTarget.checked)}/>}
                                    label={isDarkMode ? "Light mode" : "Dark mode"}
                                />
                            </FormGroup>

                            <Button
                                color="inherit"
                                onClick={logoutHandler}
                            >
                                {isLoggedIn ? 'Logout' : 'Login'}
                            </Button>
                        </Toolbar>
                    </AppBar>
                    {/*Error messages*/}
                    <ErrorSnackbar/>
                    {/* Loader*/}
                    {isLoadingStatus && <LinearLoader/>}
                    {/*------TodoLists or Login Page*/}
                    <Routes>
                        <Route path={'/'} element={<AllTodoLists/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                        <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
