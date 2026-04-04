import React, { useState } from 'react'
import { estimateMilestones, formatDuration, dailyGain } from '../utils/calculations'

const MILESTONE_STYLES = [
  {
    accent: '#2CC9A0',
    glowDark: 'rgba(44,201,160,0.06)',
    glowLight: 'rgba(44,201,160,0.10)',
    borderDark: 'rgba(44,201,160,0.18)',
    borderLight: 'rgba(44,201,160,0.25)',
  },
  {
    accent: '#E0855A',
    glowDark: 'rgba(224,133,90,0.06)',
    glowLight: 'rgba(224,133,90,0.10)',
    borderDark: 'rgba(224,133,90,0.18)',
    borderLight: 'rgba(224,133,90,0.25)',
  },
  {
    accent: '#9B88D1',
    glowDark: 'rgba(155,136,209,0.06)',
    glowLight: 'rgba(155,136,209,0.10)',
    borderDark: 'rgba(155,136,209,0.18)',
    borderLight: 'rgba(155,136,209,0.25)',
  },
]

function SubcourseList({ subcourses, metrics, accent }) {
  const gain = dailyGain(metrics)
  return (
    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
      {subcourses.map((sub) => {
        const already = metrics.currentVocab >= sub.target
        const months = already ? 0 : gain <= 0 ? null : Math.ceil((sub.target - metrics.currentVocab) / (gain * 30))
        const progress = Math.min(100, (metrics.currentVocab / sub.target) * 100)
        return (
          <div
            key={sub.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: already ? accent : 'var(--text-label)',
                    fontFamily: "'IBM Plex Sans', sans-serif",
                  }}
                >
                  {sub.label}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-tertiary)',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {sub.target.toLocaleString('sv')} ord
                </span>
              </div>
              <div style={{ height: '2px', borderRadius: '9999px', backgroundColor: 'var(--progress-track)', overflow: 'hidden', width: '100%' }}>
                <div style={{ height: '100%', width: `${progress}%`, backgroundColor: accent, borderRadius: '9999px', opacity: 0.6, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <div style={{ marginLeft: '16px', textAlign: 'right', flexShrink: 0 }}>
              {already ? (
                <span style={{ fontSize: '0.6875rem', color: accent, fontFamily: "'IBM Plex Mono', monospace" }}>✓</span>
              ) : (
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {formatDuration(months)}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MilestoneCards({ metrics }) {
  const estimates = estimateMilestones(metrics)
  const gain = dailyGain(metrics)
  const [open, setOpen] = useState({})
  const isDark = document.documentElement.dataset.theme !== 'light'

  function toggle(id) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-4">
      <div
        className="p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '4px',
          }}
        >
          Tid till varje nivå
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Baserat på{' '}
          <strong style={{ color: 'var(--amber)', fontFamily: "'IBM Plex Mono', monospace" }}>
            {gain.toFixed(1)} ord/dag
          </strong>{' '}
          effektivt ordtillskott.
        </p>

        <div className="space-y-3">
          {estimates.map(({ milestone, months, alreadyReached }, i) => {
            const s = MILESTONE_STYLES[i]
            const glow = isDark ? s.glowDark : s.glowLight
            const border = isDark ? s.borderDark : s.borderLight
            const progress = Math.min(100, (metrics.currentVocab / milestone.target) * 100)
            const isOpen = open[milestone.id]

            return (
              <div
                key={milestone.id}
                style={{
                  backgroundColor: glow,
                  border: `1px solid ${border}`,
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        color: s.accent,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        marginBottom: '2px',
                      }}
                    >
                      {milestone.label}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{milestone.sublabel}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {alreadyReached ? (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: s.accent,
                          fontFamily: "'IBM Plex Mono', monospace",
                          backgroundColor: `${s.accent}22`,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: `1px solid ${s.accent}44`,
                          letterSpacing: '0.05em',
                        }}
                      >
                        NÅDD ✓
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: s.accent,
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {formatDuration(months)}
                      </span>
                    )}

                    <button
                      onClick={() => toggle(milestone.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: `1px solid ${border}`,
                        backgroundColor: isOpen ? `${s.accent}22` : 'transparent',
                        color: s.accent,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontFamily: "'IBM Plex Mono', monospace",
                        transition: 'background-color 0.15s ease',
                        flexShrink: 0,
                      }}
                      title={isOpen ? 'Dölj delkurser' : 'Visa delkurser'}
                    >
                      {isOpen ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {/* Description + target */}
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{milestone.description}</p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, marginLeft: '8px' }}>
                    {milestone.target.toLocaleString('sv')} ord
                  </span>
                </div>

                {/* Main progress bar */}
                {!alreadyReached && (
                  <div style={{ marginTop: '12px', height: '3px', borderRadius: '9999px', backgroundColor: 'var(--progress-track)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        width: `${progress}%`,
                        backgroundColor: s.accent,
                        boxShadow: `0 0 8px ${s.accent}`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                )}

                {isOpen && milestone.subcourses && (
                  <SubcourseList subcourses={milestone.subcourses} metrics={metrics} accent={s.accent} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
