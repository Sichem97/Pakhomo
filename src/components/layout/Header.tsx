
import { useState } from 'react'
import {
  Building2,
  Menu,
  X,
} from 'lucide-react'

import MobileMenu from './MobileMenu'

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
          Pakhomo<span className="brand-light">africa</span>
        </span>
      </a>

      <MobileMenu
        isOpen={mobileMenu}
        onClose={closeMobileMenu}
        country={country}
        language={language}
        adminOpen={adminOpen}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onAdminToggle={onAdminToggle}
        t={t}
      />

      <div className="header-actions">
        <button
          type="button"
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
