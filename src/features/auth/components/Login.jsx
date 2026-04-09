import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Paper, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import api from '../../../services/api'

const MotionPaper = motion(Paper)

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  show:   (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 + 0.2, duration: 0.35 } }),
}

function Login({ onLoggedIn, onNavigate }) {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.email.trim()) return 'El correo es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Ingresa un correo válido.'
    if (!form.password) return 'La contraseña es obligatoria.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email: form.email.trim(), password: form.password })
      onLoggedIn(data.user, data.token)
    } catch (err) {
      if (!err.response) {
        setError('No se puede conectar con el servidor. ¿Está corriendo "npm run dev" en la carpeta server?')
      } else {
        setError(err.response.data?.message || `Error ${err.response.status}: No se pudo iniciar sesión.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(0,180,255,0.06) 0%, transparent 60%)',
      }}
    >
      <MotionPaper
        elevation={0}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,180,255,0.3)',
          borderRadius: 4,
          boxShadow: '0 0 60px rgba(0,180,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Box sx={{
            width: 52, height: 52, mx: 'auto', mb: 2,
            bgcolor: 'rgba(0,180,255,0.1)',
            border: '1px solid rgba(0,180,255,0.35)',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 8px rgba(0,180,255,0.3)',
          }}>
            <LoginIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Typography variant="h5" align="center" sx={{ mb: 0.5, fontFamily: '"Orbitron", sans-serif', fontWeight: 700 }}>
            Bienvenido
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Inicia sesión para continuar
          </Typography>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }}>
            <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>
          </motion.div>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {[
            { label: 'Correo electrónico', name: 'email',    type: 'email',    placeholder: 'correo@ejemplo.com' },
            { label: 'Contraseña',         name: 'password', type: 'password', placeholder: 'Tu contraseña' },
          ].map((field, i) => (
            <motion.div key={field.name} custom={i} variants={fieldVariants} initial="hidden" animate="show">
              <TextField
                label={field.label}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                disabled={loading}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 0.5 }}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </motion.div>
        </Box>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2.5 }}>
            ¿No tienes cuenta?{' '}
            <Box
              component="span"
              onClick={() => onNavigate('register')}
              sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2, '&:hover': { textShadow: '0 0 8px rgba(0,180,255,0.6)' } }}
            >
              Regístrate aquí
            </Box>
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
            <Box
              component="span"
              onClick={() => onNavigate('landing')}
              sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            >
              ← Volver al inicio
            </Box>
          </Typography>
        </motion.div>
      </MotionPaper>
    </Box>
  )
}

export default Login
