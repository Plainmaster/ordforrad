/**
 * Vocabulary milestones based on L2 vocabulary research (Ordförråd hos vuxna immigranter).
 * Values are in word families (ordfamiljer).
 */
export const MILESTONES = [
  {
    id: 'sfi',
    label: 'SFI',
    sublabel: 'Nivå A1–B1',
    target: 2500,
    color: '#2F6664',
    bgColor: '#E8F0EF',
    description: 'Vardagskommunikation, täcker ~80% av dagligt tal',
    subcourses: [
      { label: 'Kurs A', target: 500, description: 'Grundläggande fraser och uttal' },
      { label: 'Kurs B', target: 1000, description: 'Vardaglig kommunikation' },
      { label: 'Kurs C', target: 1750, description: 'Samhällsorientering och arbete' },
      { label: 'Kurs D', target: 2500, description: 'Mer komplex kommunikation' },
    ],
  },
  {
    id: 'grundlaggande',
    label: 'Grundläggande svenska',
    sublabel: 'Nivå B1–B2',
    target: 5000,
    color: '#D4A373',
    bgColor: '#FAF5F0',
    description: 'Tidningstexter och diskussioner utanför vardagen',
    subcourses: [
      { label: 'Delkurs 1', target: 3000, description: 'Läsförståelse och enklare texter' },
      { label: 'Delkurs 2', target: 4000, description: 'Skriftlig produktion och diskussion' },
      { label: 'Delkurs 3', target: 5000, description: 'Komplexa texter och argumentation' },
    ],
  },
  {
    id: 'sva',
    label: 'SVA',
    sublabel: 'Gymnasienivå C1',
    target: 9000,
    color: '#6D6875',
    bgColor: '#F2EEF4',
    description: 'Akademiska texter, facktermer och abstrakta begrepp',
    subcourses: [
      { label: 'SVA 1', target: 6000, description: 'Gymnasiets grundnivå, faktatexter' },
      { label: 'SVA 2', target: 7500, description: 'Analytiskt skrivande och litteratur' },
      { label: 'SVA 3', target: 9000, description: 'Akademisk svenska och fackspråk' },
    ],
  },
]

/**
 * Maps a 0-10 grammar/reading self-assessment score to a multiplier for
 * INCIDENTAL vocabulary acquisition (from reading and class input).
 * Score 0 → 1.0x, Score 10 → 1.5x (up to 50% boost).
 *
 * Research basis: grammatical awareness and reading habits significantly amplify
 * how many new words a learner absorbs from exposure/context.
 */
function incidentalMultiplier(score) {
  return 1.0 + score * 0.05
}

/**
 * Maps a 0-10 grammar/reading score to a small boost for ACTIVE learning.
 * Score 0 → 1.0x, Score 10 → 1.1x (up to 10% boost).
 *
 * Rationale: grammar knowledge has a minor positive effect on retention even
 * during deliberate memorization (flashcards), but the main driver is the
 * learner's effort, not their meta-linguistic habits.
 */
function activeMultiplier(score) {
  return 1.0 + score * 0.01
}

/**
 * Calculates daily vocabulary gain from study hours per week.
 * 7 study hours/week (= 1 hour/day) yields ~1 incidental word per day.
 * Based on conservative estimates of incidental acquisition from reading/class input.
 */
function studyHoursBonus(hoursPerWeek) {
  return hoursPerWeek / 7
}

/**
 * Per-background multipliers for active and incidental vocabulary acquisition.
 *
 * Educational background primarily affects incidental learning (literacy transfer,
 * metalinguistic strategies). Active memorisation is less sensitive.
 * Baseline ('lag') = 1.0× so existing comparisons remain unaffected when no
 * background is specified.
 */
const BACKGROUND_MULTIPLIERS = {
  // Forskning visar ~800 aktiva / ~1 200 passiva ord efter 2 år — ca 45 % av baslinjen.
  // Äldre inlärare utan litteracitet behöver fler repetitioner och kunskaper fäster långsammare.
  ingen: { active: 0.45, incidental: 0.35 },
  lag:   { active: 1.0,  incidental: 1.0  },
  hog:   { active: 1.1,  incidental: 1.3  },
}

