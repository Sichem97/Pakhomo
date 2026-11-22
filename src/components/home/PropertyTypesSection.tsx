import type { PropertyKind } from '../types'

interface PropertyTypesSectionProps {
  language: 'en' | 'fr'
  onSelectType: (type: PropertyKind) => void
}

const propertyTypes: {
  type: PropertyKind
  image: string
  title: { en: string; fr: string }
  description: { en: string; fr: string }
}[] = [
  {
    type: 'House',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Houses', fr: 'Maisons' },
    description: { en: 'Find your perfect family home', fr: 'Trouvez votre maison idéale' },
  },
  {
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Apartments', fr: 'Appartements' },
    description: { en: 'Modern urban living', fr: 'Un cadre de vie moderne' },
  },
  {
    type: 'Land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Land', fr: 'Terrains' },
    description: { en: 'Discover land opportunities', fr: 'Découvrez des terrains disponibles' },
  },
  {
    type: 'Shop',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Shops', fr: 'Boutiques' },
    description: { en: 'Spaces for your business', fr: 'Des espaces pour vos activités' },
  },
  {
    type: 'Office',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Offices', fr: 'Bureaux' },
    description: { en: 'Professional workspaces', fr: 'Des espaces professionnels' },
  },
  {
    type: 'Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=85',
    title: { en: 'Hotels', fr: 'Hôtels' },
    description: { en: 'Explore hospitality properties', fr: 'Explorez les biens hôteliers' },
  },
]

export default function PropertyTypesSection({
  language,
  onSelectType,
}: PropertyTypesSectionProps) {
  const isFrench = language === 'fr'

  return (
    <section className="property-types-section">
      <div className="property-types-heading">
        <span className="overline">
          {isFrench ? 'EXPLOREZ LES POSSIBILITÉS' : 'EXPLORE POSSIBILITIES'}
        </span>

        <h2>
          {isFrench
            ? 'Trouvez un bien selon vos besoins'
            : 'Find a Property That Fits Your Needs'}
        </h2>

        <p>
          {isFrench
            ? 'Des maisons familiales aux espaces commerciaux, découvrez le bien qui vous correspond.'
            : 'From family homes to commercial spaces, discover a property that matches your needs.'}
        </p>
      </div>

      <div className="property-types-grid">
        {propertyTypes.map((item) => (
          <button
            type="button"
            className="property-type-card"
            key={item.type}
            onClick={() => onSelectType(item.type)}
          >
            <img src={item.image} alt={item.title[language]} loading="lazy" />

            <span className="property-type-overlay" />

            <span className="property-type-content">
              <strong>{item.title[language]}</strong>
              <small>{item.description[language]}</small>
            </span>

            <span className="property-type-arrow">↗</span>
          </button>
        ))}
      </div>
    </section>
  )
}
