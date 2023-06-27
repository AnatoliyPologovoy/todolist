import {v1} from "uuid";
import {
    AddTodolistAT, createTodolist, changeTodolistFilter,
    ChangeTodolistFilterAT, changeTodolistTitle,
    ChangeTodolistTitleAT, removeTodolist,
    RemoveTodolistAT,
    todoListsReducer, TodoListType
} from "../reducers/todolists-reducers";
import {FilterType} from "../reducers/task-reducers";

let todolistId1: string
let todolistId2: string

let startState: Array<TodoListType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {
            id: todolistId1,
            title: "What to learn",
            filter: "all",
            addedData: (new Date),
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: "all",
            addedData: (new Date),
            order: 0,
            entityStatus: 'idle'
        }
    ]
})

test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, removeTodolist(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});
test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";
    const testTodoItem = {
        id: 'todolistId1', title: newTodolistTitle, filter: "all", addedData: (new Date),
        order: 0
    }
    const endState = todoListsReducer(startState, createTodolist(testTodoItem))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});
test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, changeTodolistTitle(newTodolistTitle, todolistId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});
test('correct todolist should change filter', () => {

    let newFilter: FilterType = "complied";

    const endState = todoListsReducer(startState, changeTodolistFilter(newFilter, todolistId2));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});