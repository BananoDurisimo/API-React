import { Router } from 'express'
import authMiddleware from '../middlewares/auth.js'
import { getExpenses, createExpense, deleteExpense, getBudget, updateBudget } from '../controllers/expenses.controller.js'

const router = Router()
router.use(authMiddleware)

router.get('/', getExpenses)
router.post('/', createExpense)
router.delete('/:id', deleteExpense)
router.get('/budget', getBudget)
router.put('/budget', updateBudget)

export default router
