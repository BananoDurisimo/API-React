import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import expenseRoutes from './routes/expenses.routes.js'

const app = express()

const allowedOrigins = ['http://localhost:5173']
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL)

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

export default app
