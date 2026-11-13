
import './TrendingProperties.css'

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react'

import type { Property } from '../../types'

interface TrendingPropertiesProps {
  properties: Property[]
  activeSlide: number
  onSlideChange: (index: number) => void
  onViewAll: () => void
  onPropertyClick: (property: Property) => void
}

export default function TrendingProperties({
  properties,
  activeSlide,
  onSlideChange,
  onPropertyClick,
}: TrendingPropertiesProps) {
  const currentTrending = properties[activeSlide]

  function formatMoney(
    value: number,
    currency: Property['currency']
  ) {
    return (
      new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(value) +
      ' ' +
      currency
    )
  }

  if (!currentTrending) return null

  return (
    <section className="trending-section" id="trending">
      <div className="trending-heading">
        <div>
          <span className="overline">POPULAR DISCOVERIES</span>
          <h2>Trending properties</h2>
        </div>

        <div className="trending-controls">
          <button
            type="button"
            aria-label="Previous property"
            onClick={() =>
              onSlideChange(
                (activeSlide - 1 + properties.length) %
                  properties.length
              )
            }
          >
            <ChevronLeft size={19} />
          </button>

          <button
            type="button"
            aria-label="Next property"
            onClick={() =>
              onSlideChange((activeSlide + 1) % properties.length)
            }
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      <div className="trending-card">
        <img
          src={currentTrending.imageUrl}
          alt={currentTrending.title}
        />

        <div className="trending-overlay">
          <span className="trending-label">
            <Sparkles size={13} />
            Trending
          </span>

          <h3>{currentTrending.title}</h3>

          <p>
            <MapPin size={14} />
            {currentTrending.area}, {currentTrending.city}
          </p>

          <strong>
            {formatMoney(
              currentTrending.price,
              currentTrending.currency
            )}
          </strong>

          <button
            type="button"
            onClick={() => onPropertyClick(currentTrending)}
          >
            Explore this property
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="trending-dots">
        {properties.map((property, index) => (
          <button
            type="button"
            key={property.$id || property.id || property.title}
            className={index === activeSlide ? 'active' : ''}
            aria-label={`Show trending property ${index + 1}`}
            onClick={() => onSlideChange(index)}
          />
        ))}
      </div>
    </section>
  )
}
