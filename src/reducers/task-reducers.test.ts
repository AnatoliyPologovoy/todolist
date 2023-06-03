import {
    createTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType
} from './task-reducers'
import {AddTodolistAC} from "./todolists-reducers";
import {TaskPriorities, TaskStatues} from "../api/todolist-api";

let startState: TasksStateType

beforeEach(()=> {
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatues.New, description: '',
            completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
            addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'},
            {id: '2', title: 'JS', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'},
            {id: '3', title: 'React', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'},
            {id: '2', title: 'milk',  status: TaskStatues.New, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'},
            {id: '3', title: 'tea',  status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'}
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatues.New, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'},
            {id: '2', title: 'JS', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'},
            {id: '3', title: 'React', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'},
            {id: '3', title: 'tea',  status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'}
        ]
    })
})

test('correct task should be added to correct array', () => {
    const task =             {id: '3', title: 'juce',  status: TaskStatues.Completed, description: '',
        completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
        addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'}
    const action = createTaskAC(task)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('2', TaskStatues.New, 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatues.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatues.Completed)
})

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('3', 'new title', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][2].title).toBe('new title')
    expect(endState['todolistId1'][2].title).toBe('React')
})

test('new array should be added when new todolist is added', () => {

    const action = AddTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})



