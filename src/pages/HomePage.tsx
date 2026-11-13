
import {
  HeroSection,
  SearchPanel,
  FeaturedProperties,
  TrendingProperties,
  TrustSection,
  OwnerInvitation,
} from '../components/home'

import type {
  CountryCode,
  Property,
  PropertyKind,
} from '../types'

type Translation = Record<string, string>

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
  onPropertyClick: (property: Property) => void
}

export default function HomePage({
  country,
  countryName,
  countryReady,
  city,
  kind,
  listing,
  query,
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
  onPropertyClick,
}: HomePageProps) {
  return (
    <main>
      <HeroSection t={t} />

      <section className="search-section" id="discover">
        <SearchPanel
          country={country}
          countryName={countryName}
          countryReady={countryReady}
          city={city}
          kind={kind}
          listing={listing}
          query={query}
          propertiesCount={properties.length}
          t={t}
          onCityChange={onCityChange}
          onKindChange={onKindChange}
          onListingChange={onListingChange}
          onQueryChange={onQueryChange}
          onViewAll={onViewAll}
        />

        <FeaturedProperties
          properties={properties}
          likes={likes}
          liked={liked}
          t={t}
          onLike={onLike}
          onViewAll={onViewAll}
          onResetFilters={onResetFilters}
          onPropertyClick={onPropertyClick}
        />
      </section>

      <TrendingProperties
        properties={trendingProperties}
        activeSlide={activeSlide}
        onSlideChange={onSlideChange}
        onViewAll={onViewAll}
        onPropertyClick={onPropertyClick}
      />

      <TrustSection t={t} />

      <OwnerInvitation
        t={t}
        onListProperty={onListProperty}
      />
    </main>
  )
}
