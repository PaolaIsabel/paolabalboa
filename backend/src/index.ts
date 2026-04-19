import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Importa la librería JWT para generar y validar tokens
const jwt = require("jsonwebtoken")

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const app = express()
const PORT = 3000

// Clave secreta usada para firmar y verificar tokens
const SECRET_KEY = "mi_clave_secreta"

app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is working!")
})

app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (error) {
    console.error("Error en GET /tasks:", error)
    res.status(500).json({ message: "Error al obtener tareas" })
  }
})

app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const newTask = await prisma.task.create({
      data: {
        text: req.body.text,
        completed: false,
      },
    })

    res.json(newTask)
  } catch (error) {
    console.error("Error en POST /tasks:", error)
    res.status(500).json({ message: "Error al crear tarea" })
  }
})

app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id)

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: req.body.completed,
      },
    })

    res.json(updatedTask)
  } catch (error) {
    console.error("Error en PUT /tasks/:id:", error)
    res.status(500).json({ message: "Error al actualizar tarea" })
  }
})

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id)

    await prisma.task.delete({
      where: { id: taskId },
    })

    res.json({ message: "Deleted" })
  } catch (error) {
    console.error("Error en DELETE /tasks/:id:", error)
    res.status(500).json({ message: "Error al eliminar tarea" })
  }
})


// ===============================
// LOGIN Y GENERACIÓN DE TOKEN
// ===============================

// Ruta para iniciar sesión
// Recibe username y password
// Si las credenciales son válidas, devuelve un token JWT
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body

  // Validación simple solo para fines académicos
  if (username === "admin" && password === "1234") {
    const token = jwt.sign(
      { username: username },
      SECRET_KEY,
      { expiresIn: "1h" }
    )

    return res.json({ token })
  }

  res.status(401).json({ message: "Credenciales inválidas" })
})


// ===============================
// MIDDLEWARE PARA VERIFICAR TOKEN
// ===============================

// Este middleware revisa si el cliente envía un token válido
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  // Verifica si existe el header Authorization
  if (!authHeader) {
    return res.status(403).json({ message: "Token requerido" })
  }

  // El formato esperado es: Bearer TOKEN
  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(403).json({ message: "Token inválido" })
  }

  try {
    jwt.verify(token, SECRET_KEY)
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token no válido o expirado" })
  }
}


// ===============================
// RUTA PROTEGIDA
// ===============================

// Solo se puede acceder si el token es válido
app.get("/private", verifyToken, (req: Request, res: Response) => {
  res.json({ message: "Acceso permitido" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})