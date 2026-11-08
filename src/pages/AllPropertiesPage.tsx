
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import PropertyCard from '../components/properties/PropertyCard'

import type {
  CountryCode,
  Property,
  PropertyKind,
} from '../types'

interface AllPropertiesPageProps {
  properties: Property[]
  likes: Record<string, number>
  liked: string[]
  onLike: (title: string) => void
  onBack: () => void
  t: Record<string, string>
}

const cities: Record<CountryCode, string[]> = {
  MW: ['Lilongwe', 'Blantyre', 'Mzuzu'],
  CD: ['Lubumbashi', 'Kinshasa', 'Kolwezi'],
}

const propertyTypes: PropertyKind[] = [
  'House',
  'Apartment',
  'Land',
  'Shop',
  'Office',
  'Hotel',
]

export default function AllPropertiesPage({
  properties,
  likes,
  liked,
  onLike,
  onBack,
  t,
}: AllPropertiesPageProps) {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState<'All' | CountryCode>('All')
  const [city, setCity] = useState('All')
  const [type, setType] = useState<'All' | PropertyKind>('All')
  const [listing, setListing] = useState<'All' | 'Rent' | 'Sale'>('All')

  const filteredProperties = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return properties.filter(property => {
      const matchesSearch =
        !searchTerm ||
        `${property.title} ${property.description} ${property.city} ${property.area} ${property.type}`
          .toLowerCase()
          .includes(searchTerm)

      const matchesCountry =
        country === 'All' || property.countryCode === country

      const matchesCity =
        city === 'All' || property.city === city

      const matchesType =
        type === 'All' || property.type === type

      const matchesListing =
        listing === 'All' || property.listingType === listing

      return (
        matchesSearch &&
        matchesCountry &&
        matchesCity &&
        matchesType &&
        matchesListing
      )
    })
  }, [properties, search, country, city, type, listing])

  const availableCities =
    country === 'All'
      ? [...new Set(properties.map(property => property.city))]
      : cities[country]

  function resetFilters() {
    setSearch('')
    setCountry('All')
    setCity('All')
    setType('All')
    setListing('All')
  }

  function changeCountry(value: 'All' | CountryCode) {
    setCountry(value)
    setCity('All')
  }

  const hasFilters =
    search !== '' ||
    country !== 'All' ||
    city !== 'All' ||
    type !== 'All' ||
    listing !== 'All'

  return (
    <main className="all-properties-page">
      <section className="all-properties-heading">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to home
        </button>

        <span className="overline">
          HABITAT AFRICA MARKETPLACE
        </span>

        <h1>
          {t.allProperties || 'Explore all properties'}
        </h1>

        <p>
          Discover houses, apartments, land and commercial spaces
          across Malawi and the Democratic Republic of Congo.
        </p>
      </section>

      <section className="catalogue-section">
        <div className="catalogue-toolbar">
          <div className="catalogue-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search properties, cities or neighbourhoods..."
            />

            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="catalogue-result-count">
            <strong>{filteredProperties.length}</strong>
            <span>{t.propertiesFound || 'properties found'}</span>
          </div>
        </div>

        <div className="catalogue-filters">
          <div className="filter-heading">
            <SlidersHorizontal size={17} />
            <strong>Filters</strong>
          </div>

          <label>
            <span>Country</span>
            <select
              value={country}
              onChange={event =>
                changeCountry(event.target.value as 'All' | CountryCode)
              }
            >
              <option value="All">All countries</option>
              <option value="MW">Malawi</option>
              <option value="CD">DR Congo</option>
            </select>
          </label>

          <label>
            <span>City</span>
            <select
              value={city}
              onChange={event => setCity(event.target.value)}
            >
              <option value="All">All cities</option>

              {availableCities.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Property type</span>
            <select
              value={type}
              onChange={event =>
                setType(event.target.value as 'All' | PropertyKind)
              }
            >
              <option value="All">All types</option>

              {propertyTypes.map(item => (
                <option key={item} value={item}>
                  {t[item.toLowerCase()] || item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Listing type</span>
            <select
              value={listing}
              onChange={event =>
                setListing(event.target.value as 'All' | 'Rent' | 'Sale')
              }
            >
              <option value="All">Rent and sale</option>
              <option value="Rent">{t.rent || 'For rent'}</option>
              <option value="Sale">{t.sale || 'For sale'}</option>
            </select>
          </label>

          {hasFilters && (
            <button
              className="clear-catalogue-filters"
              onClick={resetFilters}
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>

        <div className="property-grid catalogue-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
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
              <h3>{t.noProperties || 'No properties found'}</h3>

              <p>
                Try changing your search or removing some filters.
              </p>

              <button onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
