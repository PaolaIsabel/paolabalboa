import type { Task } from '../App'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}

function TaskCard({ task, onDelete, onToggle }: TaskCardProps) {
  return (
    <article className={`task-card ${task.completed ? 'completed' : ''}`}>
      <label className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-text">{task.text}</span>
      </label>

      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        Eliminar
      </button>
    </article>
  )
}

export default TaskCard