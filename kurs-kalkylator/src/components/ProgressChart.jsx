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
import { generateProgressSeries, MILESTONES } from '../utils/calculations'

const MILESTONE_COLORS = ['#2CC9A0', '#E0855A', '#9B88D1']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const words = payload[0]?.value
  return (
    <div
      style={{
        backgroundColor: '#1E2632',
        border: '1px solid #2E3947',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.8125rem',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <p style={{ fontWeight: 500, marginBottom: '4px', color: '#9AA6B4' }}>{label}</p>
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: '#ECA234',
          fontWeight: 600,
        }}
      >
        {words?.toLocaleString('sv')} ordfamiljer
      </p>
    </div>
  )
}

function tickFormatter(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value
}

export default function ProgressChart({ metrics }) {
  const series = useMemo(() => generateProgressSeries(metrics), [metrics])

  const formattedSeries = series

  const maxWords = Math.max(
    ...series.map((d) => d.words),
    MILESTONES[MILESTONES.length - 1].target + 500
  )

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: '#161C24',
        border: '1px solid #252D38',
        borderRadius: '16px',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#F0EDE8',
          fontFamily: "'Playfair Display', serif",
          marginBottom: '4px',
        }}
      >
        Framstegsprognos
      </h2>
      <p style={{ fontSize: '0.8125rem', color: '#6E7A88', marginBottom: '24px' }}>
        Projektion av ditt ordförråd över tid med aktuella inställningar.
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={formattedSeries} margin={{ top: 10, right: 150, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C2430" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }}
            interval="preserveStartEnd"
            axisLine={{ stroke: '#252D38' }}
            tickLine={false}
            label={{
              value: 'månader',
              position: 'insideBottom',
              offset: -12,
              fontSize: 10,
              fill: '#4E5C6A',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          />
          <YAxis
            tickFormatter={tickFormatter}
            tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }}
            domain={[0, Math.ceil(maxWords / 1000) * 1000]}
            width={40}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

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
            stroke="#ECA234"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#ECA234', stroke: '#0D1117', strokeWidth: 2 }}
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
              color: '#6E7A88',
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
