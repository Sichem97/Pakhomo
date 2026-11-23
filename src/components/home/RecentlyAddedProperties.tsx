
import { ArrowRight, Clock3 } from 'lucide-react'

import PropertyCard from '../properties/PropertyCard'
import type { Property } from '../../types'

interface RecentlyAddedPropertiesProps {
  properties: Property[]
  likes: Record<string, number>
  liked: string[]
  language: 'en' | 'fr'
  t: Record<string, string>
  onLike: (propertyId: string) => void
  onViewAll: () => void
  onPropertyClick: (property: Property) => void
}

type PropertyWithDate = Property & {
  createdAt?: string
}

function getPropertyId(property: Property): string {
  return property.id || property.$id || property.title
}

export default function RecentlyAddedProperties({
  properties,
  likes,
  liked,
  language,
  t,
  onLike,
  onViewAll,
  onPropertyClick,
}: RecentlyAddedPropertiesProps) {
  const recentProperties = [...properties]
    .filter(property =>
      Boolean((property as PropertyWithDate).createdAt)
    )
    .sort((a, b) => {
      const dateA = new Date(
        (a as PropertyWithDate).createdAt!
      ).getTime()

      const dateB = new Date(
        (b as PropertyWithDate).createdAt!
      ).getTime()

      return dateB - dateA
    })
    .slice(0, 6)

  const isFrench = language === 'fr'

  return (
    <section className="recent-properties-section">
      <div className="recent-properties-heading">
        <div>
          <span className="recent-properties-eyebrow">
            <Clock3 size={15} />
            {isFrench ? 'NOUVELLES ANNONCES' : 'FRESH ON PAKHOMO'}
          </span>

          <h2>
            {isFrench ? 'Ajoutés récemment' : 'Recently Added'}
          </h2>

          <p>
            {isFrench
              ? 'Découvrez les dernières propriétés publiées sur Pakhomo.'
              : 'Discover the latest properties listed on Pakhomo.'}
          </p>
        </div>

        <button
          type="button"
          className="recent-properties-view-all"
          onClick={onViewAll}
        >
          {isFrench ? 'Voir tout' : 'View all'}
          <ArrowRight size={17} />
        </button>
      </div>

      {recentProperties.length > 0 ? (
        <div className="recent-properties-grid">
          {recentProperties.map((property, index) => {
            const propertyId = getPropertyId(property)

            return (
              <PropertyCard
                key={propertyId}
                property={property}
                likes={likes[propertyId] ?? Number(property.likesCount) ?? 0}
                liked={liked.includes(propertyId)}
                onLike={() => onLike(propertyId)}
                onClick={() => onPropertyClick(property)}
                index={index}
                t={t as never}
              />
            )
          })}
        </div>
      ) : (
        <div className="recent-properties-empty">
          <Clock3 size={25} />

          <h3>
            {isFrench
              ? 'Aucune nouvelle annonce pour le moment'
              : 'No recent listings yet'}
          </h3>

          <p>
            {isFrench
              ? 'Les nouvelles propriétés apparaîtront ici dès leur publication.'
              : 'New properties will appear here as soon as they are published.'}
          </p>
        </div>
      )}
    </section>
  )
}
