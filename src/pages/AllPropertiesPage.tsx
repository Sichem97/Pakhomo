
import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import {
  PropertyFilters,
  PropertyGrid,
} from '../components/properties'

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
        <PropertyFilters
          search={search}
          country={country}
          city={city}
          type={type}
          listing={listing}
          availableCities={availableCities}
          filteredCount={filteredProperties.length}
          hasFilters={hasFilters}
          t={t}
          onSearchChange={setSearch}
          onCountryChange={changeCountry}
          onCityChange={setCity}
          onTypeChange={setType}
          onListingChange={setListing}
          onReset={resetFilters}
        />

        <PropertyGrid
          properties={filteredProperties}
          likes={likes}
          liked={liked}
          t={t}
          onLike={onLike}
          onReset={resetFilters}
        />
      </section>
    </main>
  )
}
