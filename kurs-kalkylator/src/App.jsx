import React, { useState } from 'react'
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117', color: '#EDE9E3' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(13,17,23,0.92)',
          borderColor: '#252D38',
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
              color: '#ECA234',
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
                  backgroundColor: view === key ? 'rgba(236,162,52,0.12)' : 'transparent',
                  color: view === key ? '#ECA234' : '#6E7A88',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Spacer to balance logo */}
          <div style={{ width: '100px', flexShrink: 0 }} />
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
                color: '#ECA234',
                backgroundColor: 'rgba(236,162,52,0.08)',
                border: '1px solid rgba(236,162,52,0.2)',
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
                color: '#F0EDE8',
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
                color: '#8A96A6',
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
            <ProgressChart metrics={metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsPanel metrics={metrics} onChange={setMetrics} />
              <MilestoneCards metrics={metrics} />
            </div>

            <div
              className="p-6 text-sm leading-relaxed"
              style={{
                backgroundColor: '#161C24',
                border: '1px solid #252D38',
                borderRadius: '12px',
                color: '#6E7A88',
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <strong style={{ color: '#EDE9E3' }}>Om beräkningarna</strong> – Ordförrådsmålen
              baseras på forskning om andraspråksinlärning hos vuxna immigranter i Sverige: SFI
              kräver ca 2 500 ordfamiljer, Grundläggande svenska ca 5 000, och SVA på gymnasienivå
              ca 9 000. Det effektiva dagliga ordtillskottet beräknas som{' '}
              <em>(aktiva ord + studietidsbonus) × inlärningsfaktor</em>, där grammatik- och
              läsvanor kan öka takten med upp till 50%.{' '}
              <button
                onClick={() => setView('forskning')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#ECA234',
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
      {view === 'forskning' && <ResearchPage />}
    </div>
  )
}
