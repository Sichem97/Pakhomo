
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import PropertyCard from '../components/properties/PropertyCard'
import type {
  CountryCode,
  Property,
  PropertyKind,
} from '../types'

type Translation = {
  [key: string]: string
}

interface HomePageProps {
  country: CountryCode
  countryName: string
  countryReady: boolean
  city: string
  kind: 'All types' | PropertyKind
  listing: 'All' | 'Rent' | 'Sale'
  query: string
  language: 'en' | 'fr'
  t: Translation

  properties: Property[]
  trendingProperties: Property[]
  likes: Record<string, number>
  liked: string[]
  activeSlide: number

  onCityChange: (value: string) => void
  onKindChange: (value: 'All types' | PropertyKind) => void
  onListingChange: (value: 'All' | 'Rent' | 'Sale') => void
  onQueryChange: (value: string) => void
  onLike: (title: string) => void
  onSlideChange: (index: number) => void
  onViewAll: () => void
  onListProperty: () => void
  onResetFilters: () => void
}

const countryCities: Record<CountryCode, string[]> = {
  MW: ['All cities', 'Lilongwe', 'Blantyre', 'Mzuzu'],
  CD: ['All cities', 'Lubumbashi', 'Kinshasa', 'Kolwezi'],
}

const propertyKinds: PropertyKind[] = [
  'House',
  'Apartment',
  'Land',
  'Shop',
  'Office',
  'Hotel',
]

