import type {Meta, StoryObj} from '@storybook/react';
import {Task} from "features/todolists-lists/tasks/Task/Task";
import {reduxStoreProviderDecorator} from "app/reduxStoreProviderDecorator";
import {useAppSelector} from "app/store";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/TaskWithRedux',
  component: Task,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //
  // },
  args: {
    // changeTaskStatus: action('Status changed inside Task'),
    // changeTaskTitle: action('Title changed inside Task'),
    // removeTask: action('Remove FilterButton clicked changed inside Task'),
    // task: {id: '12wsdewfijdei', title: 'JS', isDone: false},
    // todolistId: 'fgdosrg8rgjuh'
  },
  decorators: [reduxStoreProviderDecorator]
  //in args place common props
};

export default meta;
type Story = StoryObj<typeof Task>;

const Task1 = () => {
  let task = useAppSelector(state => state.tasks['todolistId1'][0])

  return <Task task={task} />
}

export const TaskStory: Story = {

  render: () => <Task1 />
};

// export const TaskIsDone: Story = {
//   // More on args: https://storybook.js.org/docs/react/writing-stories/args
//   args: {
//     // task: {id: '12wsdewfijdei2343', title: 'CSS', isDone: true},
//   },
// };
