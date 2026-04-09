import 'dotenv/config'
import { connectDB } from './config/db.js'
import app from './app.js'

connectDB().catch(console.error)

// Solo escucha en local (en Vercel no se llama listen)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`))
}

export default app
