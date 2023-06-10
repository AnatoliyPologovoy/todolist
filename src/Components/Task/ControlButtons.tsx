import React, {FC} from 'react';
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type ControlButtonsPropsType = {
    isEditMode: boolean
    onClickEditButton: () => void
    onClickRemoveTask: () => void
    onClickChangeTitle: () => void
}

export const ControlButtons: FC<ControlButtonsPropsType> = (props) => {

    const editButton =
        <IconButton
            size={"small"}
            onClick={props.onClickEditButton}
        >
            <EditIcon fontSize={"small"}/>
        </IconButton>

    const changeButton =
        <IconButton
            size={"small"}
            onClick={props.onClickEditButton}
        >
            <EditIcon fontSize={"small"}/>
        </IconButton>

    return (
        <ButtonGroup>
            <IconButton
                size={"small"}
                onClick={props.onClickEditButton}
            >
                <EditIcon fontSize={"small"}/>
            </IconButton>
            <IconButton
                size={"small"}
                onClick={props.onClickRemoveTask}>
                <DeleteForeverIcon fontSize={"small"}/>
            </IconButton>
        </ButtonGroup>
    );
};
