
import { useEffect, useMemo, useState } from 'react'

import { Header, Footer } from './components/layout'
import {
  HomePage,
  AllPropertiesPage,
  AdminPage,
} from './pages'

import type { AdminProperty } from './pages'

import { sampleProperties } from './data/properties'
import { detectCountry } from './lib/country'
import { appwriteConfigured } from './lib/appwrite'

import {
  detectInitialLanguage,
  saveLanguage,
  translations,
  type Language,
} from './lib/i18n'

import type {
  CountryCode,
  PropertyKind,
} from './types'

type Status = 'Pending' | 'Published' | 'Rejected'
type Page = 'home' | 'properties' | 'admin'

const initialStatuses: Record<string, Status> =
  sampleProperties.reduce((result, property) => {
    result[property.title] = property.verified
      ? 'Published'
      : 'Pending'

    return result
  }, {} as Record<string, Status>)

export default function App() {
  const [country, setCountry] = useState<CountryCode>('MW')
  const [countryReady, setCountryReady] = useState(false)

  const [language, setLanguage] = useState<Language>(
    () => detectInitialLanguage()
  )

  const [city, setCity] = useState('All cities')
  const [kind, setKind] = useState<'All types' | PropertyKind>('All types')
  const [listing, setListing] = useState<'All' | 'Rent' | 'Sale'>('All')
  const [query, setQuery] = useState('')

  const [likes, setLikes] = useState<Record<string, number>>({
    'Modern family house in Lilongwe': 18,
    'Beautiful apartment in Blantyre': 12,
    'Residential plot in Mzuzu': 5,
    'Modern house in Lubumbashi': 30,
    'Apartment in Kinshasa': 24,
    'Commercial land in Kolwezi': 8,
  })

  const [liked, setLiked] = useState<string[]>([])
  const [statuses, setStatuses] =
    useState<Record<string, Status>>(initialStatuses)

  const [deletedProperties, setDeletedProperties] = useState<string[]>([])

  const [activeSlide, setActiveSlide] = useState(0)

  const [page, setPage] = useState<Page>(() =>
    window.location.pathname === '/properties'
      ? 'properties'
      : 'home'
  )

  const t = translations[language]

  // Detect the visitor's country.
  useEffect(() => {
    let active = true

    detectCountry()
      .then(detectedCountry => {
        if (active) {
          setCountry(detectedCountry)
          setCountryReady(true)
        }
      })
      .catch(() => {
        if (active) setCountryReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  // Save the selected language.
  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = language
  }, [language])

  // Handle browser navigation.
  useEffect(() => {
    const handlePopState = () => {
      setPage(
        window.location.pathname === '/properties'
          ? 'properties'
          : 'home'
      )
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Prepare properties and their current statuses.
  const allProperties = useMemo(() => {
    return sampleProperties
      .filter(property => !deletedProperties.includes(property.title))
      .map(property => ({
        ...property,
        status: statuses[property.title] || 'Pending',
      }))
  }, [statuses, deletedProperties])

  // Only published properties appear publicly.
  const publishedProperties = useMemo(() => {
    return allProperties.filter(
      property => property.status === 'Published'
    )
  }, [allProperties])

  // Apply homepage filters.
  const visibleProperties = useMemo(() => {
    return publishedProperties.filter(property => {
      const matchesCountry = property.countryCode === country

      const matchesCity =
        city === 'All cities' || property.city === city

      const matchesKind =
        kind === 'All types' || property.type === kind

      const matchesListing =
        listing === 'All' || property.listingType === listing

      const searchText = [
        property.title,
        property.description,
        property.city,
        property.area,
        property.type,
      ].join(' ').toLowerCase()

      const matchesQuery = searchText.includes(query.toLowerCase())

      return (
        matchesCountry &&
        matchesCity &&
        matchesKind &&
        matchesListing &&
        matchesQuery
      )
    })
  }, [publishedProperties, country, city, kind, listing, query])

  // Calculate trending properties.
  const trendingProperties = useMemo(() => {
    if (publishedProperties.length === 0) return []

    const averageLikes =
      publishedProperties.reduce(
        (total, property) =>
          total + (likes[property.title] || 0),
        0
      ) / publishedProperties.length

    return publishedProperties
      .filter(
        property =>
          averageLikes > 0 &&
          (likes[property.title] || 0) >= averageLikes * 1.5
      )
      .sort(
        (a, b) =>
          (likes[b.title] || 0) - (likes[a.title] || 0)
      )
  }, [publishedProperties, likes])

  // Automatically rotate trending properties.
  useEffect(() => {
    if (trendingProperties.length < 2) {
      setActiveSlide(0)
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlide(current =>
        (current + 1) % trendingProperties.length
      )
    }, 5000)

    return () => window.clearInterval(timer)
  }, [trendingProperties.length])

  useEffect(() => {
    if (activeSlide >= trendingProperties.length) {
      setActiveSlide(0)
    }
  }, [activeSlide, trendingProperties.length])

  const countryName =
    country === 'CD'
      ? language === 'fr' ? 'RDC' : 'DR Congo'
      : 'Malawi'

  // Navigate between pages.
  function navigateTo(destination: 'home' | 'properties') {
    const path = destination === 'properties'
      ? '/properties'
      : '/'

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }

    setPage(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Like or unlike a property.
  function toggleLike(title: string) {
    const alreadyLiked = liked.includes(title)

    setLiked(current =>
      alreadyLiked
        ? current.filter(item => item !== title)
        : [...current, title]
    )

    setLikes(current => ({
      ...current,
      [title]: Math.max(
        0,
        (current[title] || 0) + (alreadyLiked ? -1 : 1)
      ),
    }))
  }

  // Update a property's administrative status.
  function updateStatus(id: string, status: Status) {
    setStatuses(current => ({
      ...current,
      [id]: status,
    }))
  }

  // Delete a property from the current demo session.
  function deleteProperty(id: string) {
    setDeletedProperties(current =>
      current.includes(id) ? current : [...current, id]
    )
  }

  function resetFilters() {
    setCity('All cities')
    setKind('All types')
    setListing('All')
    setQuery('')
  }

  function changeCountry(newCountry: CountryCode) {
    setCountry(newCountry)
    resetFilters()
  }

  const adminProperties: AdminProperty[] = allProperties

  const footerTranslations = {
    footerDescription: t.footerDescription,
    discover: t.discover,
    howItWorks: t.howItWorks,
    listProperty: t.listProperty,
  }

  return (
    <div className="site-shell">
      <Header
        country={country}
        language={language}
        adminOpen={page === 'admin'}
        onCountryChange={changeCountry}
        onLanguageChange={setLanguage}
        onAdminToggle={() => {
          setPage(current =>
            current === 'admin' ? 'home' : 'admin'
          )

          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        t={{
          discover: t.discover,
          howItWorks: t.howItWorks,
          listProperty: t.listProperty,
          language: t.language,
        }}
      />

      {page === 'admin' ? (
        <AdminPage
          properties={adminProperties}
          onApprove={id => updateStatus(id, 'Published')}
          onReject={id => updateStatus(id, 'Rejected')}
          onDelete={deleteProperty}
          onBack={() => {
            setPage('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          t={t}
        />
      ) : page === 'properties' ? (
        <AllPropertiesPage
          properties={publishedProperties}
          likes={likes}
          liked={liked}
          onLike={toggleLike}
          onBack={() => navigateTo('home')}
          t={t}
        />
      ) : (
        <HomePage
          country={country}
          countryName={countryName}
          countryReady={countryReady}
          city={city}
          kind={kind}
          listing={listing}
          query={query}
          language={language}
          t={t}
          properties={visibleProperties}
          trendingProperties={trendingProperties}
          likes={likes}
          liked={liked}
          activeSlide={activeSlide}
          onCityChange={setCity}
          onKindChange={setKind}
          onListingChange={setListing}
          onQueryChange={setQuery}
          onLike={toggleLike}
          onSlideChange={setActiveSlide}
          onViewAll={() => navigateTo('properties')}
          onListProperty={() => {
            window.location.href =
              'mailto:hello@habitat-africa.example?subject=List%20my%20property'
          }}
          onResetFilters={resetFilters}
        />
      )}

      <Footer t={footerTranslations} />

      {!appwriteConfigured && (
        <div className="dev-ribbon">
          Preview data · Appwrite connection planned
        </div>
      )}
    </div>
  )
}
