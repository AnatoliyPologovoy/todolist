import type { Meta, StoryObj } from '@storybook/react'
import { Task } from 'features/todolists-lists/tasks/task/Task'
import EditableSpan from 'common/components/editableSpan/EditableSpan'
import { action } from '@storybook/addon-actions'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof EditableSpan> = {
    title: 'TODOLISTS/editableSpan',
    component: EditableSpan,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        title: {
            defaultValue: 'yo',
            description: 'Start value is empty',
        },
        changeTitle: {
            description: 'Set new value',
        },
    },
    args: {
        // changeTitle: action('Change'),
        title: 'hi',
    },

    //in args place common props
}

export default meta
type Story = StoryObj<typeof EditableSpan>

export const EditableSpan1: Story = {}

export const EditableSpan2: Story = {
    args: {},
}
