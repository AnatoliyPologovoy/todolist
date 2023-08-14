import { v1 } from 'uuid'
import {
    todoListsActions,
    todoListsReducer,
    todoListThunk,
    TodoListType,
} from 'features/todolists-lists/todolists-reducers'
import { FilterType } from 'features/todolists-lists/tasks/tasks-reducers'

let todolistId1: string
let todolistId2: string

let startState: Array<TodoListType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {
            id: todolistId1,
            title: 'What to learn',
            filter: 'all',
            addedData: new Date(),
            order: 0,
            entityStatus: 'idle',
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: 'all',
            addedData: new Date(),
            order: 0,
            entityStatus: 'idle',
        },
    ]
})

test('correct todolist should be removed', () => {
    const action = todoListThunk.removeTodoListTC.fulfilled(
        todolistId1,
        'requestId',
        todolistId1,
    )

    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})
test('correct todolist should be added', () => {
    let newTodolistTitle = 'New Todolist'
    const testTodoItem = {
        id: 'todolistId1',
        title: newTodolistTitle,
        filter: 'all',
        addedData: new Date(),
        order: 0,
    }
    const action = todoListThunk.createTodoListTC.fulfilled(
        testTodoItem,
        'requestId',
        newTodolistTitle,
    )
    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})
test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'
    const action = todoListThunk.updateTodoListTitleTC.fulfilled(
        { title: newTodolistTitle, todoListId: todolistId2 },
        'requestId',
        { title: newTodolistTitle, todoListId: todolistId2 },
    )
    const endState = todoListsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})
test('correct todolist should change filter', () => {
    let newFilter: FilterType = 'complied'

    const endState = todoListsReducer(
        startState,
        todoListsActions.changeTodolistFilter({
            filter: newFilter,
            id: todolistId2,
        }),
    )

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})