export default function HomePage({
  country,
  countryName,
  countryReady,
  city,
  kind,
  listing,
  query,
  language,
  t,
  properties,
  trendingProperties,
  likes,
  liked,
  activeSlide,
  onCityChange,
  onKindChange,
  onListingChange,
  onQueryChange,
  onLike,
  onSlideChange,
  onViewAll,
  onListProperty,
  onResetFilters,
}: HomePageProps) {
  const currentTrending = trendingProperties[activeSlide]

  const previewProperties = properties.slice(0, 6)

  function formatMoney(
    value: number,
    currency: Property['currency']
  ) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value) + ' ' + currency
  }

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="eyebrow">
            <Sparkles size={15} />
            {t.nextChapter}
          </div>

          <h1>
            {t.heroTitle}
            <br />
            <em>{t.heroTitleEmphasis}</em>
          </h1>

          <p>{t.heroDescription}</p>

          <a className="hero-link" href="#discover">
            {t.exploreProperties}
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="hero-note">
          <span className="note-dot" />
          {t.localTrusted}
        </div>
      </section>

      {/* PROPERTY SEARCH AND PREVIEW */}
      <section className="search-section" id="discover">
        <div className="section-heading">
          <div>
            <span className="overline">{t.exploreIn}</span>
            <h2>{countryName}</h2>
          </div>

          <div className="detected">
            <span className="pulse" />
            {countryReady
              ? t.countryDetected
              : t.detectingCountry}
          </div>
        </div>

        <div className="search-panel">
          <div className="search-input">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={event =>
                onQueryChange(event.target.value)
              }
              placeholder={t.searchPlaceholder}
            />
          </div>

          <div className="select-wrap">
            <MapPin size={16} />
            <select
              value={city}
              onChange={event =>
                onCityChange(event.target.value)
              }
            >
              {countryCities[country].map(item => (
                <option key={item} value={item}>
                  {item === 'All cities'
                    ? t.allCities
                    : item}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <Compass size={16} />
            <select
              value={kind}
              onChange={event =>
                onKindChange(
                  event.target.value as 'All types' | PropertyKind
                )
              }
            >
              <option value="All types">{t.allTypes}</option>

              {propertyKinds.map(item => (
                <option key={item} value={item}>
                  {t[item.toLowerCase()]}
                </option>
              ))}
            </select>
          </div>

          <button className="search-button" onClick={onViewAll}>
            {t.search}
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="listing-toolbar">
          <div className="tabs">
            <button
              className={listing === 'All' ? 'tab active' : 'tab'}
              onClick={() => onListingChange('All')}
            >
              {t.allProperties}
            </button>

            <button
              className={listing === 'Rent' ? 'tab active' : 'tab'}
              onClick={() => onListingChange('Rent')}
            >
              {t.forRent}
            </button>

            <button
              className={listing === 'Sale' ? 'tab active' : 'tab'}
              onClick={() => onListingChange('Sale')}
            >
              {t.forSale}
            </button>
          </div>

          <span className="result-count">
            {properties.length} {t.propertiesFound}
          </span>
        </div>

        <div className="property-grid">
          {previewProperties.length > 0 ? (
            previewProperties.map((property, index) => (
              <PropertyCard
                key={property.$id || property.title}
                property={property}
                likes={likes[property.title] || 0}
                liked={liked.includes(property.title)}
                onLike={() => onLike(property.title)}
                index={index}
                t={t as never}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>{t.noProperties}</h3>
              <p>{t.noPropertiesDescription}</p>
              <button onClick={onResetFilters}>
                {t.clearFilters}
              </button>
            </div>
          )}
        </div>

        {properties.length > 0 && (
          <div className="browse-note">
            <ShieldCheck size={16} />
            {t.verifiedNotice}
          </div>
        )}

        <div className="view-all-properties">
          <button onClick={onViewAll}>
            {t.allProperties}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* TRENDING */}
      {currentTrending && (
        <section className="trending-section" id="trending">
          <div className="trending-heading">
            <div>
              <span className="overline">POPULAR DISCOVERIES</span>
              <h2>Trending properties</h2>
            </div>

            <div className="trending-controls">
              <button
                aria-label="Previous property"
                onClick={() =>
                  onSlideChange(
                    (activeSlide - 1 + trendingProperties.length) %
                    trendingProperties.length
                  )
                }
              >
                <ChevronLeft size={19} />
              </button>

              <button
                aria-label="Next property"
                onClick={() =>
                  onSlideChange(
                    (activeSlide + 1) % trendingProperties.length
                  )
                }
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="trending-card">
            <img
              src={currentTrending.imageUrl}
              alt={currentTrending.title}
            />

            <div className="trending-overlay">
              <span className="trending-label">
                <Sparkles size={13} />
                Trending
              </span>

              <h3>{currentTrending.title}</h3>

              <p>
                <MapPin size={14} />
                {currentTrending.area}, {currentTrending.city}
              </p>

              <strong>
                {formatMoney(
                  currentTrending.price,
                  currentTrending.currency
                )}
              </strong>

              <button onClick={onViewAll}>
                Explore this property
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="trending-dots">
            {trendingProperties.map((property, index) => (
              <button
                key={property.$id || property.title}
                className={index === activeSlide ? 'active' : ''}
                aria-label={`Show trending property ${index + 1}`}
                onClick={() => onSlideChange(index)}
              />
            ))}
          </div>
        </section>
      )}

      {/* TRUST SECTION */}
      <section className="trust-section" id="how">
        <div className="trust-copy">
          <span className="overline">{t.peaceOfMind}</span>
          <h2>{t.confidenceTitle}</h2>
          <p>{t.confidenceDescription}</p>

          <a href="#verification">
            {t.verificationWorks}
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="trust-features">
          <article>
            <span><BadgeCheck size={21} /></span>
            <div>
              <h3>{t.reviewedOwners}</h3>
              <p>{t.reviewedOwnersDescription}</p>
            </div>
          </article>

          <article>
            <span><Compass size={21} /></span>
            <div>
              <h3>{t.localDiscovery}</h3>
              <p>{t.localDiscoveryDescription}</p>
            </div>
          </article>

          <article>
            <span><BedDouble size={21} /></span>
            <div>
              <h3>{t.madeForLife}</h3>
              <p>{t.madeForLifeDescription}</p>
            </div>
          </article>
        </div>
      </section>

      {/* OWNER INVITATION */}
      <section className="owner-cta" id="list-property">
        <div>
          <span className="overline">{t.haveProperty}</span>
          <h2>{t.ownerTitle}</h2>
          <p>{t.ownerDescription}</p>
        </div>

        <button onClick={onListProperty}>
          {t.registerInterest}
          <ArrowRight size={16} />
        </button>
      </section>
    </main>
  )
}
