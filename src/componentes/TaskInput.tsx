import { useState } from 'react'
import './TaskInput.css'

interface TaskInputProps {
  onAddTask: (text: string) => void
}

function TaskInput({ onAddTask }: TaskInputProps) {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!taskText.trim()) {
      alert("Ingresa una tarea antes de agregarla.")
      return
    }

    onAddTask(taskText)
    setTaskText('')
  }

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="Escribe una nueva tarea..."
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />

      <button type="submit" className="task-add-btn">
        Agregar
      </button>
    </form>
  )
}

export default TaskInput