import React, {ChangeEvent, FC, memo, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
}

const EditableSpan: FC<EditableSpanPropsType> = memo(({title, classes, changeTitle}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState<string>(title)
    console.log('EditableSpan')

    const onEditMode = () => {
        setIsEditMode(true)
    }
    const offEditMode = () => {
        setIsEditMode(false)
        changeTitle(inputValue)
    }

    const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
        setInputValue(evt.currentTarget.value)
    }

    return (
        isEditMode ?
            <TextField
                size={'small'}
                variant="standard"
                onBlur={offEditMode}
                autoFocus
                value={inputValue}
                onChange={onChangeInput}
            />
            :
            <span className={classes}
                  onDoubleClick={onEditMode}
            >
                {title}
            </span>
    );
});

export default EditableSpan;