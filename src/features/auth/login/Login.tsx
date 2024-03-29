import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {useFormik} from 'formik'
import {validate} from 'common/utils'
import {useAppDispatch} from 'common/hooks/useAppDispatch'
import {useAppSelector} from 'app/store'
import {Navigate} from 'react-router-dom'
import {authThunk} from 'features/auth/auth-reducer'
import {ResponseType} from 'features/todolists-lists/todolist-api'
import {guestLoginRequestData} from "../../../constants";
import cl from 'features/auth/login/login.module.css'

export const Login = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoginIn)
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate,
        onSubmit: (values, formikHelpers) => {
            dispatch(authThunk.login(values))
                .unwrap()
                .catch((data: ResponseType) => {
                    data.fieldsErrors?.forEach((el) => {
                        formikHelpers.setFieldError(el.field, el.error)
                    })
                })
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    const handlerGuestLoginRequestData = () => {
        dispatch(authThunk.login(guestLoginRequestData))
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <form onSubmit={formik.handleSubmit} className={cl.loginForm}>
                    <FormControl>
                        <Button
                            // className={cl.guestLoginBtn}
                            sx={{marginBottom: '30px'}}
                            variant={'contained'}
                            color={'secondary'}
                            onClick={handlerGuestLoginRequestData}
                        >
                            Guest login
                        </Button>
                        <FormGroup>
                            {/*email input*/}
                            <TextField
                                label="Email"
                                margin="normal"
                                {...formik.getFieldProps('email')}
                            />
                            {/*email errors*/}
                            {formik.errors.email && formik.touched.email && (
                                <span style={{color: 'red'}}>
                                    {formik.errors.email}
                                </span>
                            )}
                            {/*password input*/}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps('password')}
                            />
                            {/*password errors*/}
                            {formik.errors.password &&
                                formik.touched.password && (
                                    <span style={{color: 'red'}}>
                                        {formik.errors.password}
                                    </span>
                                )}
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        name={'rememberMe'}
                                        onChange={formik.handleChange}
                                        value={formik.values.rememberMe}
                                    />
                                }
                            />
                            {/*captcha*/}
                            {/*<img src={captchaUrl} alt="captchaUrl"/>*/}
                            {/*<TextField*/}
                            {/*    type="captcha"*/}
                            {/*    label="Captcha"*/}
                            {/*    margin="normal"*/}
                            {/*    {...formik.getFieldProps('captcha')}*/}
                            {/*/>*/}
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    )
}
