import { motion } from 'framer-motion'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import GitHubIcon from '@mui/icons-material/GitHub'

const features = [
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
    title: 'Control total',
    desc: 'Registra cada gasto con categoría, fecha y monto. Visualiza en qué gastas tu dinero.',
    color: '#00b4ff',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    title: 'Presupuesto inteligente',
    desc: 'Define tu presupuesto mensual y recibe alertas visuales cuando te acerques al límite.',
    color: '#74b9ff',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: 'Datos seguros',
    desc: 'Tu información se guarda en la nube con cifrado. Accede desde cualquier dispositivo.',
    color: '#a29bfe',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
    title: 'Rick & Morty',
    desc: 'Explora el multiverso: busca personajes, filtra por estado y navega por todas las temporadas.',
    color: '#ffa502',
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Landing({ onNavigate }) {
  return (
    <Box sx={{
      flex: 1,
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(0,180,255,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(108,99,255,0.07) 0%, transparent 50%)
      `,
    }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* Hero */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
              >
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80, height: 80,
                  borderRadius: 4,
                  bgcolor: 'rgba(0,180,255,0.1)',
                  border: '1px solid rgba(0,180,255,0.4)',
                  boxShadow: '0 0 30px rgba(0,180,255,0.2)',
                  mb: 3,
                }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 38, color: 'primary.main' }} />
                </Box>
              </motion.div>

              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '2.4rem', md: '3.5rem' },
                  mb: 1,
                  lineHeight: 1.1,
                }}
              >
                Daily
                <Box component="span" sx={{
                  color: 'primary.main',
                  textShadow: '0 0 12px #00b4ff, 0 0 30px rgba(0,180,255,0.4)',
                }}>
                  Track
                </Box>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1.5, fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.5 }}
              >
                Tu gestor de gastos personales en la nube. Controla tu presupuesto, analiza tus hábitos
                y toma mejores decisiones financieras.
              </Typography>

              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2, py: 0.5,
                borderRadius: 99,
                bgcolor: 'rgba(0,180,255,0.08)',
                border: '1px solid rgba(0,180,255,0.2)',
                mb: 4,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00b4ff', boxShadow: '0 0 6px #00b4ff' }} />
                <Typography variant="caption" color="primary.main" fontWeight={600}>
                  100% gratuito · Datos en la nube
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => onNavigate('register')}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                  >
                    Empezar gratis
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => onNavigate('login')}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Ya tengo cuenta
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href="https://github.com/BananoDurisimo/API-React"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<GitHubIcon />}
                    sx={{
                      px: 4, py: 1.5, fontSize: '1rem',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        bgcolor: 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    GitHub
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Feature cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 8,
          }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Paper elevation={0} sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${f.color}22`,
                  borderRadius: 3,
                  boxShadow: `0 0 20px ${f.color}08`,
                  transition: 'all 0.25s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${f.color}44`,
                    boxShadow: `0 0 30px ${f.color}15`,
                    transform: 'translateY(-3px)',
                  },
                }}>
                  <Box sx={{
                    width: 50, height: 50, borderRadius: 2.5,
                    bgcolor: `${f.color}12`, border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color, mb: 2,
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.75 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {f.desc}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>

          {/* CTA final */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'rgba(0,180,255,0.04)',
              border: '1px solid rgba(0,180,255,0.2)',
              borderRadius: 4,
              boxShadow: '0 0 60px rgba(0,180,255,0.06)',
            }}>
              <Typography variant="h5" fontFamily='"Orbitron", sans-serif' fontWeight={700} sx={{ mb: 1 }}>
                ¿Listo para tomar el control?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Crea tu cuenta gratis y empieza a registrar tus gastos ahora mismo.
              </Typography>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => onNavigate('register')}
                  sx={{ px: 5, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                >
                  Crear cuenta
                </Button>
              </motion.div>
            </Paper>
          </motion.div>

        </motion.div>
      </Container>
    </Box>
  )
}
