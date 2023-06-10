import React, {ChangeEvent, FC, KeyboardEvent, memo, useLayoutEffect, useState} from 'react';
import s from "../TodoList/todolist.module.css";
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    value: string
}


export const AddItemForm: FC<AddItemFormPropsType> = memo(({addItem, value}) => {
    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>(null)
    console.log('add item form render')
    useLayoutEffect(() => {
        setInputValue(value)
    }, [value])

    const onChangeInput = (evt:ChangeEvent<HTMLInputElement>) => {
        setError('') //remove error when we start change input
        setInputValue(evt.currentTarget.value)
    }
    const maxLengthTitle = 9999
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

    const isError = !!error

    return (
        <div>
            <TextField
                value={inputValue}
                type="text"
                onChange={onChangeInput}
                onKeyDown={onKeyInputHandler}
                error={isError}
                multiline={false}
                size={"small"}
            />
            <IconButton onClick={addItemHandler}>
                <AddBoxIcon/>
            </IconButton>
            { error && <div className={s.errorMessage}>{error}</div>}
        </div>
    );
});

