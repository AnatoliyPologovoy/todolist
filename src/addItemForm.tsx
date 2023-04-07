import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';
import s from "./todolist.module.css";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}


export const AddItemForm: FC<AddItemFormPropsType> = ({addItem}) => {
    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    const onChangeInput = (evt:ChangeEvent<HTMLInputElement>) => {
        setError('') //remove error when we start change input
        setInputValue(evt.currentTarget.value)
    }
    const maxLengthTitle = 20
    const minLengthTitle = 5

    const addItemHandler = () => {
        const trimmedValue = inputValue.trim()
        let isAddTaskPossible = true
        if (trimmedValue === '') {
            setError('Field is required')
            isAddTaskPossible = false
        }
        if (trimmedValue.length > maxLengthTitle) {
            setError('Title is too long')
            isAddTaskPossible = false
        }
        if (trimmedValue.length < minLengthTitle) {
            setError('Title is too short')
            isAddTaskPossible = false
        }
        if (isAddTaskPossible) {
            addItem(trimmedValue);
            setInputValue('');
        }
    }


    const onKeyInputHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addItemHandler()
        }
    }

    return (
        <div>
            <input
                value={inputValue}
                type="text"
                onChange={onChangeInput}
                onKeyDown={onKeyInputHandler}
                className={error ? s.error : ''}
            />
            <button onClick={addItemHandler}>+</button>
            { error && <div className={s.errorMessage}>{error}</div>}
        </div>
    );
};

