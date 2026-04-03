import React, { useState } from 'react'
import {
  BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'

const BACKGROUNDS = {
  ingen: {
    label: 'Ingen formell skolgång',
    sublabel: '0–5 år',
    active: 800,
    passive: 1200,
    text: 'Elever utan formell skolgång är ofta äldre och bygger upp läs- och skrivförmågan parallellt med språkinlärningen. Inlärningsbanan är lång och ojämn — en stor andel fullföljer inte SFI. De som fortsätter behöver repetera grundläggande strukturer gång på gång, men kunskaperna fäster ändå långsamt. Ordförrådet stannar länge på en konkret, situationsbunden nivå och abstrakta eller skriftspråkliga ord är svåra att tillägna sig.',
  },
  lag: {
    label: 'Grundläggande skolgång',
    sublabel: '6–9 år',
    active: 1800,
    passive: 3500,
    text: 'Inlärare med grundläggande skolgång har viss studievana och litteracitet, vilket möjliggör en snabbare start. De drar nytta av texter på lektionerna men överför sällan läsandet till fritiden utan direkt styrning. Deras passiva ordförråd växer om det aktiva, men de har ofta svårt att ta steget till avancerad nivå utan explicit undervisning i strategier.',
  },
  hog: {
    label: 'Gymnasie- eller högskoleutbildning',
    sublabel: '10+ år',
    active: 3500,
    passive: 8500,
    text: 'Studievana elever med gymnasie- eller högskoleutbildning har starka metalingvistiska strategier. De letar medvetet efter mönster, använder lexikon effektivt och drar nytta av internationella ord. Detta resulterar i en explosion av det passiva ordförrådet redan tidigt i inlärningen. Klyftan mellan det enorma passiva förrådet och den mer begränsade aktiva produktionen kan skapa frustration till en början.',
  },
}

const MILESTONE_BARS = [
  { name: 'SFI', ord: 2500, fill: '#2CC9A0' },
  { name: 'Grundläggande', ord: 5000, fill: '#E0855A' },
  { name: 'SVA', ord: 9000, fill: '#9B88D1' },
]

const READING_DATA = [
  { ar: 'År 1', laser: 2500, intelaser: 2000 },
  { ar: 'År 2', laser: 4800, intelaser: 2800 },
  { ar: 'År 3', laser: 7500, intelaser: 3200 },
  { ar: 'År 4', laser: 10200, intelaser: 3400 },
  { ar: 'År 5', laser: 12500, intelaser: 3500 },
]

function DarkTooltip({ active, payload, label, unit = 'ordfamiljer' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: '#1E2632', border: '1px solid #2E3947', borderRadius: '8px', padding: '10px 14px', fontSize: '0.8125rem', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p style={{ color: '#9AA6B4', marginBottom: '6px', fontWeight: 500 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || '#ECA234', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
          {p.name}: {p.value?.toLocaleString('sv')} {unit}
        </p>
      ))}
    </div>
  )
}

function SectionCard({ id, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: '56px' }}>
      <div style={{ backgroundColor: '#161C24', border: '1px solid #252D38', borderRadius: '16px', padding: '40px' }}>
        {children}
      </div>
    </section>
  )
}

