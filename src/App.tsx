import { useEffect, useState } from 'react'
import './App.css'

import Header from './componentes/Header'
import TaskInput from './componentes/TaskInput'
import TaskList from './componentes/TaskList'
import EmptyState from './componentes/EmptyState'
import Footer from './componentes/Footer'

export interface Task {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  // URL base del backend
  // En local usará http://localhost:3000
  // En producción usará la variable VITE_API_URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`)
      const data = await res.json()

      const formattedTasks = data.map((task: any) => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
      }))

      setTasks(formattedTasks)
    } catch (error) {
      console.error('Error al cargar tareas:', error)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const addTask = async (text: string) => {
    try {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      })

      await loadTasks()
    } catch (error) {
      console.error('Error al crear tarea:', error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      })

      await loadTasks()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  const toggleTask = async (id: number) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id)

      if (!taskToToggle) return

      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !taskToToggle.completed,
        }),
      })

      await loadTasks()
    } catch (error) {
      console.error('Error al actualizar tarea:', error)
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <main className="app-shell">
      <section className="app-card">
        <Header totalTasks={tasks.length} completedTasks={completedTasks} />
        <TaskInput onAddTask={addTask} />

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList
            tasks={tasks}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
          />
        )}

        <Footer totalTasks={tasks.length} completedTasks={completedTasks} />
      </section>
    </main>
  )
}

export default App