/**
 * Calculates the effective daily vocabulary gain from all metrics.
 *
 * Formula:
 *   gain = wordsPerDay × activeMultiplier(grammarScore) × bgActive
 *        + studyHoursBonus(studyHours) × incidentalMultiplier(grammarScore) × bgIncidental
 *
 * Grammar/reading habits primarily amplify incidental acquisition (what you pick up
 * from class and reading), and only marginally boost active memorization.
 * Educational background (background) scales both channels based on literacy transfer
 * and metalinguistic strategies.
 *
 * @param {object} metrics
 * @param {number} metrics.wordsPerDay       - Words actively memorized per day (flashcards etc.)
 * @param {number} metrics.studyHours        - Class/self-study/reading hours per week
 * @param {number} metrics.grammarScore      - 0–10 grammar & reading habits self-assessment
 * @param {string} [metrics.background='lag'] - 'ingen' | 'lag' | 'hog'
 * @returns {number} Effective words gained per day
 */
export function dailyGain({ wordsPerDay, studyHours, grammarScore, background = 'lag' }) {
  const bg = BACKGROUND_MULTIPLIERS[background] ?? BACKGROUND_MULTIPLIERS.lag
  const activePart = wordsPerDay * activeMultiplier(grammarScore) * bg.active
  const incidentalPart = studyHoursBonus(studyHours) * incidentalMultiplier(grammarScore) * bg.incidental
  return activePart + incidentalPart
}

/**
 * Generates a time-series data array for the progress chart.
 * Returns one data point per month for up to maxMonths months.
 *
 * @param {object} metrics
 * @param {number} metrics.currentVocab
 * @param {number} metrics.wordsPerDay
 * @param {number} metrics.studyHours
 * @param {number} metrics.grammarScore
 * @param {number} maxMonths - How many months to project (default: auto based on SVA target)
 * @returns {Array<{month: number, words: number, label: string}>}
 */
export function generateProgressSeries(metrics, maxMonths) {
  const { currentVocab } = metrics
  const gain = dailyGain(metrics)
  const svaMilestone = MILESTONES[MILESTONES.length - 1]

  if (gain <= 0) return []

  const monthsToSVA = Math.ceil((svaMilestone.target - currentVocab) / (gain * 30))
  const totalMonths = maxMonths ?? Math.max(monthsToSVA + 6, 12)

  const series = []
  for (let m = 0; m <= totalMonths; m++) {
    const words = Math.round(currentVocab + gain * 30 * m)
    const label =
      m === 0
        ? 'Nu'
        : m % 12 === 0
        ? `År ${m / 12}`
        : `M${m}`
    series.push({ month: m, words, label })
  }
  return series
}

/**
 * Calculates estimated months to reach each milestone from current state.
 *
 * @param {object} metrics
 * @returns {Array<{milestone, months: number|null, date: string|null}>}
 */
export function estimateMilestones(metrics) {
  const { currentVocab } = metrics
  const gain = dailyGain(metrics)

  return MILESTONES.map((milestone) => {
    if (currentVocab >= milestone.target) {
      return { milestone, months: 0, alreadyReached: true }
    }
    if (gain <= 0) {
      return { milestone, months: null, alreadyReached: false }
    }
    const days = (milestone.target - currentVocab) / gain
    const months = days / 30
    return { milestone, months: Math.ceil(months), alreadyReached: false }
  })
}

/**
 * Formats a month count as a human-readable string in Swedish.
 */
export function formatDuration(months) {
  if (months === 0) return 'Redan nådd'
  if (months === null) return 'Okänt'
  if (months < 1) return 'Under 1 månad'
  if (months < 12) return `${months} månad${months === 1 ? '' : 'er'}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (rem === 0) return `${years} år`
  return `${years} år och ${rem} månad${rem === 1 ? '' : 'er'}`
}
