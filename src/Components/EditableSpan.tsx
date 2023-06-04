import React, {ChangeEvent, FC, memo, useLayoutEffect, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type EditableSpanPropsType = {
    isEditMode?: boolean
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
}

const EditableSpan: FC<EditableSpanPropsType> = memo(({title, classes, changeTitle, ...props}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState<string>(title)

    useLayoutEffect(() => {
        if (props.isEditMode) {
            setIsEditMode(true)
        }
    }, [props.isEditMode])

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

    //render
    const textEditableMode =
        <TextField
            size={'small'}
            variant="standard"
            onBlur={offEditMode}
            autoFocus
            value={inputValue}
            onChange={onChangeInput}
        />

    const textViewMode =
        <span className={classes}
              onDoubleClick={onEditMode}
        >
            {title}
        </span>

    const renderTitle = isEditMode ? textEditableMode : textViewMode


    return (
        <>
            {renderTitle}
        </>
    );
});

export default EditableSpan;