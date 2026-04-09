import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        py: 2,
        px: { xs: 2, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 2 },
        bgcolor: 'rgba(5,5,8,0.6)',
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontFamily: '"Orbitron", sans-serif', color: 'primary.main', fontSize: '0.7rem' }}
      >
        DailyTrack
      </Typography>
      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,180,255,0.4)', display: { xs: 'none', sm: 'block' } }} />
      <Typography variant="caption" color="text.secondary">
        Hecho con React + Vite
      </Typography>
      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,180,255,0.4)', display: { xs: 'none', sm: 'block' } }} />
      <Typography variant="caption" color="text.secondary">
        &copy; 2026
      </Typography>
    </Box>
  )
}

export default Footer
