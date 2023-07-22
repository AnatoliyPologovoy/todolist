import React, {memo} from 'react';
import {TaskType} from "features/todolists-lists/tasks/tasks-reducers";
import {Task} from "features/todolists-lists/tasks/task/Task";

type Props = {
		tasks: TaskType[]
}

export const Tasks: React.FC<Props> = memo(({tasks}) => {
		const renderTasksList = tasks.map(task => {
				return (
						<Task key={task.id}
									task={task}
						/>
				)
		})

		return (
				<>
						{renderTasksList}
				</>
		);
});
