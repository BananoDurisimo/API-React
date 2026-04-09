import { motion } from 'framer-motion'
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const MotionAppBar = motion(AppBar)

const NAV_LINKS = [
  { label: 'Gastos',       page: 'home',       icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} /> },
  { label: 'Rick & Morty', page: 'characters', icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} /> },
]

function Header({ currentUser, onNavigate, onLogout, currentPage }) {
  return (
    <MotionAppBar
      position="sticky"
      elevation={0}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Toolbar sx={{ px: { xs: 1.5, md: 4 }, gap: { xs: 0.5, md: 2 }, minHeight: { xs: 56, md: 64 } }}>

        {/* Brand */}
        <Box
          onClick={() => onNavigate('landing')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1, minWidth: 0 }}
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: '#00b4ff',
              boxShadow: '0 0 8px #00b4ff, 0 0 20px rgba(0,180,255,0.4)',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '0.85rem', md: '1rem' },
              color: 'primary.main',
              textShadow: '0 0 8px #00b4ff, 0 0 20px rgba(0,180,255,0.4)',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            DailyTrack
          </Typography>
        </Box>

        {/* Nav */}
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {NAV_LINKS.map((link) => {
            const active = currentPage === link.page
            return (
              <Tooltip key={link.page} title={link.label} placement="bottom" disableHoverListener={false}>
                <Button
                  onClick={() => onNavigate(link.page)}
                  size="small"
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? 'rgba(0,180,255,0.08)' : 'transparent',
                    border: active ? '1px solid rgba(0,180,255,0.3)' : '1px solid transparent',
                    borderRadius: 2,
                    minWidth: { xs: 36, md: 'auto' },
                    px: { xs: 1, md: 1.5 },
                    '& .MuiButton-startIcon': { mr: { xs: 0, md: 0.5 } },
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                  startIcon={link.icon}
                >
                  {/* Texto visible solo en sm+ */}
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.8rem' }}>
                    {link.label}
                  </Box>
                </Button>
              </Tooltip>
            )
          })}
        </Box>

        {/* Auth */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 }, flexShrink: 0 }}>
          {currentUser ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Avatar
                sx={{
                  width: 30, height: 30,
                  bgcolor: 'rgba(0,180,255,0.15)',
                  border: '1px solid rgba(0,180,255,0.4)',
                  color: 'primary.main',
                  fontSize: '0.8rem', fontWeight: 700,
                }}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main', fontSize: '0.8rem',
                  display: { xs: 'none', md: 'block' },
                  maxWidth: 120, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {currentUser.name}
              </Typography>
              <Tooltip title="Cerrar sesión">
                <IconButton
                  size="small"
                  onClick={onLogout}
                  aria-label="Cerrar sesión"
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    '&:hover': { color: 'error.main', borderColor: 'error.main', bgcolor: 'rgba(255,71,87,0.08)' },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{ display: 'flex', gap: 6 }}
            >
              {/* En xs: solo icono. En sm+: icono + texto */}
              <Tooltip title="Iniciar sesión">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onNavigate('login')}
                  aria-label="Iniciar sesión"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: 'text.secondary',
                    minWidth: { xs: 36, sm: 'auto' },
                    px: { xs: 1, sm: 1.5 },
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
                    '&:hover': { borderColor: 'rgba(0,180,255,0.4)', bgcolor: 'rgba(0,180,255,0.06)', color: 'text.primary' },
                  }}
                  startIcon={<LoginIcon />}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Iniciar sesión
                  </Box>
                </Button>
              </Tooltip>
              <Tooltip title="Registrarse">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onNavigate('register')}
                  aria-label="Registrarse"
                  sx={{
                    borderColor: 'rgba(0,180,255,0.4)',
                    color: 'primary.main',
                    bgcolor: 'rgba(0,180,255,0.08)',
                    minWidth: { xs: 36, sm: 'auto' },
                    px: { xs: 1, sm: 1.5 },
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
                    '&:hover': { bgcolor: 'rgba(0,180,255,0.15)', boxShadow: '0 0 8px rgba(0,180,255,0.3)' },
                  }}
                  startIcon={<PersonAddIcon />}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Registrarse
                  </Box>
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </MotionAppBar>
  )
}

export default Header
