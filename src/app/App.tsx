import React, {useState} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    Checkbox,
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
import {AllTodoLists} from "../Components/AllTodoLists/AllTodoLists";
import {LinearLoader} from "../Components/LinearLoader/LinearLoader";
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../Components/ErrorSnackBar/ErrorSnackBar";


function App(): JSX.Element {
    const appStatus
        = useAppSelector(state => state.app.status)

    const isLoadingStatus = appStatus === 'loading'

    const [isDarkMode, setDarkMode] = useState(true)

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
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                    {/*Error messages*/}
                    <ErrorSnackbar/>
                    {/* Loader*/}
                    {isLoadingStatus && <LinearLoader/>}
                    {/*------TodoLists:*/}
                    <AllTodoLists/>
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
