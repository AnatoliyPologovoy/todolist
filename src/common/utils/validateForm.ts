import { LoginRequestType } from 'features/todolists-lists/todolist-api'

export type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

type FormikErrorType = Partial<LoginRequestType>

export const validate = (values: FormValuesType) => {
    const errors: FormikErrorType = {}
    if (!values.email) {
        errors.email = 'Required'
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }
    if (values.password.length < 4) {
        errors.password = 'Password is short'
    }
    return errors
}
