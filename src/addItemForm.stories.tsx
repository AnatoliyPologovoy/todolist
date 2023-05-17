import type {Meta, StoryObj} from '@storybook/react';
import {AddItemForm, AddItemFormPropsType} from "./addItemForm";
import {action} from "@storybook/addon-actions"
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import s from "./todolist.module.css";
import React, {ChangeEvent, KeyboardEvent, useState} from "react";


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
    title: 'TODOLISTS/AddItemForm',
    component: AddItemForm,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
        addItem: {
            description: 'Button clicked inside form',
            action: 'clicked'
        }
    },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
//first way create story
export const AddItemFormStory: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args
    args: {
        addItem: action('Button clicked inside form')
    },
};

//second way create story
export const AddItemFormStoryWithRender: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args
    render: args => <AddItemForm addItem={args.addItem} />
};

//thirteen way create story - new component
export const AddItemFormStoryWithReactFC: React.FC <AddItemFormPropsType> = (args) => {
    //possible use react hook
    let [inputValue, setInputValue] = useState<string>('')
    let [error, setError] = useState<string | null>('Error text')



    const onChangeInput = (evt:ChangeEvent<HTMLInputElement>) => {
        setError('') //remove error when we start change input
        setInputValue(evt.currentTarget.value)
    }
    const maxLengthTitle = 20
    const minLengthTitle = 5

    const addItemHandler = () => {
        const trimmedValue = inputValue.trim()
        let isAddTaskPossible = true
        if (trimmedValue === '') {
            setError('Field is required')
            isAddTaskPossible = false
        }
        if (trimmedValue.length > maxLengthTitle) {
            setError('Title is too long')
            isAddTaskPossible = false
        }
        if (trimmedValue.length < minLengthTitle) {
            setError('Title is too short')
            isAddTaskPossible = false
        }
        if (isAddTaskPossible) {
            args.addItem(trimmedValue);
            setInputValue('');
        }
    }


    const onKeyInputHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            addItemHandler()
        }
    }
    // const isError = !!error
    const isError = true// hardcode line

    return (
        <div>
            <TextField
                value={inputValue}
                type="text"
                onChange={onChangeInput}
                onKeyDown={onKeyInputHandler}
                error={isError}
                multiline={false}
                size={"small"}
            />
            <IconButton onClick={addItemHandler}>
                <AddBoxIcon/>
            </IconButton>
            {/*{ isError && <div className={s.errorMessage}>{error}</div>}*/}
            { isError && <div className={s.errorMessage}>{'hardcode error'}</div>}
        </div>
    );
};

export const AddItemFormErrorStory: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args

    render: (args) => {
        let error = 'Error text'
        return (
            <div>
                <TextField
                    value={''}
                    type="text"
                    onChange={() => {alert('onChange')}}
                    onKeyDown={() => {alert('onKeyPress')}}
                    error={true}
                    multiline={false}
                    size={"small"}
                />
                <IconButton onClick={() => args.addItem('')}>
                    <AddBoxIcon/>
                </IconButton>
                {error && <div className={s.errorMessage}>{error}</div>}
            </div>
        )

    }
};