
import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import './PropertyFilters.css'

import type {
  CountryCode,
  PropertyKind,
} from '../../types'

interface PropertyFiltersProps {
  search: string
  country: 'All' | CountryCode
  city: string
  type: 'All' | PropertyKind
  listing: 'All' | 'Rent' | 'Sale'

  availableCities: string[]
  filteredCount: number
  hasFilters: boolean

  t: Record<string, string>

  onSearchChange: (value: string) => void
  onCountryChange: (value: 'All' | CountryCode) => void
  onCityChange: (value: string) => void
  onTypeChange: (value: 'All' | PropertyKind) => void
  onListingChange: (value: 'All' | 'Rent' | 'Sale') => void
  onReset: () => void
}

const propertyTypes: PropertyKind[] = [
  'House',
  'Apartment',
  'Land',
  'Shop',
  'Office',
  'Hotel',
]

export default function PropertyFilters({
  search,
  country,
  city,
  type,
  listing,
  availableCities,
  filteredCount,
  hasFilters,
  t,
  onSearchChange,
  onCountryChange,
  onCityChange,
  onTypeChange,
  onListingChange,
  onReset,
}: PropertyFiltersProps) {
  return (
    <>
      <div className="catalogue-toolbar">
        <div className="catalogue-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search properties, cities or neighbourhoods..."
          />

          {search && (
            <button
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="catalogue-result-count">
          <strong>{filteredCount}</strong>
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
              onCountryChange(
                event.target.value as 'All' | CountryCode
              )
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
            onChange={event => onCityChange(event.target.value)}
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
              onTypeChange(
                event.target.value as 'All' | PropertyKind
              )
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
              onListingChange(
                event.target.value as 'All' | 'Rent' | 'Sale'
              )
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
            onClick={onReset}
          >
            <X size={15} />
            Clear filters
          </button>
        )}
      </div>
    </>
  )
}

