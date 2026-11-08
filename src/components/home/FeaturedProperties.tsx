
import { ArrowRight, ShieldCheck } from 'lucide-react'

import PropertyCard from '../properties/PropertyCard'
import type { Property } from '../../types'

interface FeaturedPropertiesProps {
  properties: Property[]
  likes: Record<string, number>
  liked: string[]
  t: Record<string, string>

  onLike: (title: string) => void
  onViewAll: () => void
  onResetFilters: () => void
}

export default function FeaturedProperties({
  properties,
  likes,
  liked,
  t,
  onLike,
  onViewAll,
  onResetFilters,
}: FeaturedPropertiesProps) {
  const previewProperties = properties.slice(0, 6)

  return (
    <>
      <div className="property-grid">
        {previewProperties.length > 0 ? (
          previewProperties.map((property, index) => (
            <PropertyCard
              key={property.$id || property.title}
              property={property}
              likes={likes[property.title] || 0}
              liked={liked.includes(property.title)}
              onLike={() => onLike(property.title)}
              index={index}
              t={t as never}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>{t.noProperties}</h3>
            <p>{t.noPropertiesDescription}</p>
            <button onClick={onResetFilters}>
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>

      {properties.length > 0 && (
        <div className="browse-note">
          <ShieldCheck size={16} />
          {t.verifiedNotice}
        </div>
      )}

      <div className="view-all-properties">
        <button onClick={onViewAll}>
          {t.allProperties}
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  )
}
