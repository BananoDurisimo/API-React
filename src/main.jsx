import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c63ff',
    },
    background: {
      default: '#050508',
      paper: '#0d0d14',
    },
    error: {
      main: '#ff4757',
    },
    warning: {
      main: '#ffa502',
    },
    text: {
      primary: '#e8e8f0',
      secondary: '#6b7080',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
    h2: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
    h3: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
    h4: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
    h5: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
    h6: { fontFamily: '"Orbitron", "Roboto", sans-serif' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap')",
        body: {
          backgroundImage:
            'radial-gradient(ellipse at 20% 20%, rgba(0,180,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,180,255,0.03) 0%, transparent 50%)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,180,255,0.4) #050508',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#050508' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,180,255,0.4)',
            borderRadius: 3,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
        containedPrimary: {
          color: '#050508',
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          '&:hover': {
            boxShadow: '0 0 8px #00b4ff, 0 0 20px rgba(0,180,255,0.4)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00b4ff',
            boxShadow: '0 0 0 3px rgba(0,180,255,0.1)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: '#00b4ff' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: 'rgba(0,180,255,0.4)',
            boxShadow: '0 8px 32px rgba(0,180,255,0.12), 0 0 0 1px rgba(0,180,255,0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(5,5,8,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,180,255,0.3)',
          boxShadow: '0 1px 30px rgba(0,180,255,0.08)',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