function SectionTag({ children }) {
  return (
    <div style={{ display: 'inline-block', padding: '4px 12px', marginBottom: '16px', fontSize: '0.6875rem', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ECA234', backgroundColor: 'rgba(236,162,52,0.08)', border: '1px solid rgba(236,162,52,0.2)', borderRadius: '3px' }}>
      {children}
    </div>
  )
}

export default function ResearchPage() {
  const [bgKey, setBgKey] = useState('ingen')
  const bg = BACKGROUNDS[bgKey]

  const bgBarData = [
    { name: 'Aktivt ordförråd', ord: bg.active, fill: '#ECA234' },
    { name: 'Passivt ordförråd', ord: bg.passive, fill: '#4E5C6A' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 space-y-10">

      {/* Hero */}
      <header className="max-w-3xl mx-auto pt-14 pb-8 text-center">
        <SectionTag>Forskningsöversikt</SectionTag>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#F0EDE8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '20px' }}>
          Vuxna andraspråksinlärares ordförråd
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#8A96A6', fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>
          Att bygga upp ett adekvat ordförråd på ett nytt språk i vuxen ålder är en komplex process. Forskning visar att inlärarens skolbakgrund, läsvanor och förståelsen för skillnaden mellan aktivt och passivt ordförråd är direkt avgörande för förmågan att klara det svenska utbildningssystemet.
        </p>
      </header>

      {/* Section 1 – Krav */}
      <SectionCard id="krav">
        <SectionTag>Avsnitt 1</SectionTag>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#F0EDE8', marginBottom: '8px' }}>Vilket ordförråd krävs?</h2>
        <p style={{ fontSize: '0.875rem', color: '#6E7A88', marginBottom: '32px', maxWidth: '560px' }}>
          Ett "ord" definieras som en <em>ordfamilj</em> — t.ex. räknas hoppa, hoppade och hoppning som en enhet. Modersmålstalare har som referens över 50 000 ord.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={MILESTONE_BARS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2430" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9AA6B4', fontFamily: "'IBM Plex Sans', sans-serif" }} axisLine={{ stroke: '#252D38' }} tickLine={false} />
                <YAxis tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<DarkTooltip unit="ord" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="ord" name="Ordfamiljer" radius={[6, 6, 0, 0]}>
                  {MILESTONE_BARS.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Workaround: use separate bars with Cell */}
          </div>

          <div className="space-y-4">
            {[
              { color: '#2CC9A0', label: 'SFI (A1–B1)', range: '2 000 – 3 000', desc: 'Kräver ca 2 500 basord för att klara vardagskommunikation. Dessa ord täcker upp till 80% av de ord som används i dagligt tal.' },
              { color: '#E0855A', label: 'Grundläggande (B1–B2)', range: '4 000 – 5 000', desc: 'Nödvändigt för att förstå enklare tidningstexter och delta i diskussioner utanför den omedelbara vardagen.' },
              { color: '#9B88D1', label: 'SVA (Gymnasienivå C1)', range: '8 000 – 10 000', desc: 'Avancerade facktermer, abstrakta begrepp och nyansord krävs för gymnasiala studier och akademiska texter.' },
            ].map((m) => (
              <div key={m.label} style={{ padding: '16px', borderRadius: '10px', borderLeft: `3px solid ${m.color}`, backgroundColor: `${m.color}0D` }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: m.color, fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: '4px' }}>{m.label}</h3>
                <p style={{ fontSize: '0.6875rem', fontFamily: "'IBM Plex Mono', monospace", color: m.color, opacity: 0.7, marginBottom: '6px' }}>{m.range} ordfamiljer</p>
                <p style={{ fontSize: '0.8125rem', color: '#8A96A6', lineHeight: 1.55 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Section 2 – Skolbakgrund */}
      <SectionCard id="bakgrund">
        <SectionTag>Avsnitt 2</SectionTag>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#F0EDE8', marginBottom: '8px' }}>Skolbakgrundens betydelse</h2>
        <p style={{ fontSize: '0.875rem', color: '#6E7A88', marginBottom: '28px', maxWidth: '560px' }}>
          Hur påverkar tidigare studiebakgrund det <strong style={{ color: '#EDE9E3' }}>aktiva</strong> (ord man kan använda) och det <strong style={{ color: '#EDE9E3' }}>passiva</strong> (ord man förstår) ordförrådet efter ca 2 års studier?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            {Object.entries(BACKGROUNDS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setBgKey(key)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: `1px solid ${bgKey === key ? 'rgba(236,162,52,0.4)' : '#252D38'}`,
                  backgroundColor: bgKey === key ? 'rgba(236,162,52,0.08)' : 'transparent',
                  color: bgKey === key ? '#ECA234' : '#9AA6B4',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{val.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: bgKey === key ? '#ECA234' : '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }}>{val.sublabel}</span>
              </button>
            ))}

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#0D1117', border: '1px solid #252D38', fontSize: '0.8125rem', lineHeight: 1.65, color: '#8A96A6', marginTop: '8px' }}>
              {bg.text}
            </div>
          </div>

          <div className="lg:col-span-7">
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6E7A88', marginBottom: '16px' }}>
              Ordförrådsstorlek efter ca 2 års språkvistelse — <strong style={{ color: '#EDE9E3' }}>{bg.label}</strong>
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: bg.label, aktivt: bg.active, passivt: bg.passive }]} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2430" />
                <XAxis dataKey="name" tick={false} axisLine={{ stroke: '#252D38' }} tickLine={false} />
                <YAxis domain={[0, 10000]} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<DarkTooltip unit="ord" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <ReferenceLine y={2500} stroke="#2CC9A0" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'SFI', position: 'insideTopRight', fontSize: 10, fill: '#2CC9A0', fontFamily: "'IBM Plex Mono', monospace" }} />
                <ReferenceLine y={5000} stroke="#E0855A" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Grundl.', position: 'insideTopRight', fontSize: 10, fill: '#E0855A', fontFamily: "'IBM Plex Mono', monospace" }} />
                <Bar dataKey="aktivt" name="Aktivt ordförråd" fill="#ECA234" radius={[6, 6, 0, 0]} />
                <Bar dataKey="passivt" name="Passivt ordförråd" fill="#2E3947" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '12px' }}>
              {[['#ECA234', 'Aktivt (Produktivt)'], ['#2E3947', 'Passivt (Receptivt)']].map(([c, l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#6E7A88' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c, display: 'inline-block' }} />
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 3 – Läsning */}
      <SectionCard id="lasning">
        <SectionTag>Avsnitt 3</SectionTag>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#F0EDE8', marginBottom: '16px' }}>Läsningens avgörande kraft</h2>
            <p style={{ fontSize: '0.875rem', color: '#8A96A6', lineHeight: 1.7, marginBottom: '14px' }}>
              Fritidsläsning av böcker och längre texter är den enskilt viktigaste faktorn för att nå avancerad språknivå. Muntlig kommunikation i vardagen använder sällan mer än 3 000 unika ord.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#8A96A6', lineHeight: 1.7, marginBottom: '24px' }}>
              För elever som enbart förlitar sig på talat språk avstannar ordförrådsutvecklingen ofta på en platå. De som läser regelbundet exponeras för lågfrekventa ord, abstrakta begrepp och idiomatiska uttryck.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Den lexikala platån', desc: 'Utan läsning stagnerar förrådet ofta kring B1-nivå (~3 500 ord).' },
                { title: 'Abstraktionsnivån', desc: 'Böcker innehåller 2–3 gånger fler sällsynta ord än tv-program eller samtal mellan vänner.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(236,162,52,0.05)', border: '1px solid rgba(236,162,52,0.12)' }}>
                  <div style={{ width: '3px', borderRadius: '9999px', backgroundColor: '#ECA234', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#EDE9E3', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8125rem', color: '#6E7A88', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6E7A88', marginBottom: '16px' }}>Ordförrådets tillväxt över tid</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={READING_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2430" />
                <XAxis dataKey="ar" tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }} axisLine={{ stroke: '#252D38' }} tickLine={false} />
                <YAxis tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 11, fill: '#4E5C6A', fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", color: '#6E7A88', paddingTop: '12px' }} />
                <Line type="monotone" dataKey="laser" name="Läser regelbundet" stroke="#ECA234" strokeWidth={2.5} dot={{ fill: '#ECA234', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="intelaser" name="Läser inte böcker" stroke="#4E5C6A" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#4E5C6A', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SectionCard>

      {/* Footer note */}
      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#4E5C6A', lineHeight: 1.65, maxWidth: '600px', margin: '0 auto' }}>
        Denna sammanfattning är en syntes av vedertagen forskning inom andraspråksinlärning (Nation, Hyltenstam, Lindell) gällande ordförrådets storlek, djup och inlärningsfaktorer hos vuxna L2-inlärare.
      </p>
    </div>
  )
}
