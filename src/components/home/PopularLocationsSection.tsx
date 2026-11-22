
import type { CountryCode } from '../../types'

interface PopularLocationsSectionProps {
  country: CountryCode
  language: 'en' | 'fr'
  onSelectCity: (city: string) => void
}

const locations: Record<
  CountryCode,
  {
    city: string
    image: string
    description: { en: string; fr: string }
  }[]
> = {
  MW: [
    {
      city: 'Lilongwe',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Discover properties in the capital',
        fr: 'Découvrez les biens dans la capitale',
      },
    },
    {
      city: 'Blantyre',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Explore commercial and residential spaces',
        fr: 'Explorez les espaces commerciaux et résidentiels',
      },
    },
    {
      city: 'Mzuzu',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Find your next opportunity',
        fr: 'Trouvez votre prochaine opportunité',
      },
    },
  ],
  CD: [
    {
      city: 'Lubumbashi',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Explore properties in the copper capital',
        fr: 'Explorez les biens dans la capitale du cuivre',
      },
    },
    {
      city: 'Kinshasa',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Discover opportunities in the capital',
        fr: 'Découvrez les opportunités dans la capitale',
      },
    },
    {
      city: 'Kolwezi',
      image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
      description: {
        en: 'Find a place in a growing city',
        fr: 'Trouvez un bien dans une ville en pleine croissance',
      },
    },
  ],
}

export default function PopularLocationsSection({
  country,
  language,
  onSelectCity,
}: PopularLocationsSectionProps) {
  const isFrench = language === 'fr'
  const countryLocations = locations[country]

  return (
    <section className="popular-locations-section">
      <div className="popular-locations-heading">
        <div>
          <span className="overline">
            {isFrench ? 'DESTINATIONS RECHERCHÉES' : 'EXPLORE BY LOCATION'}
          </span>

          <h2>
            {isFrench
              ? 'Explorez les villes populaires'
              : 'Explore Popular Locations'}
          </h2>

          <p>
            {isFrench
              ? 'Découvrez des opportunités immobilières dans les principales villes de votre pays.'
              : 'Discover real estate opportunities across the leading cities in your country.'}
          </p>
        </div>
      </div>

      <div className="popular-locations-grid">
        {countryLocations.map((location) => (
          <button
            type="button"
            className="popular-location-card"
            key={location.city}
            onClick={() => onSelectCity(location.city)}
          >
            <img
              src={location.image}
              alt={location.city}
              loading="lazy"
            />

            <span className="popular-location-overlay" />

            <span className="popular-location-content">
              <strong>{location.city}</strong>
              <small>{location.description[language]}</small>
            </span>

            <span className="popular-location-arrow">↗</span>
          </button>
        ))}
      </div>
    </section>
  )
}
