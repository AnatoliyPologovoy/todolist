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

    const addItemHandler = () => {
        const trimmedValue = inputValue.trim()
        if (trimmedValue !== '') {
            addItem(trimmedValue);
        }
        else {
            setError('Field is required')
        }
        setInputValue('');
    }


    const onKeyInputHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addItemHandler()
        }
    }


    //const maxTitleLength = 20
    //const isAddTaskPossible: boolean | null = !inputValue.length || inputValue.length > maxTitleLength || error

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

