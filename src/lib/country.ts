import type { CountryCode } from '../types'

// IP-based country lookup. The visitor can always override the detected country.
// For production, proxy this request through a server function to avoid exposing
// a third-party dependency directly in the browser.
export async function detectCountry(): Promise<CountryCode> {
  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4500) })
    if (!response.ok) throw new Error('Country lookup failed')
    const data: { country_code?: string } = await response.json()
    return data.country_code === 'CD' ? 'CD' : 'MW'
  } catch {
    const language = navigator.language.toLowerCase()
    return language.endsWith('-cd') ? 'CD' : 'MW'
  }
}
