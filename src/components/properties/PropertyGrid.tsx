
import PropertyCard from './PropertyCard'

import type { Property } from '../../types'

interface PropertyGridProps {
  properties: Property[]
  likes: Record<string, number>
  liked: string[]
  t: Record<string, string>
  onLike: (title: string) => void
  onReset: () => void
  onPropertyClick: (property: Property) => void
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
        properties.map((property, index) => (
          <PropertyCard
            key={property.$id || property.id || property.title}
            property={property}
            likes={likes[property.title] || 0}
            liked={liked.includes(property.title)}
            onLike={() => onLike(property.title)}
            onClick={() => onPropertyClick(property)}
            index={index}
            t={t as never}
          />
        ))
      ) : (
        <div className="empty-state">
          <h3>{t.noProperties || 'No properties found'}</h3>
          <p>
            Try changing your search or removing some filters.
          </p>
          <button onClick={onReset}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
