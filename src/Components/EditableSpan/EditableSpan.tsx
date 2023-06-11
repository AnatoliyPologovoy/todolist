import React, {ChangeEvent, FC, memo, useLayoutEffect, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ButtonGroup from "@mui/material/ButtonGroup";
import BeenhereIcon from '@mui/icons-material/Beenhere';

type EditableSpanPropsType = {
    disabled: boolean
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
    removeItem: () => void
    sizeButtons: 'small' | 'medium' | 'large'
    rejectedRequestUpdateTitle: string | null
}

const EditableSpan: FC<EditableSpanPropsType> = memo((props) => {
    const {
        title, classes, changeTitle, removeItem, sizeButtons, disabled,
        rejectedRequestUpdateTitle
    } = props
    const [isEditMode, setIsEditMode] = useState(false)
    const [inputValue, setInputValue] = useState<string>(title)

    useLayoutEffect(() => {
        if (rejectedRequestUpdateTitle) {
            setIsEditMode(true)
            setInputValue(rejectedRequestUpdateTitle)
        }
    }, [rejectedRequestUpdateTitle])


    const onEditMode = () => {
        if (!disabled) { // if not disable
            setIsEditMode(true)
        }
    }
    const saveTitle = () => {
        setIsEditMode(false)
        changeTitle(inputValue)
    }

    const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
        setInputValue(evt.currentTarget.value)
    }

    //render title
    const textEditableMode =
        <TextField
            sx={{
                width: 140
            }}
            size={'small'}
            variant="standard"
            onBlur={saveTitle}
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

    // render buttons
    const editButton =
        <IconButton
            size={"small"}
            onClick={onEditMode}
            disabled={disabled}
        >
            <EditIcon fontSize={sizeButtons}/>
        </IconButton>

    const saveButton =
        <IconButton
            size={"small"}
            onClick={saveTitle}
        >
            <BeenhereIcon fontSize={sizeButtons}/>
        </IconButton>

    const renderUpdateButton = isEditMode ? saveButton : editButton

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
            <div>
                {renderTitle}
            </div>
            <ButtonGroup>
                {renderUpdateButton}

                {/*----Delete button-----*/}

                <IconButton
                    size={"small"}
                    onClick={removeItem}
                    disabled={disabled}
                >
                    <DeleteForeverIcon fontSize={sizeButtons}/>
                </IconButton>
            </ButtonGroup>
        </div>
    );
});

export default EditableSpan;