// Hooks de React
// useState → permite guardar estado en el componente
// useEffect → permite ejecutar código cuando el componente se monta
import { useEffect, useState } from 'react'

import './App.css'

// Importación de componentes visuales del proyecto
import Header from './componentes/Header'
import TaskInput from './componentes/TaskInput'
import TaskList from './componentes/TaskList'
import EmptyState from './componentes/EmptyState'
import Footer from './componentes/Footer'


// ===============================
// INTERFAZ DE DATOS
// ===============================

// Definición del tipo Task usando TypeScript
// Esto define cómo debe ser la estructura de cada tarea
export interface Task {
  id: number
  text: string
  completed: boolean
}


// ===============================
// COMPONENTE PRINCIPAL
// ===============================

function App() {

  // Estado principal que almacena todas las tareas
  // useState guarda el estado y setTasks permite actualizarlo
  const [tasks, setTasks] = useState<Task[]>([])


  // ===============================
  // CARGAR TAREAS DESDE EL BACKEND
  // ===============================

  const loadTasks = async () => {
    try {

      // Se hace una petición GET al backend
      // Este endpoint devuelve todas las tareas de la base de datos
      const res = await fetch('http://localhost:3000/tasks')

      // Convertimos la respuesta en JSON
      const data = await res.json()

      // Adaptamos el formato de los datos recibidos
      const formattedTasks = data.map((task: any) => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
      }))

      // Guardamos las tareas en el estado del componente
      setTasks(formattedTasks)

    } catch (error) {

      // Manejo de errores si el backend no responde
      console.error('Error al cargar tareas:', error)

    }
  }


  // ===============================
  // EJECUCIÓN AUTOMÁTICA AL CARGAR
  // ===============================

  // useEffect con [] significa que se ejecuta solo una vez
  // cuando el componente se monta
  useEffect(() => {
    loadTasks()
  }, [])


  // ===============================
  // CREAR NUEVA TAREA
  // ===============================

  const addTask = async (text: string) => {
    try {

      // Se envía una petición POST al backend
      // para crear una nueva tarea en la base de datos
      await fetch('http://localhost:3000/tasks', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        // Se envía el texto de la tarea al backend
        body: JSON.stringify({
          text: text,
        }),
      })

      // Después de crear la tarea
      // se vuelve a cargar la lista desde el backend
      await loadTasks()

    } catch (error) {

      console.error('Error al crear tarea:', error)

    }
  }


  // ===============================
  // ELIMINAR TAREA
  // ===============================

  const deleteTask = async (id: number) => {
    try {

      // Petición DELETE al backend para eliminar una tarea
      await fetch(`http://localhost:3000/tasks/${id}`, {

        method: 'DELETE',

      })

      // Recargar tareas desde el servidor
      await loadTasks()

    } catch (error) {

      console.error('Error al eliminar tarea:', error)

    }
  }


  // ===============================
  // CAMBIAR ESTADO DE TAREA
  // ===============================

  const toggleTask = async (id: number) => {
    try {

      // Busca la tarea dentro del estado actual
      const taskToToggle = tasks.find((task) => task.id === id)

      // Si no se encuentra la tarea se cancela la operación
      if (!taskToToggle) return


      // Se envía una petición PUT al backend
      // para actualizar el estado "completed"
      await fetch(`http://localhost:3000/tasks/${id}`, {

        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
        },

        // Se envía el estado contrario al actual
        body: JSON.stringify({
          completed: !taskToToggle.completed,
        }),

      })

      // Se vuelven a cargar las tareas desde el backend
      await loadTasks()

    } catch (error) {

      console.error('Error al actualizar tarea:', error)

    }
  }


  // ===============================
  // CÁLCULO DE TAREAS COMPLETADAS
  // ===============================

  // Se calcula cuántas tareas están completadas
  const completedTasks = tasks.filter((task) => task.completed).length


  // ===============================
  // INTERFAZ DEL COMPONENTE
  // ===============================

  return (

    <main className="app-shell">

      <section className="app-card">

        {/* Header muestra estadísticas */}
        <Header totalTasks={tasks.length} completedTasks={completedTasks} />

        {/* Input para crear nuevas tareas */}
        <TaskInput onAddTask={addTask} />

        {/* Si no hay tareas se muestra estado vacío */}
        {tasks.length === 0 ? (

          <EmptyState />

        ) : (

          // Lista de tareas con opciones de eliminar o marcar completada
          <TaskList
            tasks={tasks}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
          />

        )}

        {/* Footer con resumen */}
        <Footer totalTasks={tasks.length} completedTasks={completedTasks} />

      </section>

    </main>

  )
}

export default App