
import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
} from 'lucide-react'

import type {
  CountryCode,
  PropertyKind,
} from '../../types'

type ListingType = 'All' | 'Rent' | 'Sale'

interface SearchPanelProps {
  country: CountryCode
  countryName: string
  countryReady: boolean
  city: string
  kind: 'All types' | PropertyKind
  listing: ListingType
  query: string
  propertiesCount: number
  t: Record<string, string>

  onCityChange: (value: string) => void
  onKindChange: (value: 'All types' | PropertyKind) => void
  onListingChange: (value: ListingType) => void
  onQueryChange: (value: string) => void
  onViewAll: () => void
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

export default function SearchPanel({
  country,
  countryName,
  countryReady,
  city,
  kind,
  listing,
  query,
  propertiesCount,
  t,
  onCityChange,
  onKindChange,
  onListingChange,
  onQueryChange,
  onViewAll,
}: SearchPanelProps) {
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="overline">{t.exploreIn}</span>
          <h2>{countryName}</h2>
        </div>

        <div className="detected">
          <span className="pulse" />
          {countryReady ? t.countryDetected : t.detectingCountry}
        </div>
      </div>

      <div className="search-panel">
        <div className="search-input">
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </div>

        <div className="select-wrap">
          <MapPin size={16} />
          <select
            value={city}
            onChange={event => onCityChange(event.target.value)}
          >
            {countryCities[country].map(item => (
              <option key={item} value={item}>
                {item === 'All cities' ? t.allCities : item}
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

        <button
          type="button"
          className="search-button"
          onClick={onViewAll}
        >
          {t.search}
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="listing-toolbar">
        <div className="tabs">
          <button
            type="button"
            className={listing === 'All' ? 'tab active' : 'tab'}
            onClick={() => onListingChange('All')}
          >
            {t.allProperties}
          </button>

          <button
            type="button"
            className={listing === 'Rent' ? 'tab active' : 'tab'}
            onClick={() => onListingChange('Rent')}
          >
            {t.forRent}
          </button>

          <button
            type="button"
            className={listing === 'Sale' ? 'tab active' : 'tab'}
            onClick={() => onListingChange('Sale')}
          >
            {t.forSale}
          </button>
        </div>

        <span className="result-count">
          {propertiesCount} {t.propertiesFound}
        </span>
      </div>
    </>
  )
}
