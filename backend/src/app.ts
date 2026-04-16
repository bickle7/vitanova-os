import express from 'express'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vitanova-os-backend', version: '0.1.0' })
})

// Spanish vocabulary routes (scaffold - data stored in localStorage for Feature 1)
app.get('/api/words', (_req, res) => {
  res.json({
    message: 'Feature 1 uses localStorage. Supabase sync coming soon.',
    words: [],
  })
})

app.post('/api/words', (req, res) => {
  const { english, spanish, category, pronunciation } = req.body
  if (!english || !spanish || !category) {
    return res.status(400).json({ error: 'english, spanish, and category are required' })
  }
  // TODO: persist to Supabase
  res.status(201).json({
    id: `server_${Date.now()}`,
    english,
    spanish,
    category,
    pronunciation: pronunciation ?? null,
    is_favourite: false,
    use_count: 0,
    source: 'custom',
    created_at: new Date().toISOString(),
  })
})

app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params
  // TODO: delete from Supabase
  res.json({ success: true, id })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

export default app
