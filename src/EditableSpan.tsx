import React, {ChangeEvent, FC, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    classes: string
    changeTitle: (newTitle: string) => void
}

const EditableSpan: FC<EditableSpanPropsType> = ({title, classes, changeTitle}) => {
    const [isEditMode, setIsEditMode] = useState(false)
    let [inputValue, setInputValue] = useState<string>(title)

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
            <input
                onBlur={offEditMode}
                autoFocus
                value={inputValue}
                onChange={onChangeInput}
            /> :
            <span className={classes}
                  onDoubleClick={onEditMode}
            >
                {title}
            </span>
    );
};

export default EditableSpan;