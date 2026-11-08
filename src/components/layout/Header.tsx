
import { useState } from 'react'
import {
  Building2,
  ChevronRight,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'

import type { CountryCode } from '../../types'
import type { Language } from '../../lib/i18n'

interface HeaderProps {
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
  MW: {
    name: 'Malawi',
    flag: '🇲🇼',
  },
  CD: {
    name: 'DR Congo',
    flag: '🇨🇩',
  },
}

export default function Header({
  country,
  language,
  adminOpen,
  onCountryChange,
  onLanguageChange,
  onAdminToggle,
  t,
}: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCountryMenu, setShowCountryMenu] = useState(false)

  const countryName =
    country === 'CD' && language === 'fr'
      ? 'RDC'
      : countries[country].name

  function closeMobileMenu() {
    setMobileMenu(false)
  }

  return (
    <header className="topbar">
      <a
        className="brand"
        href="#"
        onClick={closeMobileMenu}
      >
        <span className="brand-mark">
          <Building2 size={21} />
        </span>

        <span>
          habitat<span className="brand-light">africa</span>
        </span>
      </a>

      <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
        <a
          href="#discover"
          onClick={closeMobileMenu}
        >
          {t.discover}
        </a>

        <a
          href="#trending"
          onClick={closeMobileMenu}
        >
          Trending
        </a>

        <a
          href="#how"
          onClick={closeMobileMenu}
        >
          {t.howItWorks}
        </a>

        <a
          href="#list-property"
          onClick={closeMobileMenu}
        >
          {t.listProperty}
        </a>
      </nav>

      <div className="header-actions">
        <div className="language-switch">
          <select
            value={language}
            onChange={event =>
              onLanguageChange(event.target.value as Language)
            }
            aria-label={t.language}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>

        <div className="country-wrap">
          <button
            className="country-button"
            onClick={() =>
              setShowCountryMenu(current => !current)
            }
            aria-expanded={showCountryMenu}
          >
            <span>{countries[country].flag}</span>
            <span>{countryName}</span>
            <ChevronRight size={15} />
          </button>

          {showCountryMenu && (
            <div className="country-menu">
              {(Object.keys(countries) as CountryCode[]).map(code => (
                <button
                  key={code}
                  onClick={() => {
                    onCountryChange(code)
                    setShowCountryMenu(false)
                  }}
                >
                  {countries[code].flag} {countries[code].name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="admin-header-button"
          onClick={onAdminToggle}
        >
          <LayoutDashboard size={16} />
          {adminOpen ? 'Website' : 'Admin'}
        </button>

        <button
          className="mobile-toggle"
          onClick={() =>
            setMobileMenu(current => !current)
          }
          aria-label="Toggle menu"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
