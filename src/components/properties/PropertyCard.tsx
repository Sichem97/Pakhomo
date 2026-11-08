
import {
  BadgeCheck,
  BedDouble,
  Heart,
  MapPin,
} from 'lucide-react'

import type { Property, PropertyKind } from '../../types'

type Translation = {
  house: string
  apartment: string
  land: string
  shop: string
  office: string
  hotel: string
  rent: string
  sale: string
  beds: string
  bathrooms: string
  month: string
  askingPrice: string
  verified: string
}

interface PropertyCardProps {
  property: Property
  likes: number
  liked: boolean
  onLike: () => void
  index?: number
  t: Translation
}

function formatMoney(value: number, currency: Property['currency']) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value) + ' ' + currency
}

function getPropertyType(type: PropertyKind, t: Translation) {
  const labels: Record<PropertyKind, string> = {
    House: t.house,
    Apartment: t.apartment,
    Land: t.land,
    Shop: t.shop,
    Office: t.office,
    Hotel: t.hotel,
  }

  return labels[type]
}

export default function PropertyCard({
  property,
  likes,
  liked,
  onLike,
  index = 0,
  t,
}: PropertyCardProps) {
  return (
    <article
      className="property-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="property-photo">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
        />

        <span className="type-pill">
          {property.listingType === 'Rent' ? t.rent : t.sale}
        </span>

        <button
          className={liked ? 'save-button saved' : 'save-button'}
          onClick={onLike}
          aria-label={liked ? 'Unlike property' : 'Like property'}
        >
          <Heart
            size={17}
            fill={liked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="property-info">
        <div className="property-location">
          <MapPin size={14} />
          {property.area}, {property.city}
        </div>

        <h3>{property.title}</h3>

        <div className="property-meta">
          <span>{getPropertyType(property.type, t)}</span>

          {property.bedrooms !== undefined && (
            <span>
              <BedDouble size={14} />
              {property.bedrooms} {t.beds}
            </span>
          )}

          {property.bathrooms !== undefined && (
            <span>
              {property.bathrooms} {t.bathrooms}
            </span>
          )}
        </div>

        <div className="property-bottom">
          <strong>
            {formatMoney(property.price, property.currency)}
            <small>
              {property.listingType === 'Rent'
                ? ` ${t.month}`
                : ` ${t.askingPrice}`}
            </small>
          </strong>

          <span className="card-likes">
            <Heart size={13} />
            {likes}
          </span>

          {property.verified && (
            <span className="verified">
              <BadgeCheck size={14} />
              {t.verified}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

