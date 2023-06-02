import {AddTodolistAC, RemoveTodolistAC, todolistsReducer, TodoListType} from "./todolists-reducers";
import {tasksReducer, TasksStateType} from "./task-reducers";
import {TaskPriorities, TaskStatues} from "../api/todolist-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListType> = []

    const action = AddTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})
test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatues.New, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'},
            {id: '2', title: 'JS', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'},
            {id: '3', title: 'React', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId1'}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'},
            {id: '2', title: 'milk',  status: TaskStatues.New, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'},
            {id: '3', title: 'tea',  status: TaskStatues.Completed, description: '',
                completed: false, priority: TaskPriorities.Low, startDate: (new Date),
                addedDate: (new Date), order: 0, deadline: (new Date), todoListId: 'todolistId2'}
        ]
    }

    const action = RemoveTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

