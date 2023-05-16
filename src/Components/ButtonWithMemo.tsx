import React, {memo} from 'react';
import {Button} from "@mui/material";
import {ChangeTodolistFilterAC} from "../reducers/todolists-reducers";
import {FilterType} from "../TodolistNEW";
import {useDispatch} from "react-redux";

export type ButtonWithMemoPropsType = {
    title: string
    // todoListId: string
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
