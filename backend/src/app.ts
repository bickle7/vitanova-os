import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

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

// Translation endpoint — called by frontend to avoid exposing API key in browser
app.post('/api/translate', async (req, res) => {
  const { english } = req.body
  if (!english || typeof english !== 'string') {
    return res.status(400).json({ error: 'english text is required' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Translation service not configured' })
  }
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Translate "${english.trim()}" from English to Spanish. Reply in JSON only: {"spanish":"...","pronunciation":"..."}. Pronunciation should be a simple phonetic guide for English speakers (e.g. "la PLA-ya").`,
      }],
    })
    const text = (message.content[0] as { type: string; text: string }).text
    const parsed = JSON.parse(text)
    res.json({ spanish: parsed.spanish ?? '', pronunciation: parsed.pronunciation ?? '' })
  } catch (err) {
    console.error('Translation error:', err)
    res.status(500).json({ error: 'Translation failed' })
  }
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
