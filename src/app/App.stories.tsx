import type { Meta, StoryObj } from '@storybook/react';
import {Task} from "../features/tasks/Task/Task";
import EditableSpan from "../common/components/EditableSpan/EditableSpan";
import {action} from "@storybook/addon-actions";
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./store";
import {reduxStoreProviderDecorator} from "./reduxStoreProviderDecorator";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof App> = {
    title: 'TODOLISTS/App',
    component: App,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    decorators: [reduxStoreProviderDecorator]
};

export default meta;
type Story = StoryObj<typeof App>;

export const AppWithReduxStory: Story = {
    render: () => <App/>
};


