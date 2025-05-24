import { TaskItem } from './TaskItem'

export function TaskList({ tasks, onToggleTask }) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
      ))}
    </div>
  )
}
