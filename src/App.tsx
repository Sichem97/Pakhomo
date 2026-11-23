
import { useEffect, useMemo, useState } from 'react'

import { Header, Footer } from './components/layout'
import AdminErrorBoundary from './components/admin/AdminErrorBoundary'

import {
  HomePage,
  AllPropertiesPage,
  AdminPage,
  OwnerPage,
  PropertyDetailsPage,
} from './pages'

import type { AdminProperty } from './pages'
import type { Property, CountryCode, PropertyKind } from './types'

import { detectCountry } from './lib/country'

import {
  appwriteConfigured,
  submitPropertyToAPI,
  getApprovedProperties,
  getLikedPropertyIds,
  saveLikedPropertyIds,
  likeProperty,
  unlikeProperty,
} from './lib/appwrite'

import {
  detectInitialLanguage,
  saveLanguage,
  translations,
  type Language,
} from './lib/i18n'

type Status = 'Pending' | 'Published' | 'Rejected'

type Page =
  | 'home'
  | 'properties'
  | 'admin'
  | 'owner'
  | 'details'

const initialStatuses: Record<string, Status> = {}

// Always use a stable property identity.
function getPropertyId(property: Property): string {
  return property.id || property.$id || property.title
}

function getInitialPage(): Page {
  const path = window.location.pathname

  if (path === '/properties') return 'properties'
  if (path === '/list-property') return 'owner'
  if (path === '/admin') return 'admin'
  if (path.startsWith('/property/')) return 'details'

  return 'home'
}

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

  // Community likes
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [liked, setLiked] = useState<string[]>(() =>
    getLikedPropertyIds()
  )
  const [likingProperties, setLikingProperties] = useState<string[]>([])

  const [statuses, setStatuses] =
    useState<Record<string, Status>>(initialStatuses)

  const [userProperties] = useState<Property[]>([])
  const [apiProperties, setApiProperties] = useState<Property[]>([])

  const [deletedProperties, setDeletedProperties] = useState<string[]>([])

  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null)

  const [activeSlide, setActiveSlide] = useState(0)
  const [page, setPage] = useState<Page>(getInitialPage)

  const t = translations[language]

  // Detect visitor country.
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

  // Load approved properties from Appwrite.
  useEffect(() => {
    let active = true

    getApprovedProperties()
      .then(properties => {
        if (active) {
          setApiProperties(properties)

          const initialLikes: Record<string, number> = {}

          properties.forEach(property => {
            const id = getPropertyId(property)
            initialLikes[id] = Number(property.likesCount) || 0
          })

          setLikes(initialLikes)
          setLiked(getLikedPropertyIds())
        }
      })
      .catch(error => {
        console.error('Unable to load Appwrite properties:', error)
      })

    return () => {
      active = false
    }
  }, [])

  // Save language preference.
  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = language
  }, [language])

  // Handle browser back and forward navigation.
  useEffect(() => {
    function handlePopState() {
      const path = window.location.pathname

      if (path === '/properties') {
        setPage('properties')
        setSelectedProperty(null)
      } else if (path === '/list-property') {
        setPage('owner')
        setSelectedProperty(null)
      } else if (path === '/admin') {
        setPage('admin')
        setSelectedProperty(null)
      } else if (path.startsWith('/property/')) {
        const id = decodeURIComponent(path.split('/')[2] || '')

        const property = [...userProperties, ...apiProperties]
          .find(item => getPropertyId(item) === id)

        setSelectedProperty(property || null)
        setPage(property ? 'details' : 'home')
      } else {
        setPage('home')
        setSelectedProperty(null)
      }

      window.scrollTo({ top: 0 })
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [userProperties, apiProperties])

  // Combine real properties only.
  const allProperties = useMemo(() => {
    return [...userProperties, ...apiProperties]
      .filter(property =>
        !deletedProperties.includes(getPropertyId(property))
      )
      .map(property => {
        const id = getPropertyId(property)

        return {
          ...property,
          status:
            statuses[id] ||
            statuses[property.title] ||
            'Published',
        }
      })
  }, [
    statuses,
    deletedProperties,
    userProperties,
    apiProperties,
  ])

  // Only published properties are public.
  const publishedProperties = useMemo(() => {
    return allProperties.filter(
      property => property.status === 'Published'
    )
  }, [allProperties])

  // Homepage filters.
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
  }, [
    publishedProperties,
    country,
    city,
    kind,
    listing,
    query,
  ])

  // Trending properties based on real Appwrite likes.
  const trendingProperties = useMemo(() => {
    if (publishedProperties.length === 0) return []

    const getLikes = (property: Property) => {
      const id = getPropertyId(property)
      return likes[id] ?? Number(property.likesCount) ?? 0
    }

    const averageLikes =
      publishedProperties.reduce(
        (total, property) => total + getLikes(property),
        0
      ) / publishedProperties.length

    return publishedProperties
      .filter(
        property =>
          averageLikes > 0 &&
          getLikes(property) >= averageLikes * 1.5
      )
      .sort(
        (a, b) => getLikes(b) - getLikes(a)
      )
  }, [publishedProperties, likes])

  // Automatically rotate trending properties every five seconds.
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

  // Navigate to a page.
  function navigateTo(destination: Page, path: string) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }

    setPage(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateHome() {
    navigateTo('home', '/')
  }

  function navigateProperties() {
    navigateTo('properties', '/properties')
  }

  function openOwnerPage() {
    navigateTo('owner', '/list-property')
  }

  function openProperty(property: Property) {
    const id = getPropertyId(property)

    setSelectedProperty(property)
    navigateTo('details', `/property/${encodeURIComponent(id)}`)
  }

  // Submit a property from the owner form.
  async function submitProperty(property: Property) {
    try {
      await submitPropertyToAPI(property)
      navigateHome()
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unable to submit your property.')
    }
  }

  // Like or unlike a property through Appwrite.
  async function toggleLike(propertyId: string) {
    if (!propertyId || likingProperties.includes(propertyId)) {
      return
    }

    const alreadyLiked = liked.includes(propertyId)

    setLikingProperties(current => [...current, propertyId])

    try {
      const response = alreadyLiked
        ? await unlikeProperty(propertyId)
        : await likeProperty(propertyId)

      setLikes(current => ({
        ...current,
        [propertyId]: response.likesCount,
      }))

      const updatedLiked = response.liked
        ? [...new Set([...liked, propertyId])]
        : liked.filter(id => id !== propertyId)

      setLiked(updatedLiked)
      saveLikedPropertyIds(updatedLiked)
    } catch (error) {
      console.error('Unable to update property like:', error)

      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to update your like. Please try again.'
      )
    } finally {
      setLikingProperties(current =>
        current.filter(id => id !== propertyId)
      )
    }
  }

  // Admin status management.
  function updateStatus(id: string, status: Status) {
    setStatuses(current => ({
      ...current,
      [id]: status,
    }))
  }

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
          if (page === 'admin') {
            navigateHome()
          } else {
            navigateTo('admin', '/admin')
          }
        }}
        t={{
          discover: t.discover,
          howItWorks: t.howItWorks,
          listProperty: t.listProperty,
          language: t.language,
        }}
      />

      {page === 'admin' ? (
        <AdminErrorBoundary>
          <AdminPage
            properties={adminProperties}
            onApprove={id => updateStatus(id, 'Published')}
            onReject={id => updateStatus(id, 'Rejected')}
            onDelete={deleteProperty}
            onBack={navigateHome}
            t={t}
          />
        </AdminErrorBoundary>
      ) : page === 'properties' ? (
        <AllPropertiesPage
          properties={publishedProperties}
          likes={likes}
          liked={liked}
          initialFilters={{
            search: query,
            country,
            city: city === 'All cities' ? 'All' : city,
            type: kind === 'All types' ? 'All' : kind,
            listing,
          }}
          onLike={toggleLike}
          onBack={navigateHome}
          onPropertyClick={openProperty}
          t={t}
        />
      ) : page === 'owner' ? (
        <OwnerPage
          onBack={navigateHome}
          onSubmit={submitProperty}
        />
      ) : page === 'details' && selectedProperty ? (
        <PropertyDetailsPage
          property={selectedProperty}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              navigateHome()
            }
          }}
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
          onViewAll={navigateProperties}
          onListProperty={openOwnerPage}
          onResetFilters={resetFilters}
          onPropertyClick={openProperty}
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
