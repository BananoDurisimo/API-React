import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, TextField, Button, MenuItem,
  Paper, IconButton, Chip, Divider, Alert, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import api from '../../api/api'

const CATEGORIES = [
  { label: 'Comida',           value: 'food',          color: '#ff6b6b' },
  { label: 'Transporte',       value: 'transport',     color: '#ffa502' },
  { label: 'Entretenimiento',  value: 'entertainment', color: '#a29bfe' },
  { label: 'Salud',            value: 'health',        color: '#55efc4' },
  { label: 'Educación',        value: 'education',     color: '#74b9ff' },
  { label: 'Hogar',            value: 'home',          color: '#fd79a8' },
  { label: 'Ropa',             value: 'clothes',       color: '#fdcb6e' },
  { label: 'Otro',             value: 'other',         color: '#b2bec3' },
]

const getCat = (value) => CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[7]

const DEFAULT_BUDGET = 500000

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const listItemVariants = {
  hidden:  { opacity: 0, x: -20, height: 0 },
  show:    { opacity: 1, x: 0,   height: 'auto', transition: { duration: 0.3 } },
  exit:    { opacity: 0, x: 20,  height: 0,      transition: { duration: 0.25 } },
}

function StatCard({ icon, label, value, color, editable, onEdit }) {
  return (
    <motion.div variants={itemVariants}>
      <Paper elevation={0} sx={{
        p: 2.5,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}33`,
        borderRadius: 3,
        display: 'flex', alignItems: 'center', gap: 2,
        boxShadow: `0 0 20px ${color}11`,
        position: 'relative',
      }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: 2,
          bgcolor: `${color}18`, border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color, flexShrink: 0,
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{label}</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color, lineHeight: 1.2 }}>{value}</Typography>
        </Box>
        {editable && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'text.secondary', '&:hover': { color: color } }}>
            <EditIcon sx={{ fontSize: 15 }} />
          </IconButton>
        )}
      </Paper>
    </motion.div>
  )
}

function formatCOP(n) {
  return `$${Number(n).toLocaleString('es-CO')}`
}

export default function Home() {
  const [expenses, setExpenses]         = useState([])
  const [budget, setBudget]             = useState(DEFAULT_BUDGET)
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput]   = useState('')
  const [form, setForm]                 = useState({ description: '', amount: '', category: 'food', date: new Date().toISOString().slice(0, 10) })
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [loading, setLoading]           = useState(true)
  const [adding, setAdding]             = useState(false)

  // Cargar gastos y presupuesto desde la API
  const fetchData = useCallback(async () => {
    try {
      const [expRes, budRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/budget'),
      ])
      setExpenses(expRes.data)
      setBudget(budRes.data.budget)
    } catch {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openBudgetEdit = () => { setBudgetInput(budget); setEditingBudget(true) }

  const confirmBudget = async () => {
    const val = Number(budgetInput)
    if (val <= 0) return
    try {
      await api.put('/expenses/budget', { budget: val })
      setBudget(val)
      setEditingBudget(false)
    } catch {
      setError('Error al actualizar el presupuesto')
    }
  }

  const cancelBudget = () => setEditingBudget(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) { setError('La descripción es obligatoria.'); return }
    if (form.description.trim().length > 100) { setError('La descripción no puede superar los 100 caracteres.'); return }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) { setError('Ingresa un monto válido mayor a 0.'); return }
    if (Number(form.amount) > 999999999) { setError('El monto ingresado es demasiado alto.'); return }
    if (!form.date) { setError('La fecha es obligatoria.'); return }
    setAdding(true)
    setError('')
    try {
      const { data } = await api.post('/expenses', {
        description: form.description.trim(),
        amount:      Number(form.amount),
        category:    form.category,
        date:        form.date,
      })
      setExpenses([data, ...expenses])
      setForm({ description: '', amount: '', category: 'food', date: new Date().toISOString().slice(0, 10) })
      setSuccess('Gasto registrado.')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Error al registrar el gasto')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      setExpenses(expenses.filter((e) => e._id !== id))
    } catch {
      setError('Error al eliminar el gasto')
    }
  }

  const total     = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = budget - total
  const topCat    = CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.value).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total)

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">

        {/* Title */}
        <motion.div variants={itemVariants}>
          <Typography variant="h4" align="center" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, mb: 0.5 }}>
            Control de{' '}
            <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 8px #00b4ff, 0 0 20px rgba(0,180,255,0.3)' }}>
              Gastos
            </Box>
          </Typography>
          <Typography align="center" color="text.secondary" variant="body2" sx={{ mb: 4 }}>
            Registra y controla tus gastos del día a día
          </Typography>
        </motion.div>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          <StatCard icon={<AttachMoneyIcon />} label="Total gastado" value={formatCOP(total)} color="#ff6b6b" />
          {editingBudget ? (
            <motion.div variants={itemVariants}>
              <Paper elevation={0} sx={{
                p: 2.5, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,180,255,0.4)', borderRadius: 3,
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <AccountBalanceWalletIcon sx={{ color: '#00b4ff', flexShrink: 0 }} />
                <TextField
                  autoFocus
                  size="small"
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') confirmBudget(); if (e.key === 'Escape') cancelBudget() }}
                  inputProps={{ min: 1 }}
                  sx={{ flex: 1 }}
                  placeholder="Nuevo presupuesto"
                />
                <IconButton size="small" onClick={confirmBudget} sx={{ color: '#00b4ff' }}><CheckIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={cancelBudget}  sx={{ color: 'text.secondary' }}><CloseIcon fontSize="small" /></IconButton>
              </Paper>
            </motion.div>
          ) : (
            <StatCard icon={<AccountBalanceWalletIcon />} label="Presupuesto" value={formatCOP(budget)} color="#00b4ff" editable onEdit={openBudgetEdit} />
          )}
          <StatCard icon={<TrendingUpIcon />}  label="Disponible" value={formatCOP(Math.max(remaining, 0))} color={remaining >= 0 ? '#74b9ff' : '#ff4757'} />
          <StatCard icon={<ReceiptLongIcon />} label="Registros"  value={expenses.length} color="#a29bfe" />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.6fr' }, gap: 3 }}>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={{
              p: 3, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,180,255,0.25)', borderRadius: 3,
            }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon sx={{ color: 'primary.main' }} /> Nuevo gasto
              </Typography>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                  <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <Alert severity="success" sx={{ mb: 2, fontSize: '0.8rem' }}>{success}</Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} placeholder="Ej: Almuerzo" size="small" fullWidth required disabled={adding} />
                <TextField label="Monto (COP)" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0" size="small" fullWidth required inputProps={{ min: 1 }} disabled={adding} />
                <TextField label="Categoría" name="category" select value={form.category} onChange={handleChange} size="small" fullWidth disabled={adding}>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                        {c.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Fecha" name="date" type="date" value={form.date} onChange={handleChange} size="small" fullWidth InputLabelProps={{ shrink: true }} disabled={adding} />
                <motion.div whileHover={{ scale: adding ? 1 : 1.02 }} whileTap={{ scale: adding ? 1 : 0.98 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={adding}
                    startIcon={adding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                  >
                    {adding ? 'Guardando...' : 'Agregar gasto'}
                  </Button>
                </motion.div>
              </Box>

              {/* Category breakdown */}
              {topCat.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                    POR CATEGORÍA
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {topCat.map((c) => (
                      <Box key={c.value} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>{c.label}</Typography>
                        <Box sx={{ flex: 2, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((c.total / total) * 100, 100)}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ height: '100%', background: c.color, borderRadius: 2 }}
                          />
                        </Box>
                        <Typography variant="caption" fontWeight={600} sx={{ color: c.color, minWidth: 70, textAlign: 'right' }}>
                          {formatCOP(c.total)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </motion.div>

          {/* Expense list */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={{
              p: 3, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3,
              maxHeight: 560, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon sx={{ color: 'primary.main' }} /> Historial
                {expenses.length > 0 && (
                  <Chip label={expenses.length} size="small" sx={{ ml: 'auto', bgcolor: 'rgba(0,180,255,0.1)', color: 'primary.main', border: '1px solid rgba(0,180,255,0.3)', height: 20, fontSize: '0.7rem' }} />
                )}
              </Typography>

              {expenses.length === 0 ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.4 }}>
                  <ReceiptLongIcon sx={{ fontSize: 40 }} />
                  <Typography variant="body2" color="text.secondary">Sin gastos registrados</Typography>
                </Box>
              ) : (
                <Box sx={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <AnimatePresence initial={false}>
                    {expenses.map((exp) => {
                      const cat = getCat(exp.category)
                      return (
                        <motion.div
                          key={exp._id}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          layout
                        >
                          <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            py: 1.25, px: 0.5,
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            '&:last-child': { borderBottom: 'none' },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 },
                          }}>
                            <Box sx={{
                              width: 36, height: 36, borderRadius: 2, flexShrink: 0,
                              bgcolor: `${cat.color}18`, border: `1px solid ${cat.color}33`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={500} noWrap>{exp.description}</Typography>
                              <Typography variant="caption" color="text.secondary">{cat.label} · {exp.date}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#ff6b6b', flexShrink: 0 }}>
                              {formatCOP(exp.amount)}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(exp._id)}
                              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'rgba(255,71,87,0.08)' } }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  )
}
