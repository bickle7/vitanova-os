import { useState } from 'react'
import { BookOpen, MessageSquareDashed, ChevronRight, Sparkles } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  onComplete: () => void
}

const SCREENS = [
  {
    id: 'welcome',
    icon: null,
    emoji: '🇪🇸',
    title: 'Your Spanish companion',
    subtitle: 'Built for real moments. In the bar, at the restaurant, on the street.',
    cta: 'Next',
  },
  {
    id: 'dictionary',
    icon: BookOpen,
    emoji: null,
    title: 'Your personal dictionary',
    subtitle: 'Add words, mark favourites and browse by category. Build a list that works for you.',
    cta: 'Next',
  },
  {
    id: 'phrases',
    icon: MessageSquareDashed,
    emoji: null,
    title: 'Build phrases in seconds',
    subtitle: 'Pick a situation, tap a connector, choose your words. Hold up your phone and go.',
    cta: 'Next',
  },
  {
    id: 'ready',
    icon: Sparkles,
    emoji: null,
    title: "You're all set",
    subtitle: '14 starter words are already in your dictionary. Add more anytime from the word bank.',
    cta: 'Done',
  },
]

export default function Onboarding({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  const screen = SCREENS[current]
  const isLast = current === SCREENS.length - 1

  const advance = () => {
    if (isLast) {
      onComplete()
      return
    }
    setExiting(true)
    setTimeout(() => {
      setCurrent(c => c + 1)
      setExiting(false)
    }, 180)
  }

  const Icon = screen.icon

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col">
      <div className="mx-auto max-w-[430px] w-full min-h-dvh flex flex-col">
        {/* Skip */}
        <div className="flex justify-end px-6 pt-safe">
          <div className="h-14 flex items-center">
            {!isLast && (
              <button
                onClick={onComplete}
                className="text-text-muted text-sm font-medium press-active hover:text-text-secondary transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={clsx(
            'flex-1 flex flex-col items-center justify-center px-8 text-center transition-all duration-180',
            exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          )}
          style={{ transitionDuration: '180ms' }}
        >
          {/* Icon / Emoji */}
          <div className="mb-10">
            {screen.emoji ? (
              <div className="text-7xl" style={{ filter: 'drop-shadow(0 4px 24px rgba(212,168,67,0.15))' }}>
                {screen.emoji}
              </div>
            ) : Icon ? (
              <div className="w-24 h-24 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto"
                   style={{ boxShadow: '0 0 40px rgba(212,168,67,0.12)' }}>
                <Icon size={40} className="text-accent" strokeWidth={1.5} />
              </div>
            ) : null}
          </div>

          {/* Text */}
          <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            {screen.title}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-[280px]">
            {screen.subtitle}
          </p>
        </div>

        {/* Bottom */}
        <div className="px-6 pb-safe">
          <div className="pb-8">
            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {SCREENS.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    'rounded-full transition-all duration-300',
                    i === current
                      ? 'w-6 h-2 bg-accent'
                      : 'w-2 h-2 bg-border-subtle'
                  )}
                />
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg-primary font-bold text-base press-active shadow-glow-accent transition-all duration-200"
            >
              <span>{screen.cta}</span>
              {!isLast && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
