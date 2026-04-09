import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Card, CardContent,
  Chip, CircularProgress, TextField, Pagination, InputAdornment,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'

const MotionCard = motion(Card)

const statusConfig = {
  Alive:   { label: 'Alive',   color: 'success', icon: <FavoriteIcon sx={{ fontSize: 11 }} /> },
  Dead:    { label: 'Dead',    color: 'error',   icon: <HeartBrokenIcon sx={{ fontSize: 11 }} /> },
  unknown: { label: '?',       color: 'warning', icon: <HelpOutlineIcon sx={{ fontSize: 11 }} /> },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

function Content() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [page, setPage]     = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery]   = useState('')   // valor confirmado (con debounce)

  // Debounce: espera 400ms después de que el usuario deja de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCharacters = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page })
    if (query.trim()) params.set('name', query.trim())

    axios
      .get('https://rickandmortyapi.com/api/character', { params: Object.fromEntries(params) })
      .then(({ data }) => {
        setCharacters(data.results)
        setTotalPages(data.info.pages)
        setTotalCount(data.info.count)
        setLoading(false)
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setCharacters([])
          setTotalPages(0)
          setTotalCount(0)
          setError('no_results')
        } else {
          setError('fetch_error')
        }
        setLoading(false)
      })
  }, [page, query])

  useEffect(() => { fetchCharacters() }, [fetchCharacters])

  const handlePageChange = (_, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" align="center" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, mb: 0.5 }}>
          Personajes de{' '}
          <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 8px #00b4ff, 0 0 20px rgba(0,180,255,0.4)' }}>
            Rick &amp; Morty
          </Box>
        </Typography>
        <Typography align="center" color="text.secondary" variant="body2" sx={{ mb: 3.5 }}>
          {query ? `${totalCount} resultados para "${query}"` : `${totalCount} personajes en total`}
        </Typography>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <Box sx={{ maxWidth: 480, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar personaje..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: query ? 'primary.main' : 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </motion.div>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </motion.div>
          <Typography variant="body2" color="text.secondary">Cargando...</Typography>
        </Box>
      )}

      {/* Sin resultados */}
      {!loading && error === 'no_results' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 10, opacity: 0.5 }}>
            <SearchOffIcon sx={{ fontSize: 48 }} />
            <Typography variant="body1" fontWeight={500}>Sin resultados para "{query}"</Typography>
            <Typography variant="body2" color="text.secondary">Intenta con otro nombre</Typography>
          </Box>
        </motion.div>
      )}

      {/* Error de red */}
      {!loading && error === 'fetch_error' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <Typography color="error">Error al conectar con la API.</Typography>
          </Box>
        </motion.div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${query}-${page}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
          >
            {characters.map((char) => {
              const status = statusConfig[char.status] ?? statusConfig.unknown
              return (
                <MotionCard
                  key={char.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: '0 8px 32px rgba(0,180,255,0.15), 0 0 0 1px rgba(0,180,255,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ overflow: 'hidden' }}>
                    <motion.img
                      src={char.image}
                      alt={char.name}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }}
                    />
                  </Box>
                  <CardContent sx={{ p: '10px 14px !important' }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 0.75 }}>
                      {char.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">{char.species}</Typography>
                      <Chip
                        label={status.label}
                        icon={status.icon}
                        color={status.color}
                        size="small"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.03em', '& .MuiChip-icon': { ml: '4px' } }}
                      />
                    </Box>
                  </CardContent>
                </MotionCard>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'text.secondary',
                  border: '1px solid rgba(255,255,255,0.08)',
                  '&:hover': { bgcolor: 'rgba(0,180,255,0.08)', borderColor: 'rgba(0,180,255,0.3)' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,180,255,0.15)',
                    borderColor: 'rgba(0,180,255,0.5)',
                    color: 'primary.main',
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'rgba(0,180,255,0.22)' },
                  },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Página {page} de {totalPages}
            </Typography>
          </Box>
        </motion.div>
      )}

    </Container>
  )
}

export default Content
