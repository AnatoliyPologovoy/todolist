import {v1} from "uuid";
import {appReducer, InitialAppStateType, setRejectedRequestTitle} from "../reducers/app-reducer";

test('rejected request title should be saved', () => {

    const startAppState:InitialAppStateType = {
        status: 'idle',
        error: null,
        rejectedRequestTitle: {}
    }

    const testId = v1()
    const testTitle = 'Test title'
    const testAction = setRejectedRequestTitle(testId, testTitle)

    const updateAppState = appReducer(startAppState, testAction)
    const keys = Object.keys(updateAppState.rejectedRequestTitle)
    const newTitle = updateAppState.rejectedRequestTitle[testId]

    expect(keys.length).toBe(1)
    expect(keys.includes(testId)).toBe(true)
    expect(newTitle).toBe(testTitle)
})

