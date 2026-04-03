import React from 'react'

const BACKGROUNDS = {
  ingen: { label: 'Ingen formell skolgång',            sublabel: '0–5 år' },
  lag:   { label: 'Grundläggande skolgång',            sublabel: '6–9 år' },
  hog:   { label: 'Gymnasie- eller högskoleutbildning', sublabel: '10+ år' },
}

const KNOWLEDGE_LEVELS = [
  { label: 'Nybörjare (0 ord)', value: 0 },
  { label: 'Lite svenska (~300 ord)', value: 300 },
  { label: 'A1 – Grundläggande (~600 ord)', value: 600 },
  { label: 'A2 – Elementär (~1 200 ord)', value: 1200 },
  { label: 'B1 – Mellanliggande (~2 000 ord)', value: 2000 },
  { label: 'B2 – Övre mellanliggande (~3 500 ord)', value: 3500 },
]

function Slider({ id, label, min, max, step, value, onChange, formatValue, hint }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={id}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#9AA6B4',
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          {label}
        </label>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#ECA234',
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ '--pct': `${pct}%` }}
      />
      {hint && (
        <p style={{ fontSize: '0.75rem', color: '#4E5C6A' }}>{hint}</p>
      )}
    </div>
  )
}

function GrammarScale({ value, onChange }) {
  const descriptor =
    value <= 2
      ? 'Studerar inte grammatik aktivt'
      : value <= 5
      ? 'Läser och studerar ibland'
      : value <= 8
      ? 'Läser och studerar grammatik regelbundet'
      : 'Läser böcker och studerar grammatik intensivt'
  const pct = (value / 10) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#9AA6B4',
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Grammatik & läsvanor
        </label>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#ECA234',
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {value} / 10
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ '--pct': `${pct}%` }}
      />
      <p style={{ fontSize: '0.75rem', color: '#6E7A88', fontStyle: 'italic' }}>{descriptor}</p>
    </div>
  )
}

export default function MetricsPanel({ metrics, onChange }) {
  const { currentVocab, wordsPerDay, studyHours, grammarScore, background } = metrics

  function set(key) {
    return (val) => onChange({ ...metrics, [key]: val })
  }

  return (
    <div
      className="p-6 space-y-7"
      style={{
        backgroundColor: '#161C24',
        border: '1px solid #252D38',
        borderRadius: '16px',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F0EDE8',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '4px',
          }}
        >
          Dina förutsättningar
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#6E7A88' }}>
          Justera inställningarna för att se hur lång tid det tar att nå varje kursnivå.
        </p>
      </div>

      {/* Current knowledge level */}
      <div className="space-y-2">
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#9AA6B4',
            fontFamily: "'IBM Plex Sans', sans-serif",
            display: 'block',
          }}
        >
          Nuvarande kunskapsnivå
        </label>
        <select
          value={currentVocab}
          onChange={(e) => set('currentVocab')(Number(e.target.value))}
          style={{
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #2E3947',
            backgroundColor: '#0D1117',
            padding: '10px 14px',
            fontSize: '0.875rem',
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: '#EDE9E3',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {KNOWLEDGE_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <p style={{ fontSize: '0.75rem', color: '#4E5C6A' }}>
          Kända ordfamiljer:{' '}
          <strong
            style={{ color: '#ECA234', fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {currentVocab.toLocaleString('sv')}
          </strong>
        </p>
      </div>

      <Slider
        id="wordsPerDay"
        label="Ord du lär dig per dag"
        min={1}
        max={50}
        step={1}
        value={wordsPerDay}
        onChange={set('wordsPerDay')}
        formatValue={(v) => `${v} ord/dag`}
        hint="Via flashcards, glosor eller övningar"
      />

      {/* Warning: high daily quota creates unsustainable review debt */}
      {wordsPerDay > 20 && (
        <div
          style={{
            backgroundColor: 'rgba(236,162,52,0.10)',
            border: '1px solid rgba(236,162,52,0.35)',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '0.75rem',
            lineHeight: 1.6,
            color: '#C8A06A',
          }}
        >
          <strong
            style={{
              color: '#ECA234',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <span aria-hidden="true">⚠</span> VARNING
          </strong>
          Med {wordsPerDay} nya ord per dag samlas snabbt en stor repetitionsskuld. Varje
          inlärt ord behöver återkallas upprepade gånger under flera dagar och veckor för
          att befästas i långtidsminnet. Hög daglig dos gör att repetitioner staplas upp
          och ny inlärning kvävs. Rekommendation: max 10–20 nya ord per dag för ett
          hållbart schema.
        </div>
      )}

      <Slider
        id="studyHours"
        label="Studietimmar per vecka"
        min={0}
        max={40}
        step={1}
        value={studyHours}
        onChange={set('studyHours')}
        formatValue={(v) => `${v} tim/v`}
        hint="Skola, självstudier och läsning"
      />

      <GrammarScale value={grammarScore} onChange={set('grammarScore')} />

      {/* Personlig bakgrund */}
      <div className="space-y-2">
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#9AA6B4',
            fontFamily: "'IBM Plex Sans', sans-serif",
            display: 'block',
          }}
        >
          Personlig bakgrund
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(BACKGROUNDS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => set('background')(key)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1px solid ${background === key ? 'rgba(236,162,52,0.4)' : '#252D38'}`,
                backgroundColor: background === key ? 'rgba(236,162,52,0.08)' : 'transparent',
                color: background === key ? '#ECA234' : '#9AA6B4',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.8125rem',
                transition: 'all 0.15s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{val.label}</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 400,
                  color: background === key ? '#ECA234' : '#4E5C6A',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {val.sublabel}
              </span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#4E5C6A' }}>
          Skolbakgrund påverkar framför allt incidentell inlärning via exponering.
        </p>
        {background === 'ingen' && (
          <div
            style={{
              backgroundColor: 'rgba(110,120,136,0.08)',
              border: '1px solid rgba(110,120,136,0.2)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.75rem',
              lineHeight: 1.6,
              color: '#7A8694',
            }}
          >
            Prognosen är optimistisk för den här gruppen. Inlärare utan formell skolgång
            är ofta äldre och bygger upp läsförmågan parallellt med språket. Kunskaper
            kräver fler repetitioner och fäster långsammare — och en stor andel fullföljer
            inte SFI.
          </div>
        )}
      </div>

      {/* Info box */}
      <div
        style={{
          backgroundColor: 'rgba(236,162,52,0.06)',
          border: '1px solid rgba(236,162,52,0.15)',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '0.75rem',
          lineHeight: 1.6,
          color: '#8A96A6',
        }}
      >
        <strong
          style={{
            color: '#ECA234',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          OM FORMELN
        </strong>
        Effektivt dagligt tillskott = <em>aktiva ord × (1–10%)</em> + <em>studietimmar-bonus × (1–50%)</em>.
        Grammatik och läsvanor förstärker framför allt incidentell inlärning via exponering —
        inte aktiv memorering. 7 studietimmar/vecka ≈ 1 bonus-ord/dag.
      </div>
    </div>
  )
}
