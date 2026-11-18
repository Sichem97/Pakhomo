
import {
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
  property: Property & {
    id?: string
    $id?: string
    status: PropertyStatus
  }
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
  // Always use the real Appwrite row ID.
  const id = property.id || property.$id

  return (
    <article className="admin-property">

      <img
        src={property.imageUrl}
        alt={property.title}
      />

      <div className="admin-property-details">

        <span className={`status-label status-${property.status.toLowerCase()}`}>
          {property.status === 'Pending' && <Clock size={13} />}
          {property.status === 'Published' && <CheckCircle size={13} />}
          {property.status === 'Rejected' && <XCircle size={13} />}

          {property.status === 'Pending'
            ? 'Pending review'
            : property.status}
        </span>

        <h3>{property.title}</h3>

        <p className="admin-location">
          <MapPin size={14} />
          {property.area}, {property.city}
        </p>

        <strong>{formatPrice(property)}</strong>

        <p>
          {property.type} · {property.listingType}
        </p>

        <p>{property.description}</p>

        <div className="admin-actions">

          <button
            type="button"
            className="view-image-button"
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
              type="button"
              className="approve-button"
              disabled={!id}
              onClick={() => id && onApprove(id)}
            >
              <CheckCircle size={15} />
              Approve
            </button>
          )}

          {property.status !== 'Rejected' && (
            <button
              type="button"
              className="reject-button"
              disabled={!id}
              onClick={() => id && onReject(id)}
            >
              <XCircle size={15} />
              Reject
            </button>
          )}

          <button
            type="button"
            className="delete-button"
            disabled={!id}
            onClick={() => id && onDelete(id)}
            aria-label="Delete property"
          >
            <Trash2 size={15} />
          </button>

        </div>
      </div>
    </article>
  )
}
