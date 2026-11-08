
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BadgeCheck, BedDouble, Building2, ChevronLeft,
  ChevronRight, Compass, Heart, LayoutDashboard, MapPin, Menu,
  Search, ShieldCheck, SlidersHorizontal, Sparkles, Trash2,
  CheckCircle, XCircle, X, Home, TrendingUp, Eye
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

type Status = 'pending' | 'published' | 'rejected'

const countries: Record<CountryCode, {
  name: string
  flag: string
  currency: string
  cities: string[]
}> = {
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
  'All types', 'House', 'Apartment', 'Land', 'Shop', 'Office', 'Hotel'
]

type Translation = { [K in keyof typeof translations.en]: string }

function money(value: number, currency: Property['currency']) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value) + ' ' + currency
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
  const [language, setLanguage] = useState<Language>(() => detectInitialLanguage())
  const [city, setCity] = useState('All cities')
  const [kind, setKind] = useState<'All types' | PropertyKind>('All types')
  const [listing, setListing] = useState<'All' | 'Rent' | 'Sale'>('All')
  const [query, setQuery] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCountryMenu, setShowCountryMenu] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  // Temporary demonstration data.
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(
      sampleProperties.map(p => [p.title, p.verified ? 'published' : 'pending'])
    )
  )

  const [likes, setLikes] = useState<Record<string, number>>({
    'Modern family house in Lilongwe': 18,
    'Beautiful apartment in Blantyre': 12,
    'Residential plot in Mzuzu': 5,
    'Modern house in Lubumbashi': 30,
    'Apartment in Kinshasa': 24,
    'Commercial land in Kolwezi': 8,
  })

  const [liked, setLiked] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [notifications, setNotifications] = useState<string[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [adminFilter, setAdminFilter] = useState<'pending' | 'published' | 'rejected'>('pending')
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const t = translations[language] as Translation

  useEffect(() => {
    detectCountry().then(value => {
      setCountry(value)
      setCountryReady(true)
    })
  }, [])

  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = language
  }, [language])

  const publishedProperties = useMemo(
    () => sampleProperties.filter(p => statuses[p.title] === 'published'),
    [statuses]
  )

  const averageLikes = publishedProperties.length
    ? publishedProperties.reduce((sum, p) => sum + (likes[p.title] || 0), 0) /
      publishedProperties.length
    : 0

  const trendingProperties = publishedProperties
    .filter(p => (likes[p.title] || 0) >= averageLikes * 1.5 && averageLikes > 0)
    .sort((a, b) => (likes[b.title] || 0) - (likes[a.title] || 0))

  useEffect(() => {
    if (trendingProperties.length < 2) {
      setActiveSlide(0)
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % trendingProperties.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [trendingProperties.length])

  useEffect(() => {
    if (activeSlide >= trendingProperties.length) setActiveSlide(0)
  }, [activeSlide, trendingProperties.length])

  const visibleProperties = publishedProperties.filter(
    p =>
      p.countryCode === country &&
      (city === 'All cities' || p.city === city) &&
      (kind === 'All types' || p.type === kind) &&
      (listing === 'All' || p.listingType === listing) &&
      `${p.title} ${p.city} ${p.area} ${p.type}`
        .toLowerCase().includes(query.toLowerCase())
  )

  const countryName =
    country === 'CD' && language === 'fr' ? 'RDC' : countries[country].name

  const pendingCount = Object.values(statuses).filter(s => s === 'pending').length
  const publishedCount = Object.values(statuses).filter(s => s === 'published').length
  const rejectedCount = Object.values(statuses).filter(s => s === 'rejected').length

  function updateStatus(title: string, status: Status, message: string) {
    setStatuses(current => ({ ...current, [title]: status }))
    setNotifications(current => [
      `${title}: ${message}`,
      ...current,
    ])
    setRejecting(null)
    setRejectReason('')
  }

  function toggleLike(title: string) {
    const alreadyLiked = liked.includes(title)

    setLiked(current =>
      alreadyLiked
        ? current.filter(item => item !== title)
        : [...current, title]
    )

    setLikes(current => ({
      ...current,
      [title]: Math.max(0, (current[title] || 0) + (alreadyLiked ? -1 : 1)),
    }))
  }

  function resetFilters() {
    setCity('All cities')
    setKind('All types')
    setListing('All')
    setQuery('')
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setAdminOpen(false)}>
          <span className="brand-mark"><Building2 size={21} /></span>
          <span>habitat<span className="brand-light">africa</span></span>
        </a>

        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#discover" onClick={() => {
            setAdminOpen(false)
            setMobileMenu(false)
          }}>{t.discover}</a>
          <a href="#trending" onClick={() => setMobileMenu(false)}>
            Trending
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
              onChange={e => setLanguage(e.target.value as Language)}
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
              <ChevronRight size={15} />
            </button>

            {showCountryMenu && (
              <div className="country-menu">
                {(Object.keys(countries) as CountryCode[]).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setCountry(code)
                      setCity('All cities')
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
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <LayoutDashboard size={16} />
            {adminOpen ? 'Website' : 'Admin'}
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {adminOpen ? (
        <main className="admin-page">
          <div className="admin-heading">
            <div>
              <span className="overline">HABITAT AFRICA CONTROL CENTRE</span>
              <h1>Admin dashboard</h1>
              <p>Review property submissions and manage marketplace listings.</p>
            </div>
            <span className="admin-preview-label">Demo mode</span>
          </div>

          <div className="admin-stats">
            <button onClick={() => setAdminFilter('pending')}>
              <span className="stat-icon pending-icon"><Eye /></span>
              <span><strong>{pendingCount}</strong><small>Pending review</small></span>
            </button>
            <button onClick={() => setAdminFilter('published')}>
              <span className="stat-icon published-icon"><CheckCircle /></span>
              <span><strong>{publishedCount}</strong><small>Published</small></span>
            </button>
            <button onClick={() => setAdminFilter('rejected')}>
              <span className="stat-icon rejected-icon"><XCircle /></span>
              <span><strong>{rejectedCount}</strong><small>Rejected</small></span>
            </button>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Property management</h2>
                <p>Review and manage submitted properties.</p>
              </div>
              <select
                value={adminFilter}
                onChange={e => setAdminFilter(e.target.value as typeof adminFilter)}
              >
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="admin-property-list">
              {sampleProperties
                .filter(p => statuses[p.title] === adminFilter)
                .map(property => (
                  <article className="admin-property" key={property.title}>
                    <img src={property.imageUrl} alt={property.title} />
                    <div className="admin-property-details">
                      <span className="admin-location">
                        {property.area}, {property.city}
                      </span>
                      <h3>{property.title}</h3>
                      <p>
                        {propertyTypeLabel(property.type, t)} · {property.listingType}
                      </p>
                      <strong>{money(property.price, property.currency)}</strong>
                      <span className={`status-label status-${statuses[property.title]}`}>
                        {statuses[property.title]}
                      </span>

                      {feedback[property.title] && (
                        <p className="admin-feedback">
                          Previous feedback: {feedback[property.title]}
                        </p>
                      )}

                      <div className="admin-actions">
                        {adminFilter !== 'published' && (
                          <button
                            className="approve-button"
                            onClick={() => {
                              setFeedback(current => ({
                                ...current,
                                [property.title]: 'Your property has been approved and published.',
                              }))
                              updateStatus(
                                property.title,
                                'published',
                                'Your property was approved and published.'
                              )
                            }}
                          >
                            <CheckCircle size={15} /> Approve
                          </button>
                        )}

                        {adminFilter !== 'rejected' && (
                          <button
                            className="reject-button"
                            onClick={() => {
                              setRejecting(property.title)
                              setRejectReason('')
                            }}
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        )}

                        <button
                          className="delete-button"
                          onClick={() => {
                            if (window.confirm('Delete this property from the demo?')) {
                              updateStatus(
                                property.title,
                                'rejected',
                                'The listing was removed by the administrator.'
                              )
                            }
                          }}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>

                      {rejecting === property.title && (
                        <div className="reject-form">
                          <label>Reason for rejection</label>
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Explain what the owner needs to correct..."
                          />
                          <div>
                            <button
                              className="reject-button"
                              disabled={!rejectReason.trim()}
                              onClick={() => {
                                setFeedback(current => ({
                                  ...current,
                                  [property.title]: rejectReason,
                                }))
                                updateStatus(
                                  property.title,
                                  'rejected',
                                  `Your property was rejected: ${rejectReason}`
                                )
                              }}
                            >
                              Send feedback and reject
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => setRejecting(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}

              {sampleProperties.filter(p => statuses[p.title] === adminFilter).length === 0 && (
                <div className="admin-empty">
                  <CheckCircle size={30} />
                  <h3>No properties in this category</h3>
                  <p>There are currently no listings to display here.</p>
                </div>
              )}
            </div>
          </section>

          <section className="admin-panel notification-panel">
            <h2>Recent owner feedback</h2>
            <p>Demo activity generated by your admin actions.</p>
            {notifications.length === 0 ? (
              <p className="muted-text">No feedback activity yet.</p>
            ) : (
              notifications.map((note, index) => (
                <div className="notification-item" key={`${note}-${index}`}>
                  <BadgeCheck size={17} />
                  <span>{note}</span>
                </div>
              ))
            )}
          </section>

          <p className="admin-security-note">
            <ShieldCheck size={17} />
            This is a visual demonstration. Real admin authentication and secure
            permissions will be added when we connect Appwrite.
          </p>
        </main>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-image" />
            <div className="hero-shade" />
            <div className="hero-content">
              <div className="eyebrow">
                <Sparkles size={14} /> {t.tagline}
              </div>
              <h1>{t.heroTitle}<br /><em>{t.heroTitleEmphasis}</em></h1>
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
                <h2>{t.exploreIn} {countryName}</h2>
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
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                />
              </div>

              <div className="select-wrap">
                <MapPin size={17} />
                <select value={city} onChange={e => setCity(e.target.value)}>
                  {countries[country].cities.map(c => (
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
                  onChange={e => setKind(e.target.value as 'All types' | PropertyKind)}
                >
                  {kinds.map(k => (
                    <option key={k} value={k}>
                      {k === 'All types' ? t.allTypes : propertyTypeLabel(k, t)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="search-button"
                onClick={() => document.getElementById('property-grid')?.scrollIntoView({
                  behavior: 'smooth',
                })}
              >
                {t.search} <ArrowRight size={16} />
              </button>
            </div>

            <div className="listing-toolbar">
              <div className="tabs">
                {(['All', 'Rent', 'Sale'] as const).map(tab => (
                  <button
                    key={tab}
                    className={listing === tab ? 'tab active' : 'tab'}
                    onClick={() => setListing(tab)}
                  >
                    {tab === 'All' ? t.allProperties : tab === 'Rent' ? t.forRent : t.forSale}
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
                  likes={likes[property.title] || 0}
                  liked={liked.includes(property.title)}
                  onLike={() => toggleLike(property.title)}
                  index={index}
                  t={t}
                />
              ))}

              {visibleProperties.length === 0 && (
                <div className="empty-state">
                  <Compass size={30} />
                  <h3>{t.noProperties}</h3>
                  <p>{t.noPropertiesDescription}</p>
                  <button onClick={resetFilters}>{t.clearFilters}</button>
                </div>
              )}
            </div>

            <div className="browse-note">
              <ShieldCheck size={18} />
              <span>{t.verifiedNotice}</span>
            </div>
          </section>

          <section className="trending-section" id="trending">
            <div className="trending-heading">
              <div>
                <span className="overline">POPULAR ON HABITAT AFRICA</span>
                <h2><TrendingUp size={25} /> Trending properties</h2>
                <p>Properties receiving at least 50% more likes than the published-listing average.</p>
              </div>
              <span className="trending-count">
                {trendingProperties.length} trending
              </span>
            </div>

            {trendingProperties.length > 0 ? (
              <div className="trending-slider">
                {trendingProperties.map((property, index) => (
                  <article
                    key={property.title}
                    className={`trending-slide ${index === activeSlide ? 'slide-active' : ''}`}
                    aria-hidden={index !== activeSlide}
                  >
                    <img src={property.imageUrl} alt={property.title} />
                    <div className="trending-overlay" />
                    <div className="trending-content">
                      <span className="trending-tag">
                        <TrendingUp size={14} /> TRENDING PROPERTY
                      </span>
                      <span className="trending-place">
                        <MapPin size={14} /> {property.area}, {property.city}
                      </span>
                      <h3>{property.title}</h3>
                      <p>{money(property.price, property.currency)} · {property.listingType}</p>
                      <span className="trending-likes">
                        <Heart size={16} fill="currentColor" />
                        {likes[property.title] || 0} likes
                      </span>
                    </div>
                  </article>
                ))}

                {trendingProperties.length > 1 && (
                  <div className="slider-controls">
                    <button
                      aria-label="Previous trending property"
                      onClick={() => setActiveSlide(current =>
                        (current - 1 + trendingProperties.length) % trendingProperties.length
                      )}
                    >
                      <ChevronLeft />
                    </button>
                    <span>{activeSlide + 1} / {trendingProperties.length}</span>
                    <button
                      aria-label="Next trending property"
                      onClick={() => setActiveSlide(current =>
                        (current + 1) % trendingProperties.length
                      )}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="trending-empty">
                <TrendingUp size={28} />
                <h3>Trending properties will appear here</h3>
                <p>Published properties need enough likes to qualify for this section.</p>
              </div>
            )}
          </section>

          <section className="all-properties-section" id="all-properties">
            <div className="all-properties-heading">
              <div>
                <span className="overline">EXPLORE THE MARKETPLACE</span>
                <h2>All available properties</h2>
                <p>Browse published homes, land and commercial spaces.</p>
              </div>
              <a href="#discover">
                Search listings <ArrowRight size={16} />
              </a>
            </div>

            <div className="all-properties-grid">
              {publishedProperties.map((property, index) => (
                <PropertyCard
                  key={`all-${property.title}`}
                  property={property}
                  likes={likes[property.title] || 0}
                  liked={liked.includes(property.title)}
                  onLike={() => toggleLike(property.title)}
                  index={index}
                  t={t}
                />
              ))}
            </div>
            {publishedProperties.length === 0 && (
              <p className="muted-text">No published properties yet.</p>
            )}
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
                <span><BadgeCheck /></span>
                <div><h3>{t.reviewedOwners}</h3><p>{t.reviewedOwnersDescription}</p></div>
              </div>
              <div className="trust-point">
                <span><Search /></span>
                <div><h3>{t.localDiscovery}</h3><p>{t.localDiscoveryDescription}</p></div>
              </div>
              <div className="trust-point">
                <span><Heart /></span>
                <div><h3>{t.madeForLife}</h3><p>{t.madeForLifeDescription}</p></div>
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
      )}

      <footer>
        <a className="brand footer-brand" href="#">
          <span className="brand-mark"><Building2 size={20} /></span>
          <span>habitat<span className="brand-light">africa</span></span>
        </a>
        <span>{t.footerDescription}</span>
        <span>© 2026 Habitat Africa</span>
      </footer>

      {!appwriteConfigured && (
        <div className="dev-ribbon">
          Preview data · Appwrite connection planned
        </div>
      )}
    </div>
  )
}

function PropertyCard({
  property,
  likes,
  liked,
  onLike,
  index,
  t,
}: {
  property: Property
  likes: number
  liked: boolean
  onLike: () => void
  index: number
  t: Translation
}) {
  return (
    <article className="property-card" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="property-photo">
        <img src={property.imageUrl} alt={property.title} loading="lazy" />
        <span className="type-pill">
          {property.listingType === 'Rent' ? t.rent : t.sale}
        </span>
        <button
          className={liked ? 'save-button saved' : 'save-button'}
          onClick={onLike}
          aria-label={liked ? 'Unlike property' : 'Like property'}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="property-info">
        <div className="property-location">
          <MapPin size={14} /> {property.area}, {property.city}
        </div>
        <h3>{property.title}</h3>
        <div className="property-meta">
          <span>{propertyTypeLabel(property.type, t)}</span>
          {property.bedrooms && (
            <span><BedDouble size={14} /> {property.bedrooms} {t.beds}</span>
          )}
          {property.bathrooms && <span>{property.bathrooms} {t.bathrooms}</span>}
        </div>
        <div className="property-bottom">
          <strong>
            {money(property.price, property.currency)}
            <small>{property.listingType === 'Rent' ? ` ${t.month}` : ` ${t.askingPrice}`}</small>
          </strong>
          <span className="card-likes">
            <Heart size={13} /> {likes}
          </span>
          {property.verified && (
            <span className="verified"><BadgeCheck size={14} /> {t.verified}</span>
          )}
        </div>
      </div>
    </article>
  )
}
