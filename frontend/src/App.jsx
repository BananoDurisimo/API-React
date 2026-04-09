import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './features/layout/components/Header'
import Footer from './features/layout/components/Footer'
import Content from './features/layout/components/Content'
import Home from './features/articles/components/Home'
import Characters from './features/articles/components/Characters'
import Login from './features/auth/components/Login'
import Register from './features/auth/components/Register'

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } },
}

function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [page, setPage] = useState('landing')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved  = localStorage.getItem('currentUser')
    if (token && saved) {
      setCurrentUser(JSON.parse(saved))
    }
  }, [])

  const handleLoggedIn = (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
    setPage('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setPage('landing')
  }

  const handleNavigate = (target) => {
    // Proteger la página de gastos: redirigir a login si no está autenticado
    if (target === 'home' && !currentUser) {
      setPage('login')
      return
    }
    setPage(target)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentUser={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} currentPage={page} />

      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <Page key="landing"><Content onNavigate={handleNavigate} /></Page>
        )}
        {page === 'home' && currentUser && (
          <Page key="home"><Home currentUser={currentUser} /></Page>
        )}
        {page === 'characters' && (
          <Page key="characters"><Characters /></Page>
        )}
        {page === 'login' && (
          <Page key="login"><Login onLoggedIn={handleLoggedIn} onNavigate={handleNavigate} /></Page>
        )}
        {page === 'register' && (
          <Page key="register"><Register onRegistered={handleLoggedIn} onNavigate={handleNavigate} /></Page>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default App
