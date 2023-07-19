import React, {ChangeEvent, FC, memo, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ButtonGroup from "@mui/material/ButtonGroup";
import BeenhereIcon from '@mui/icons-material/Beenhere';

type Props = {
		disabled: boolean
		title: string
		classes: string
		changeTitle: (newTitle: string, setRejectTitle: (title: string) => void) => void
		removeItem: () => void
		sizeButtons: 'small' | 'medium' | 'large'
}

const EditableSpan: FC<Props> = memo((props) => {
		const {
				title, classes, changeTitle, removeItem, sizeButtons, disabled,
		} = props

		const [isEditMode, setIsEditMode] = useState(false)
		const [inputValue, setInputValue] = useState<string>(title)
		const inputValueLength = inputValue.length

		const setRejectTitle = (title: string) => {
				setIsEditMode(true)
				setInputValue(title)
		}

		const activeEditModeHandler = () => {
				if (!disabled) { // if not disable
						setIsEditMode(true)
				}
		}
		const changeTitleHandler = () => {
				if (inputValueLength > 2) {
						changeTitle(inputValue, setRejectTitle)
						setIsEditMode(false)
				}
		}

		const onChangeInputHandler = (evt: ChangeEvent<HTMLInputElement>) => {
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
						onBlur={changeTitleHandler}
						autoFocus
						value={inputValue}
						onChange={onChangeInputHandler}
				/>

		const textViewMode =
				<span className={classes}
							onDoubleClick={activeEditModeHandler}
				>
            {inputValue}
        </span>

		const renderTitle = isEditMode ? textEditableMode : textViewMode

		// render buttons
		const editButton =
				<IconButton
						size={"small"}
						onClick={activeEditModeHandler}
						disabled={disabled}
				>
						<EditIcon fontSize={sizeButtons}/>
				</IconButton>

		const saveButton =
				<IconButton
						size={"small"}
						onClick={changeTitleHandler}
						disabled={inputValueLength < 3}
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