
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
    landmark: string
    image: string
    description: { en: string; fr: string }
  }[]
> = {
  MW: [
    {
      city: 'Lilongwe',
      landmark: 'Parliament Building',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/9/9d/Parliamentbuilding.jpg',
      description: {
        en: 'Explore opportunities in the capital',
        fr: 'Explorez les opportunités dans la capitale',
      },
    },
    {
      city: 'Blantyre',
      landmark: 'St Michael Clock Tower',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/c/ce/St_Michael_and_All_Angels_Church%2C_Blantyre%2C_Malawi_Clock_Tower.JPG',
      description: {
        en: 'Discover properties in the commercial city',
        fr: 'Découvrez les biens dans la capitale commerciale',
      },
    },
    {
      city: 'Mzuzu',
      landmark: 'Mzuzu City',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/2/28/Mzuzu%2C_Malawi.jpg',
      description: {
        en: 'Find your next opportunity in the north',
        fr: 'Trouvez votre prochaine opportunité dans le nord',
      },
    },
  ],

  CD: [
    {
      city: 'Lubumbashi',
      landmark: 'Gécamines Headquarters',
      image:
        'https://forrestgroup.com/content/uploads/2019/05/gecamines-lubumbashi-renovation-groupe-forrest.jpg',
      description: {
        en: 'Explore properties in the copper capital',
        fr: 'Explorez les biens dans la capitale du cuivre',
      },
    },
    {
      city: 'Kinshasa',
      landmark: 'Échangeur de Limete',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/e/e3/Tour_de_l%E2%80%99%C3%89changeur_de_Limete_%C3%A0_Kinshasa%2C_R%C3%A9publique_d%C3%A9mocratique_du_Congo.jpg',
      description: {
        en: 'Discover opportunities in the capital',
        fr: 'Découvrez les opportunités dans la capitale',
      },
    },
    {
      city: 'Kolwezi',
      landmark: 'Rond-point Mwangeji',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/1/16/Mwangeji.jpg',
      description: {
        en: 'Find a place in the cobalt capital',
        fr: 'Trouvez un bien dans la capitale du cobalt',
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
            {isFrench
              ? 'DESTINATIONS RECHERCHÉES'
              : 'EXPLORE BY LOCATION'}
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
            aria-label={`${location.city} - ${location.landmark}`}
          >
            <img
  src={location.image}
  alt={`${location.landmark}, ${location.city}`}
  loading="lazy"
  onError={(event) => {
    event.currentTarget.style.display = 'none'
  }}
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
