import {tasksActions, tasksReducer, TasksStateType, tasksThunks} from 'reducers/task-reducers'
import {todoListsActions} from "reducers/todolists-reducers";
import {TaskPriorities, TaskStatues} from "api/todolist-api";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatues.New, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            },
            {
                id: '2', title: 'JS', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            },
            {
                id: '3', title: 'React', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
            },
            {
                id: '2', title: 'milk', status: TaskStatues.New, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
            },
            {
                id: '3', title: 'tea', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = tasksActions.removeTask({taskId: '2', todoListId: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatues.New, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            },
            {
                id: '2', title: 'JS', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            },
            {
                id: '3', title: 'React', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId1'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
            },
            {
                id: '3', title: 'tea', status: TaskStatues.Completed, description: '', entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
                addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
            }
        ]
    })
})

test('tasks should be added for todolist', () => {
    const action = tasksThunks.fetchTasksTC.fulfilled(
        {tasks: startState["todolistId1"], todoListId: "todolistId1"},
        'requestId',
        "todolistId1"
    );

    const endState = tasksReducer(
        {
            todolistId2: [],
            todolistId1: [],
        },
        action
    );

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(0);
})

test('correct task should be added to correct array', () => {
    const task = {
        id: '3', title: 'juce', status: TaskStatues.Completed, description: '',
        completed: false, priority: TaskPriorities.Low, startDate: new Date(2011, 0, 1),
        addedDate: new Date(2011, 0, 1), order: 0, deadline: new Date(2011, 0, 1), todoListId: 'todolistId2'
    }
    const action = tasksActions.createTask({task})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
})

// test('status of specified task should be changed', () => {
//
//     const action = changeTaskStatusAC('2', TaskStatues.New, 'todolistId2')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][1].status).toBe(TaskStatues.New)
//     expect(endState['todolistId1'][1].status).toBe(TaskStatues.Completed)
// })
//
// test('title of specified task should be changed', () => {
//
//     const action = changeTaskTitleAC('3', 'new title', 'todolistId2')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][2].title).toBe('new title')
//     expect(endState['todolistId1'][2].title).toBe('React')
// })

test('entityStatus of specified task should be changed', () => {

    const action = tasksActions.changeTaskEntityStatus({
        taskId: '3',
        entityStatus: 'loading',
        todoListId: 'todolistId2'
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][2].entityStatus).toBe('loading')
    expect(endState['todolistId1'][2].entityStatus).toBe('idle')
})

test('new array should be added when new todolist is added', () => {
    const testTodoItem = {
        id: 'todolistId3', title: 'new todolist', filter: "all", addedData: (new Date),
        order: 0
    }
    const action = todoListsActions.createTodolist({todoItem: testTodoItem})

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})



