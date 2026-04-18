import React, { useState, useEffect } from 'react'
import MetricsPanel from './components/MetricsPanel'
import ProgressChart from './components/ProgressChart'
import MilestoneCards from './components/MilestoneCards'
import ResearchPage from './components/ResearchPage'

const DEFAULT_METRICS = {
  currentVocab: 0,
  wordsPerDay: 10,
  studyHours: 10,
  grammarScore: 5,
  background: 'lag',
}

export default function App() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS)
  const [view, setView] = useState('kalkylator')
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') ?? 'dark'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-body)' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: '0.8125rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              flexShrink: 0,
            }}
          >
            L2 Ordförråd
          </span>

          {/* Nav tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'kalkylator', label: 'Kalkylator' },
              { key: 'forskning', label: 'Forskning' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                  backgroundColor: view === key ? 'var(--amber-bg)' : 'transparent',
                  color: view === key ? 'var(--amber)' : 'var(--text-secondary)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8125rem',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>
        </div>
      </nav>

      {/* Kalkylator view */}
      {view === 'kalkylator' && (
        <>
          <header className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                marginBottom: '28px',
                fontSize: '0.6875rem',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--amber)',
                backgroundColor: 'var(--amber-bg)',
                border: '1px solid var(--amber-border)',
                borderRadius: '3px',
              }}
            >
              Personlig kalkylator
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              Hur lång tid tar det?
            </h1>
            <p
              className="max-w-2xl mx-auto"
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Ange dina förutsättningar för att se en prognos över hur lång tid det tar att nå{' '}
              <strong style={{ color: '#2CC9A0', fontWeight: 500 }}>SFI</strong>,{' '}
              <strong style={{ color: '#E0855A', fontWeight: 500 }}>Grundläggande svenska</strong> och{' '}
              <strong style={{ color: '#9B88D1', fontWeight: 500 }}>SVA</strong>.
            </p>
          </header>

          <main className="max-w-6xl mx-auto px-4 pb-24 space-y-6">
            <ProgressChart metrics={metrics} isDark={isDark} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsPanel metrics={metrics} onChange={setMetrics} />
              <MilestoneCards metrics={metrics} />
            </div>

            {/* Stabilisering info box */}
            <div
              className="p-6 text-sm leading-relaxed"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>Om språklig stabilisering</strong>
              {' '}— Utan kontinuerlig exponering för utmanande texter kan ordförrådsutvecklingen{' '}
              <em style={{ color: 'var(--amber)' }}>stabiliseras</em> — plana ut — runt B1-nivå (~3 500 ord).
              Det äldre begreppet <em>fossilisering</em> (Selinker 1972) antydde en permanent stopp, men
              modern forskning visar att platån är reversibel. Grammatikstudier och regelbunden läsning
              (se inställningarna ovan) är de viktigaste faktorerna för att bryta igenom.{' '}
              <button
                onClick={() => setView('forskning')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--amber)',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                Läs mer →
              </button>
            </div>

            {/* Om beräkningarna */}
            <div
              className="p-6 text-sm leading-relaxed"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>Om beräkningarna</strong>
              {' '}– Ordförrådsmålen baseras på forskning om andraspråksinlärning hos vuxna immigranter i
              Sverige: SFI kräver ca 2 500 ordfamiljer, Grundläggande svenska ca 5 000, och SVA på
              gymnasienivå ca 9 000. Det effektiva dagliga ordtillskottet beräknas som{' '}
              <em>(aktiva ord + studietidsbonus) × inlärningsfaktor</em>, där grammatik- och läsvanor
              kan öka takten med upp till 50%.{' '}
              <button
                onClick={() => setView('forskning')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--amber)',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                Läs forskningen →
              </button>
            </div>
          </main>
        </>
      )}

      {/* Research view */}
      {view === 'forskning' && <ResearchPage isDark={isDark} />}
    </div>
  )
}
