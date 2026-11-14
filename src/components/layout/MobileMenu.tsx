
import { useState } from 'react'
import { ChevronDown, LayoutDashboard, Globe } from 'lucide-react'

import type { CountryCode } from '../../types'
import type { Language } from '../../lib/i18n'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  country: CountryCode
  language: Language
  adminOpen: boolean
  onCountryChange: (country: CountryCode) => void
  onLanguageChange: (language: Language) => void
  onAdminToggle: () => void
  t: {
    discover: string
    howItWorks: string
    listProperty: string
    language: string
  }
}

const countries: Record<CountryCode, {
  name: string
  flag: string
}> = {
  MW: { name: 'Malawi', flag: '🇲🇼' },
  CD: { name: 'DR Congo', flag: '🇨🇩' },
}

export default function MobileMenu({
  isOpen,
  onClose,
  country,
  language,
  adminOpen,
  onCountryChange,
  onLanguageChange,
  onAdminToggle,
  t,
}: MobileMenuProps) {
  const [showCountries, setShowCountries] = useState(false)

  return (
    <nav className={isOpen ? 'nav nav-open' : 'nav'}>

      <div className="menu-settings">

        <div className="menu-setting">
          <span><Globe size={16} /> Country</span>

          <button
            type="button"
            className="menu-country-button"
            onClick={() => setShowCountries(!showCountries)}
          >
            {countries[country].flag} {country === 'CD' && language === 'fr' ? 'RDC' : countries[country].name}
            <ChevronDown size={15} />
          </button>

          {showCountries && (
            <div className="menu-country-options">
              {(Object.keys(countries) as CountryCode[]).map(code => (
                <button
                  type="button"
                  key={code}
                  onClick={() => {
                    onCountryChange(code)
                    setShowCountries(false)
                  }}
                >
                  {countries[code].flag} {countries[code].name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="menu-setting">
          <span>{t.language}</span>

          <select
            value={language}
            onChange={event =>
              onLanguageChange(event.target.value as Language)
            }
            aria-label={t.language}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

      </div>

      <a href="#discover" onClick={onClose}>
        {t.discover}
      </a>

      <a href="#trending" onClick={onClose}>
        Trending
      </a>

      <a href="#how" onClick={onClose}>
        {t.howItWorks}
      </a>

      <a href="#list-property" onClick={onClose}>
        {t.listProperty}
      </a>

      <button
        type="button"
        className="menu-admin-button"
        onClick={() => {
          onAdminToggle()
          onClose()
        }}
      >
        <LayoutDashboard size={17} />
        {adminOpen ? 'Website' : 'Admin'}
      </button>

    </nav>
  )
}
