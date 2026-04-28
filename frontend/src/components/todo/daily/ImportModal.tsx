import { useState, useRef } from 'react'
import { X, Upload, Camera, FileText, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import Anthropic from '@anthropic-ai/sdk'

interface Props {
  onImport: (titles: string[]) => void
  onClose: () => void
}

type ImportTab = 'photo' | 'paste'

async function extractTasksFromImage(base64Data: string, mediaType: string): Promise<string[]> {
  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
  })
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: base64Data,
          },
        },
        {
          type: 'text',
          text: 'Extract all task/to-do items from this image. Return ONLY a JSON array of strings, one string per task item. Example: ["Buy milk", "Call dentist"]. If no tasks visible, return [].',
        },
      ],
    }],
  })
  const text = (response.content[0] as { type: string; text: string }).text
  // Extract JSON array from the response
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  return JSON.parse(match[0]) as string[]
}

export default function ImportModal({ onImport, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ImportTab>('photo')

  // Photo tab state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMediaType, setImageMediaType] = useState<string>('')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [extractedTasks, setExtractedTasks] = useState<string[] | null>(null)
  const [selectedExtracted, setSelectedExtracted] = useState<boolean[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Paste tab state
  const [pasteText, setPasteText] = useState('')
  const parsedLines = pasteText
    .split('\n')
    .map(l => l.replace(/^[-*•·\d.)\s]+/, '').trim())
    .filter(Boolean)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setExtractedTasks(null)
    setExtractError(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImagePreview(dataUrl)
      // Strip the data:...;base64, prefix
      const base64 = dataUrl.split(',')[1]
      setImageBase64(base64)
      setImageMediaType(file.type || 'image/jpeg')
    }
    reader.readAsDataURL(file)
  }

  const handleExtract = async () => {
    if (!imageBase64) return
    setExtracting(true)
    setExtractError(null)
    try {
      const tasks = await extractTasksFromImage(imageBase64, imageMediaType)
      setExtractedTasks(tasks)
      setSelectedExtracted(tasks.map(() => true))
    } catch (err) {
      setExtractError('Failed to extract tasks. Please try again.')
      console.error(err)
    } finally {
      setExtracting(false)
    }
  }

  const handleImportPhoto = () => {
    if (!extractedTasks) return
    const toImport = extractedTasks.filter((_, i) => selectedExtracted[i])
    if (toImport.length === 0) return
    onImport(toImport)
    onClose()
  }

  const handleImportPaste = () => {
    if (parsedLines.length === 0) return
    onImport(parsedLines)
    onClose()
  }

  const toggleExtracted = (i: number) => {
    setSelectedExtracted(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const selectedCount = extractedTasks
    ? extractedTasks.filter((_, i) => selectedExtracted[i]).length
    : 0

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe" style={{ maxHeight: '85dvh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3">
          <h2 className="text-base font-semibold text-text-primary">Import Tasks</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 mb-4">
          <button
            onClick={() => setActiveTab('photo')}
            className={clsx(
              'pill-btn flex items-center gap-1.5 flex-1 justify-center',
              activeTab === 'photo' ? 'pill-btn-active' : 'pill-btn-inactive'
            )}
          >
            <Camera size={13} />
            Photo
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={clsx(
              'pill-btn flex items-center gap-1.5 flex-1 justify-center',
              activeTab === 'paste' ? 'pill-btn-active' : 'pill-btn-inactive'
            )}
          >
            <FileText size={13} />
            Paste
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide px-5 pb-6" style={{ maxHeight: '60dvh' }}>
          {/* ── Photo tab ── */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              {/* Upload area */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  'w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors press-active',
                  imagePreview ? 'border-accent/40 bg-bg-elevated p-2' : 'border-border-subtle bg-bg-elevated p-10 hover:border-accent/40'
                )}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full max-h-48 object-contain rounded-xl"
                  />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center">
                      <Upload size={20} className="text-text-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text-secondary">Take a photo or choose from library</p>
                      <p className="text-xs text-text-muted mt-0.5">Supports photos of handwritten lists, notes, screenshots</p>
                    </div>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Re-select button when image is loaded */}
              {imagePreview && !extractedTasks && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 text-xs text-text-muted hover:text-text-secondary transition-colors text-center"
                >
                  Choose a different image
                </button>
              )}

              {/* Error */}
              {extractError && (
                <p className="text-sm text-red-400 text-center">{extractError}</p>
              )}

              {/* Extracted tasks list */}
              {extractedTasks && extractedTasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Extracted tasks — tap to deselect
                  </p>
                  <div className="space-y-1.5">
                    {extractedTasks.map((task, i) => (
                      <button
                        key={i}
                        onClick={() => toggleExtracted(i)}
                        className={clsx(
                          'w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150 flex items-center gap-3',
                          selectedExtracted[i]
                            ? 'bg-accent/10 border-accent/40 text-text-primary'
                            : 'bg-bg-elevated border-border-subtle text-text-muted line-through'
                        )}
                      >
                        <span className={clsx(
                          'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                          selectedExtracted[i] ? 'bg-accent border-accent' : 'border-border-subtle'
                        )}>
                          {selectedExtracted[i] && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="#08080e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className="text-sm">{task}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {extractedTasks && extractedTasks.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">
                  No tasks found in this image. Try a clearer photo.
                </p>
              )}

              {/* Action button */}
              {!extractedTasks ? (
                <button
                  onClick={handleExtract}
                  disabled={!imageBase64 || extracting}
                  className={clsx(
                    'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 press-active flex items-center justify-center gap-2',
                    imageBase64 && !extracting
                      ? 'bg-accent text-bg-primary shadow-glow-accent'
                      : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                  )}
                >
                  {extracting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Extracting tasks...
                    </>
                  ) : (
                    'Extract tasks'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleImportPhoto}
                  disabled={selectedCount === 0}
                  className={clsx(
                    'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 press-active',
                    selectedCount > 0
                      ? 'bg-accent text-bg-primary shadow-glow-accent'
                      : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                  )}
                >
                  Import {selectedCount > 0 ? `${selectedCount} task${selectedCount !== 1 ? 's' : ''}` : 'tasks'}
                </button>
              )}
            </div>
          )}

          {/* ── Paste tab ── */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your list here...&#10;&#10;• Buy groceries&#10;• Call dentist&#10;• Fix the dripping tap"
                className="input-base min-h-[160px] resize-none leading-relaxed"
                autoFocus
              />

              {parsedLines.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    {parsedLines.length} task{parsedLines.length !== 1 ? 's' : ''} detected
                  </p>
                  <div className="space-y-1.5">
                    {parsedLines.map((line, i) => (
                      <div
                        key={i}
                        className="px-3 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-sm text-text-primary"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleImportPaste}
                disabled={parsedLines.length === 0}
                className={clsx(
                  'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 press-active',
                  parsedLines.length > 0
                    ? 'bg-accent text-bg-primary shadow-glow-accent'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                )}
              >
                {parsedLines.length > 0
                  ? `Import ${parsedLines.length} task${parsedLines.length !== 1 ? 's' : ''}`
                  : 'Import tasks'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
