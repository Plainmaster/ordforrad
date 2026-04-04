import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { generateProgressSeries, MILESTONES, xAxisTickFormatter } from '../utils/calculations'

const MILESTONE_COLORS = ['#2CC9A0', '#E0855A', '#9B88D1']

function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null
  const words = payload[0]?.value
  return (
    <div
      style={{
        backgroundColor: isDark ? '#1E2632' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2E3947' : '#E0D9CF'}`,
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.8125rem',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <p style={{ fontWeight: 500, marginBottom: '4px', color: isDark ? '#C4CDD6' : '#5A4E44' }}>{label}</p>
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: isDark ? '#ECA234' : '#C8841A',
          fontWeight: 600,
        }}
      >
        {words?.toLocaleString('sv')} ordfamiljer
      </p>
    </div>
  )
}

function yTickFormatter(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value
}

export default function ProgressChart({ metrics, isDark }) {
  const series = useMemo(() => generateProgressSeries(metrics), [metrics])

  const chartTicks = useMemo(() => {
    const maxMonth = series.length > 0 ? series[series.length - 1].month : 24
    const ticks = []
    for (let m = 0; m <= maxMonth; m += 6) ticks.push(m)
    return ticks
  }, [series])

  const maxWords = Math.max(
    ...series.map((d) => d.words),
    MILESTONES[MILESTONES.length - 1].target + 500
  )

  const gridColor = isDark ? '#1C2430' : '#EDE6DC'
  const axisTickColor = isDark ? '#7A8896' : '#8C7B6A'
  const axisLineColor = isDark ? '#252D38' : '#E0D9CF'
  const amberColor = isDark ? '#ECA234' : '#C8841A'

  return (
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
        Framstegsprognos
      </h2>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Projektion av ditt ordförråd över tid med aktuella inställningar.
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={series} margin={{ top: 10, right: 150, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            ticks={chartTicks}
            tickFormatter={xAxisTickFormatter}
            tick={{ fontSize: 11, fill: axisTickColor, fontFamily: "'IBM Plex Mono', monospace" }}
            axisLine={{ stroke: axisLineColor }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={yTickFormatter}
            tick={{ fontSize: 11, fill: axisTickColor, fontFamily: "'IBM Plex Mono', monospace" }}
            domain={[0, Math.ceil(maxWords / 1000) * 1000]}
            width={40}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />

          {MILESTONES.map((m, i) => (
            <ReferenceLine
              key={m.id}
              y={m.target}
              stroke={MILESTONE_COLORS[i]}
              strokeDasharray="4 4"
              strokeWidth={1}
              strokeOpacity={0.5}
              label={{
                value: m.label,
                position: 'insideTopRight',
                fontSize: 10,
                fill: MILESTONE_COLORS[i],
                fontWeight: 600,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
          ))}

          <Line
            type="monotone"
            dataKey="words"
            stroke={amberColor}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: amberColor, stroke: isDark ? '#0D1117' : '#F9F6F1', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {MILESTONES.map((m, i) => (
          <span
            key={m.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '20px',
                height: '2px',
                background: `repeating-linear-gradient(90deg, ${MILESTONE_COLORS[i]} 0, ${MILESTONE_COLORS[i]} 4px, transparent 4px, transparent 8px)`,
              }}
            />
            {m.label} ({m.target.toLocaleString('sv')})
          </span>
        ))}
      </div>
    </div>
  )
}
