import React, {memo} from 'react';
import {Button} from "@mui/material";
import {FilterType} from "features/tasks/tasks-reducers";

export type ButtonWithMemoPropsType = {
    title: string
    color: string
    filter: FilterType
    onClickHandler: () => void
}

export const ButtonWithMemo: React.FC<ButtonWithMemoPropsType> = memo((props) => {
    const {title, color, filter, onClickHandler} = props

    return (
        <Button
            size={"small"}
            variant={"contained"}
            disableElevation
            color={filter === color ? 'secondary' : 'primary'}
            onClick={onClickHandler}>{title}
        </Button>
    )
})
