import React from "react";
import {FilterValuesType} from "../App";

export type ButtonPropsType ={
    name: FilterValuesType
    callBack: () => void
}

export const Button = (props:ButtonPropsType) => {
    const callBackHandler = () => {
        props.callBack()
    }

    return (
        <button onClick={callBackHandler}>{props.name}</button>
    )
}