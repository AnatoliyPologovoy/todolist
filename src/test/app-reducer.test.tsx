import {v1} from "uuid";
import {
    appReducer,
    InitialAppStateType, setRejectedRequestChangeTaskTitle,
    setRejectedRequestChangeTitle,
    setRejectedRequestNewTitle
} from "../reducers/app-reducer";

test('rejected request new title should be saved', () => {

    const startAppState:InitialAppStateType = {
        status: 'idle',
        error: null,
        rejectedRequestTitle: {},
    }

    const testId = v1()
    const testTitle = 'Test title'
    const testAction = setRejectedRequestNewTitle(testId, testTitle)

    const updateAppState = appReducer(startAppState, testAction)
    const keys = Object.keys(updateAppState.rejectedRequestTitle)
    const newTitle = updateAppState.rejectedRequestTitle[testId].newTitle

    expect(keys.length).toBe(1)
    expect(keys.includes(testId)).toBe(true)
    expect(newTitle).toBe(testTitle)
})

test('rejected request change title should be saved', () => {

    const startAppState:InitialAppStateType = {
        status: 'idle',
        error: null,
        rejectedRequestTitle: {},
    }

    const testId = v1()
    const testTitle = 'Test title'
    const testAction = setRejectedRequestChangeTitle(testId, testTitle)

    const updateAppState = appReducer(startAppState, testAction)
    const keys = Object.keys(updateAppState.rejectedRequestTitle)
    const newTitle = updateAppState.rejectedRequestTitle[testId].updateTitle

    expect(keys.length).toBe(1)
    expect(keys.includes(testId)).toBe(true)
    expect(newTitle).toBe(testTitle)
})

test('rejected request on change title task should be saved', () => {

    const startAppState:InitialAppStateType = {
        status: 'idle',
        error: null,
        rejectedRequestTitle: {},
    }

    const testTodoId = v1()
    const testTaskId = v1()
    const testTitle = 'Test title'
    const testAction = setRejectedRequestChangeTaskTitle(testTodoId, testTaskId, testTitle)

    const updateAppState = appReducer(startAppState, testAction)
    const keys = Object.keys(updateAppState.rejectedRequestTitle[testTodoId].taskTitle)
    const newTitle = updateAppState.rejectedRequestTitle[testTodoId].taskTitle[testTaskId]

    expect(keys.length).toBe(1)
    expect(keys.includes(testTaskId)).toBe(true)
    expect(newTitle).toBe(testTitle)
})

