import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true, trim: true },
  amount:      { type: Number, required: true, min: 1 },
  category:    { type: String, required: true },
  date:        { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Expense', expenseSchema)
