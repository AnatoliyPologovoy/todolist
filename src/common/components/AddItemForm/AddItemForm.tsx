import React, {ChangeEvent, FC, KeyboardEvent, memo, useLayoutEffect, useState} from 'react';
import s from "features/todos/TodoList/todolist.module.css";
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

export type AddItemFormPropsType = {
    addItem: (title: string, setRejectTitle: (title: string) => void) => void
    // value: string
    disabled: boolean
}

export const AddItemForm: FC<AddItemFormPropsType> = memo(({addItem, disabled}) => {
    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    const onChangeInput = (evt:ChangeEvent<HTMLInputElement>) => {
        setError('') //remove error when we start change input
        setInputValue(evt.currentTarget.value)
    }

    const maxLengthTitle = 200 //serverAPI - 100
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
            addItem(trimmedValue, setInputValue);
            setInputValue('');
        }
    }


    const onKeyInputHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addItemHandler()
        }
    }

    const isError = !!error

    return (
        <div>
            <TextField
                disabled={disabled}
                value={inputValue}
                type="text"
                onChange={onChangeInput}
                onKeyDown={onKeyInputHandler}
                error={isError}
                multiline={false}
                size={"small"}
            />
            <IconButton
                disabled={disabled}
                onClick={addItemHandler}
            >
                <AddBoxIcon/>
            </IconButton>
            { error && <div className={s.errorMessage}>{error}</div>}
        </div>
    );
});

