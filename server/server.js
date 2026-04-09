import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import expenseRoutes from './routes/expenses.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas conectado')
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message)
    process.exit(1)
  })
