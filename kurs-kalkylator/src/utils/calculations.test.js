import { describe, it, expect } from 'vitest'
import { formatDuration, xAxisTickFormatter } from './calculations'

describe('formatDuration', () => {
  it('returns "Redan nådd" for 0', () => {
    expect(formatDuration(0)).toBe('Redan nådd')
  })
  it('returns "Okänt" for null', () => {
    expect(formatDuration(null)).toBe('Okänt')
  })
  it('returns "Under 1 månad" for <1', () => {
    expect(formatDuration(0.5)).toBe('Under 1 månad')
  })
  it('returns singular month', () => {
    expect(formatDuration(1)).toBe('1 månad')
  })
  it('returns plural months', () => {
    expect(formatDuration(11)).toBe('11 månader')
  })
  it('returns compact "X år" for exact years', () => {
    expect(formatDuration(12)).toBe('1 år')
    expect(formatDuration(24)).toBe('2 år')
  })
  it('returns compact "X år Y mån" not "X år och Y månader"', () => {
    expect(formatDuration(13)).toBe('1 år 1 mån')
    expect(formatDuration(14)).toBe('1 år 2 mån')
    expect(formatDuration(38)).toBe('3 år 2 mån')
  })
})

describe('xAxisTickFormatter', () => {
  it('month 0 → "Nu"', () => {
    expect(xAxisTickFormatter(0)).toBe('Nu')
  })
  it('month 12 → "År 1"', () => {
    expect(xAxisTickFormatter(12)).toBe('År 1')
  })
  it('month 24 → "År 2"', () => {
    expect(xAxisTickFormatter(24)).toBe('År 2')
  })
  it('month 6 → "6 mån"', () => {
    expect(xAxisTickFormatter(6)).toBe('6 mån')
  })
  it('month 18 → "1å 6m"', () => {
    expect(xAxisTickFormatter(18)).toBe('1å 6m')
  })
  it('month 30 → "2å 6m"', () => {
    expect(xAxisTickFormatter(30)).toBe('2å 6m')
  })
  it('month 1 → empty string', () => {
    expect(xAxisTickFormatter(1)).toBe('')
  })
  it('month 7 → empty string', () => {
    expect(xAxisTickFormatter(7)).toBe('')
  })
})
