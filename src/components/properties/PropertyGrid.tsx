
import PropertyCard from './PropertyCard'

import type { Property } from '../../types'

interface PropertyGridProps {
  properties: Property[]
  likes: Record<string, number>
  liked: string[]
  t: Record<string, string>
  onLike: (propertyId: string) => void
  onReset: () => void
  onPropertyClick: (property: Property) => void
}

function getPropertyId(property: Property): string {
  return property.id || property.$id || property.title
}

export default function PropertyGrid({
  properties,
  likes,
  liked,
  t,
  onLike,
  onReset,
  onPropertyClick,
}: PropertyGridProps) {
  return (
    <div className="property-grid catalogue-grid">
      {properties.length > 0 ? (
        properties.map((property, index) => {
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
        })
      ) : (
        <div className="empty-state">
          <h3>{t.noProperties || 'No properties found'}</h3>

          <p>
            Try changing your search or removing some filters.
          </p>

          <button
            type="button"
            onClick={onReset}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
