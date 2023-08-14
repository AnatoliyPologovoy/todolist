import React, {useEffect, useState} from 'react'
import {
    AppBar,
    Button,
    CircularProgress,
    createTheme,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    IconButton,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material'
import {Menu} from '@mui/icons-material'
import {lightBlue, orange} from '@mui/material/colors'
import {AllTodoLists} from 'features/todolists-lists/allTodoLists/AllTodoLists'
import {LinearLoader} from 'common/components/linearLoader/LinearLoader'
import {useAppSelector} from './store'
import {ErrorSnackbar} from 'common/components/errorSnackBar/ErrorSnackBar'
import {Navigate, Route, Routes} from 'react-router-dom'
import {Login} from 'features/auth/login/Login'
import {authThunk} from 'features/auth/auth-reducer'
import {isInitializedSelector, isLoginInSelector, statusSelector,} from 'app/app.selectors'
import {useActions} from 'common/hooks'

const App: React.FC = () => {
    const appStatus = useAppSelector(statusSelector)
    const isInitialized = useAppSelector(isInitializedSelector)
    const isLoggedIn = useAppSelector(isLoginInSelector)
    const isLoadingStatus = appStatus === 'loading'

    const [isDarkMode, setDarkMode] = useState(true)

    const { initializeApp, logout } = useActions(authThunk)

    useEffect(() => {
        initializeApp()
    }, [])

    const mode = isDarkMode ? 'dark' : 'light'

    const customTheme = createTheme({
        palette: {
            primary: lightBlue,
            secondary: orange,
            mode: mode,
        },
    })

    const logoutHandler = () => {
        isLoggedIn && logout()
    }

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: '30%',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </div>
        )
    }

    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline>
                <div className="App">
                    <AppBar position="static">
                        <Toolbar>
                            {/*<IconButton*/}
                            {/*    size="large"*/}
                            {/*    edge="start"*/}
                            {/*    color="inherit"*/}
                            {/*    aria-label="menu"*/}
                            {/*    sx={{ mr: 2 }}*/}
                            {/*>*/}
                            {/*    <Menu />*/}
                            {/*</IconButton>*/}
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                TodoList
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isDarkMode}
                                            onChange={(e) =>
                                                setDarkMode(
                                                    e.currentTarget.checked,
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        isDarkMode ?  'Dark mode' : 'Light mode'
                                    }
                                />
                            </FormGroup>

                            <Button color="inherit" onClick={logoutHandler}>
                                {isLoggedIn ? 'Logout' : 'Login'}
                            </Button>
                        </Toolbar>
                    </AppBar>
                    {/*Error messages*/}
                    <ErrorSnackbar />
                    {/* Loader*/}
                    {isLoadingStatus && <LinearLoader />}
                    {/*------TodoLists or login Page*/}
                    <Routes>
                        <Route path={'/'} element={<AllTodoLists />} />
                        <Route path={'/login'} element={<Login />} />
                        <Route path="*" element={<Navigate to={'/404'} />} />
                        <Route
                            path="/404"
                            element={<h1>404: PAGE NOT FOUND</h1>}
                        />
                    </Routes>
                </div>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
