
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'

import { sampleProperties } from './data/properties'
import { detectCountry } from './lib/country'
import { appwriteConfigured } from './lib/appwrite'
import {
  detectInitialLanguage,
  saveLanguage,
  translations,
  type Language,
} from './lib/i18n'
import type { CountryCode, Property, PropertyKind } from './types'

const countries: Record<
  CountryCode,
  { name: string; flag: string; currency: string; cities: string[] }
> = {
  MW: {
    name: 'Malawi',
    flag: '🇲🇼',
    currency: 'MWK',
    cities: ['All cities', 'Lilongwe', 'Blantyre', 'Mzuzu'],
  },
  CD: {
    name: 'DR Congo',
    flag: '🇨🇩',
    currency: 'USD',
    cities: ['All cities', 'Lubumbashi', 'Kinshasa', 'Kolwezi'],
  },
}

const kinds: Array<'All types' | PropertyKind> = [
  'All types',
  'House',
  'Apartment',
  'Land',
  'Shop',
  'Office',
  'Hotel',
]

type Translation = { [K in keyof typeof translations.en]: string }

function money(value: number, currency: Property['currency']) {
  return (
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value) +
    ' ' +
    currency
  )
}

function propertyTypeLabel(type: PropertyKind, t: Translation) {
  const labels: Record<PropertyKind, string> = {
    House: t.house,
    Apartment: t.apartment,
    Land: t.land,
    Shop: t.shop,
    Office: t.office,
    Hotel: t.hotel,
  }

  return labels[type]
}

