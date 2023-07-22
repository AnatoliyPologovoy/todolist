import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import s from "features/todolists-lists/todoList/todolist.module.css";
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

export type AddItemFormPropsType = {
    addItem: (title: string) => Promise<any>
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
        let isAddItemPossible = true
        if (trimmedValue === '') {
            setError('Field is required')
            isAddItemPossible = false
        }
        if (trimmedValue.length > maxLengthTitle) {
            setError('title is too long')
            isAddItemPossible = false
        }
        if (trimmedValue.length < minLengthTitle) {
            setError('title is too short')
            isAddItemPossible = false
        }
        if (isAddItemPossible) {
            const res = addItem(trimmedValue);
            res
                .then(data => setInputValue(''))
                .catch(e => setInputValue(trimmedValue))
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

