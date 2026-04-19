import type { Task } from '../App'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onDeleteTask: (id: number) => void
  onToggleTask: (id: number) => void
}

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onToggle={onToggleTask}
        />
      ))}
    </div>
  )
}

export default TaskList