export default function App() {
  const [country, setCountry] = useState<CountryCode>('MW')
  const [countryReady, setCountryReady] = useState(false)
  const [language, setLanguage] = useState<Language>(() =>
    detectInitialLanguage()
  )
  const [city, setCity] = useState('All cities')
  const [kind, setKind] = useState<'All types' | PropertyKind>('All types')
  const [listing, setListing] = useState<'All' | 'Rent' | 'Sale'>('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<string[]>([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCountryMenu, setShowCountryMenu] = useState(false)

  const t = translations[language] as Translation

  useEffect(() => {
    detectCountry().then((value) => {
      setCountry(value)
      setCountryReady(true)
    })
  }, [])

  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = language
  }, [language])

  const countryName =
    country === 'CD' && language === 'fr' ? 'RDC' : countries[country].name

  const visibleProperties = useMemo(
    () =>
      sampleProperties.filter(
        (p) =>
          p.countryCode === country &&
          (city === 'All cities' || p.city === city) &&
          (kind === 'All types' || p.type === kind) &&
          (listing === 'All' || p.listingType === listing) &&
          `${p.title} ${p.city} ${p.area} ${p.type}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [country, city, kind, listing, query]
  )

  const toggleSaved = (title: string) => {
    setSaved((current) =>
      current.includes(title)
        ? current.filter((x) => x !== title)
        : [...current, title]
    )
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">
            <Building2 size={21} />
          </span>
          <span>
            habitat<span className="brand-light">africa</span>
          </span>
        </a>

        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#discover" onClick={() => setMobileMenu(false)}>
            {t.discover}
          </a>
          <a href="#how" onClick={() => setMobileMenu(false)}>
            {t.howItWorks}
          </a>
          <a href="#list-property" onClick={() => setMobileMenu(false)}>
            {t.listProperty}
          </a>
        </nav>

        <div className="header-actions">
          <div className="language-switch">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label={t.language}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          <div className="country-wrap">
            <button
              className="country-button"
              onClick={() => setShowCountryMenu(!showCountryMenu)}
            >
              <span>{countries[country].flag}</span>
              <span>{countryName}</span>
              <ChevronDown size={15} />
            </button>

            {showCountryMenu && (
              <div className="country-menu">
                {(Object.keys(countries) as CountryCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCountry(code)
                      setCity('All cities')
                      setShowCountryMenu(false)
                    }}
                  >
                    {countries[code].flag}{' '}
                    {code === 'CD' && language === 'fr'
                      ? 'RDC'
                      : countries[code].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a className="list-button" href="#list-property">
            {t.listYourProperty} <ArrowRight size={15} />
          </a>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-image" />
          <div className="hero-shade" />

          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={14} /> {t.tagline}
            </div>

            <h1>
              {t.heroTitle}
              <br />
              <em>{t.heroTitleEmphasis}</em>
            </h1>

            <p>{t.heroDescription}</p>

            <a className="hero-link" href="#discover">
              {t.exploreProperties} <ArrowRight size={17} />
            </a>
          </div>

          <div className="hero-note">
            <span className="note-dot" /> {t.localTrusted}
          </div>
        </section>

        <section className="search-section" id="discover">
          <div className="section-heading">
            <div>
              <span className="overline">{t.nextChapter}</span>
              <h2>
                {t.exploreIn} {countryName}
              </h2>
            </div>

            <span className="detected">
              <span className="pulse" />
              {countryReady ? t.countryDetected : t.detectingCountry}
            </span>
          </div>

          <div className="search-panel">
            <div className="search-input">
              <Search size={19} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
              />
            </div>

            <div className="select-wrap">
              <MapPin size={17} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {countries[country].cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All cities' ? t.allCities : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-wrap">
              <SlidersHorizontal size={17} />
              <select
                value={kind}
                onChange={(e) =>
                  setKind(e.target.value as 'All types' | PropertyKind)
                }
              >
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k === 'All types'
                      ? t.allTypes
                      : propertyTypeLabel(k, t)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="search-button"
              onClick={() =>
                document
                  .getElementById('property-grid')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t.search} <ArrowRight size={16} />
            </button>
          </div>

          <div className="listing-toolbar">
            <div className="tabs">
              {(['All', 'Rent', 'Sale'] as const).map((tab) => (
                <button
                  key={tab}
                  className={listing === tab ? 'tab active' : 'tab'}
                  onClick={() => setListing(tab)}
                >
                  {tab === 'All'
                    ? t.allProperties
                    : tab === 'Rent'
                      ? t.forRent
                      : t.forSale}
                </button>
              ))}
            </div>

            <span className="result-count">
              {visibleProperties.length} {t.propertiesFound}
            </span>
          </div>

          <div className="property-grid" id="property-grid">
            {visibleProperties.map((property, index) => (
              <PropertyCard
                key={property.title}
                property={property}
                saved={saved.includes(property.title)}
                onSave={() => toggleSaved(property.title)}
                index={index}
                t={t}
              />
            ))}

            {visibleProperties.length === 0 && (
              <div className="empty-state">
                <Compass size={30} />
                <h3>{t.noProperties}</h3>
                <p>{t.noPropertiesDescription}</p>
                <button
                  onClick={() => {
                    setCity('All cities')
                    setKind('All types')
                    setListing('All')
                    setQuery('')
                  }}
                >
                  {t.clearFilters}
                </button>
              </div>
            )}
          </div>

          <div className="browse-note">
            <ShieldCheck size={18} />
            <span>{t.verifiedNotice}</span>
          </div>
        </section>

        <section className="trust-section" id="how">
          <div className="trust-copy">
            <span className="overline">{t.peaceOfMind}</span>
            <h2>{t.confidenceTitle}</h2>
            <p>{t.confidenceDescription}</p>
            <a href="#list-property">
              {t.verificationWorks} <ArrowRight size={16} />
            </a>
          </div>

          <div className="trust-points">
            <div className="trust-point">
              <span>
                <BadgeCheck />
              </span>
              <div>
                <h3>{t.reviewedOwners}</h3>
                <p>{t.reviewedOwnersDescription}</p>
              </div>
            </div>

            <div className="trust-point">
              <span>
                <Search />
              </span>
              <div>
                <h3>{t.localDiscovery}</h3>
                <p>{t.localDiscoveryDescription}</p>
              </div>
            </div>

            <div className="trust-point">
              <span>
                <Heart />
              </span>
              <div>
                <h3>{t.madeForLife}</h3>
                <p>{t.madeForLifeDescription}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="owner-cta" id="list-property">
          <div>
            <span className="overline">{t.haveProperty}</span>
            <h2>{t.ownerTitle}</h2>
            <p>{t.ownerDescription}</p>
          </div>

          <a href="mailto:hello@habitat-africa.example?subject=List%20my%20property">
            {t.registerInterest} <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">
          <span className="brand-mark">
            <Building2 size={20} />
          </span>
          <span>
            habitat<span className="brand-light">africa</span>
          </span>
        </a>

        <span>{t.footerDescription}</span>
        <span>© 2026 Habitat Africa</span>
      </footer>

      {!appwriteConfigured && (
        <div className="dev-ribbon">
          Preview data · Connect Appwrite to publish live listings
        </div>
      )}
    </div>
  )
}

function PropertyCard({
  property,
  saved,
  onSave,
  index,
  t,
}: {
  property: Property
  saved: boolean
  onSave: () => void
  index: number
  t: Translation
}) {
  return (
    <article
      className="property-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="property-photo">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
        />

        <span className="type-pill">
          {property.listingType === 'Rent' ? t.rent : t.sale}
        </span>

        <button
          className={saved ? 'save-button saved' : 'save-button'}
          onClick={onSave}
          aria-label="Save property"
        >
          <Heart
            size={17}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="property-info">
        <div className="property-location">
          <MapPin size={14} />
          {property.area}, {property.city}
        </div>

        <h3>{property.title}</h3>

        <div className="property-meta">
          <span>{propertyTypeLabel(property.type, t)}</span>

          {property.bedrooms && (
            <span>
              <BedDouble size={14} />
              {property.bedrooms} {t.beds}
            </span>
          )}

          {property.bathrooms && (
            <span>
              {property.bathrooms} {t.bathrooms}
            </span>
          )}
        </div>

        <div className="property-bottom">
          <strong>
            {money(property.price, property.currency)}
            <small>
              {property.listingType === 'Rent'
                ? ` ${t.month}`
                : ` ${t.askingPrice}`}
            </small>
          </strong>

          {property.verified && (
            <span className="verified">
              <BadgeCheck size={14} /> {t.verified}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
