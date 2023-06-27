import {createTodolist, removeTodolist, setTodoList, todoListsReducer, TodoListType} from "../reducers/todolists-reducers";
import {tasksReducer, TasksStateType} from "../reducers/task-reducers";
import {TaskPriorities, TaskStatues} from "../api/todolist-api";
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListType> = []

    let newTodolistTitle = "New Todolist";
    const testTodoItem = {id: 'todolistId1', title: newTodolistTitle, filter: "all", addedData: (new Date),
        order: 0}
    const action = createTodolist(testTodoItem)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})
test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatues.New, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'},
            {id: '2', title: 'JS', status: TaskStatues.Completed, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'},
            {id: '3', title: 'React', status: TaskStatues.Completed, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatues.Completed, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'},
            {id: '2', title: 'milk',  status: TaskStatues.New, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'},
            {id: '3', title: 'tea',  status: TaskStatues.Completed, description: '',entityStatus: 'idle',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'}
        ]
    }

    const action = removeTodolist('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be create when add new todolists', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
    const startState = {}
    const testTodoLists = [
        {id: todolistId1, title: "What to learn", filter: "all", addedData: (new Date),
            order: 0},
        {id: todolistId2, title: "What to buy", filter: "all",  addedData: (new Date),
            order: 0}
    ]

    const endState = tasksReducer(startState, setTodoList(testTodoLists))

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState[todolistId2]).toBeDefined()
})

