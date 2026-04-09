import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Todos los campos son requeridos' })
    if (password.length < 6)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    const token = signToken(user._id)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, budget: user.budget } })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Todos los campos son requeridos' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' })

    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, budget: user.budget } })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
}
