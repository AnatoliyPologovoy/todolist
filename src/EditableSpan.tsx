import React, {ChangeEvent, FC, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
}

const EditableSpan: FC<EditableSpanPropsType> = ({title, classes, changeTitle}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState<string>(title)

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
};

export default EditableSpan;