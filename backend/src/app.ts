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

// Similar titles — AI suggests movies/shows similar to a given title
app.post('/api/similar', async (req, res) => {
  const { title, type } = req.body
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured' })
  }
  const mediaType = type === 'tv' ? 'TV show' : 'movie'
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Someone enjoyed the ${mediaType} "${title}". Suggest 5 similar movies or TV shows they would love. Reply in JSON only: {"suggestions": [{"title": "...", "type": "movie or tv", "year": "...", "genre": "...", "reason": "brief one-line reason why it's similar"}]}`,
      }],
    })
    const text = (message.content[0] as { type: string; text: string }).text
    const parsed = JSON.parse(text)
    res.json(parsed)
  } catch (err) {
    console.error('Similar titles error:', err)
    res.status(500).json({ error: 'Failed to get suggestions' })
  }
})

// Recommendations — Spotify-style AI recs based on watched/favourited history
app.post('/api/recommendations', async (req, res) => {
  const { watched, favourites } = req.body as { watched: string[]; favourites: string[] }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured' })
  }
  const allTitles = [...(favourites ?? []), ...(watched ?? [])]
  if (allTitles.length === 0) {
    return res.status(400).json({ error: 'No watch history provided' })
  }
  const favouritesList = favourites?.length ? `Favourites: ${favourites.join(', ')}. ` : ''
  const watchedList = watched?.length ? `Also watched: ${watched.join(', ')}.` : ''
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: `Based on this person's taste: ${favouritesList}${watchedList} Suggest 8 movies and TV shows they would enjoy. Mix movies and TV shows. For each, reference a specific title from their list in the reason where possible. Reply in JSON only: {"recommendations": [{"title": "...", "type": "movie or tv", "year": "...", "genre": "...", "reason": "Because you watched/loved ..."}]}`,
      }],
    })
    const text = (message.content[0] as { type: string; text: string }).text
    const parsed = JSON.parse(text)
    res.json(parsed)
  } catch (err) {
    console.error('Recommendations error:', err)
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

// Parse titles — extract clean movie/TV titles from messy pasted text
app.post('/api/parse-titles', async (req, res) => {
  const { rawText } = req.body
  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'rawText is required' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured' })
  }
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Extract movie and TV show titles from this text. Rules:
- SKIP any title wrapped in strikethrough markdown (~~like this~~)
- SKIP any line that is just a URL
- Strip trailing notes after a dash or hyphen (e.g. "Old Henry - cowboy film" → "Old Henry")
- Strip trailing question marks and symbols
- Each line or comma-separated item may be one title
- Only include real, recognisable movie or TV show titles
- Return ONLY a JSON array of clean title strings, nothing else

Text:
${rawText.trim()}`,
      }],
    })
    const text = (message.content[0] as { type: string; text: string }).text.trim()
    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const titles = JSON.parse(jsonText)
    if (!Array.isArray(titles)) throw new Error('Expected array')
    res.json({ titles: titles.filter((t: unknown) => typeof t === 'string' && t.trim()) })
  } catch (err) {
    console.error('Parse titles error:', err)
    res.status(500).json({ error: 'Failed to parse titles' })
  }
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

export default app
