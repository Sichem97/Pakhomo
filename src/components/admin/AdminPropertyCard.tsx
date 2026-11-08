
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Trash2,
  XCircle,
} from 'lucide-react'

import type { Property } from '../../types'
import type { PropertyStatus } from '../../pages/AdminPage'

interface AdminPropertyCardProps {
  property: Property & { status: PropertyStatus }
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}

function formatPrice(property: Property) {
  return (
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(property.price) +
    ' ' +
    property.currency
  )
}

export default function AdminPropertyCard({
  property,
  onApprove,
  onReject,
  onDelete,
}: AdminPropertyCardProps) {
  const id = property.$id || property.title

  function deleteProperty() {
    if (
      window.confirm(
        'Are you sure you want to delete this property?'
      )
    ) {
      onDelete(id)
    }
  }

  return (
    <article className="admin-property-card">
      <img
        src={property.imageUrl}
        alt={property.title}
        className="admin-property-image"
      />

      <div className="admin-property-details">
        <div className="admin-property-topline">
          <span
            className={`admin-status status-${property.status.toLowerCase()}`}
          >
            {property.status === 'Pending' && <Clock size={13} />}
            {property.status === 'Published' && <CheckCircle size={13} />}
            {property.status === 'Rejected' && <XCircle size={13} />}
            {property.status === 'Pending'
              ? 'Pending review'
              : property.status}
          </span>

          <span className="admin-country-code">
            {property.countryCode}
          </span>
        </div>

        <h3>{property.title}</h3>

        <p className="admin-property-location">
          <MapPin size={14} />
          {property.area}, {property.city}
        </p>

        <div className="admin-property-meta">
          <span>{property.type}</span>
          <span>{property.listingType}</span>
          <strong>{formatPrice(property)}</strong>
        </div>

        <p className="admin-property-description">
          {property.description}
        </p>

        <div className="admin-property-actions">
          <button
            className="admin-view-button"
            onClick={() =>
              window.open(
                property.imageUrl,
                '_blank',
                'noopener,noreferrer'
              )
            }
          >
            <Eye size={15} />
            View image
          </button>

          {property.status !== 'Published' && (
            <button
              className="admin-approve-button"
              onClick={() => onApprove(id)}
            >
              <CheckCircle size={15} />
              Approve
            </button>
          )}

          {property.status !== 'Rejected' && (
            <button
              className="admin-reject-button"
              onClick={() => onReject(id)}
            >
              <XCircle size={15} />
              Reject
            </button>
          )}

          <button
            className="admin-delete-button"
            onClick={deleteProperty}
            aria-label="Delete property"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}
