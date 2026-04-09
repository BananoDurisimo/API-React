import { Router } from 'express'
import Expense from '../models/Expense.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(expenses)
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body
    if (!description || !amount || !category || !date)
      return res.status(400).json({ message: 'Todos los campos son requeridos' })

    const expense = await Expense.create({ userId: req.userId, description, amount, category, date })
    res.status(201).json(expense)
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!expense)
      return res.status(404).json({ message: 'Gasto no encontrado' })
    res.json({ message: 'Eliminado' })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// GET /api/expenses/budget
router.get('/budget', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('budget')
    res.json({ budget: user.budget })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// PUT /api/expenses/budget
router.put('/budget', async (req, res) => {
  try {
    const { budget } = req.body
    if (!budget || budget <= 0)
      return res.status(400).json({ message: 'Presupuesto inválido' })
    await User.findByIdAndUpdate(req.userId, { budget })
    res.json({ budget })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

export default router
