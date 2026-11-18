
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
  const price = Number(property.price) || 0

  return (
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(price) +
    ' ' +
    (property.currency || 'USD')
  )
}

export default function AdminPropertyCard({
  property,
  onApprove,
  onReject,
  onDelete,
}: AdminPropertyCardProps) {
  // Use the actual Appwrite document ID.
  const id = property.id || property.$id

  // Protect the component when a property has no status.
  const status: PropertyStatus = property.status || 'Pending'

  const title = property.title || 'Untitled property'
  const imageUrl = property.imageUrl || ''

  return (
    <article className="admin-property">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="admin-image-placeholder">
          Image unavailable
        </div>
      )}

      <div className="admin-property-details">

        <span
          className={`status-label status-${status.toLowerCase()}`}
        >
          {status === 'Pending' && <Clock size={13} />}
          {status === 'Published' && <CheckCircle size={13} />}
          {status === 'Rejected' && <XCircle size={13} />}

          {status === 'Pending'
            ? 'Pending review'
            : status}
        </span>

        <h3>{title}</h3>

        <p className="admin-location">
          <MapPin size={14} />
          {property.area || 'Unknown area'},{' '}
          {property.city || 'Unknown city'}
        </p>

        <strong>{formatPrice(property)}</strong>

        <p>
          {property.type || 'Property'} ·{' '}
          {property.listingType || 'Listing'}
        </p>

        <p>
          {property.description || 'No description provided.'}
        </p>

        <div className="admin-actions">

          <button
            type="button"
            className="view-image-button"
            disabled={!imageUrl}
            onClick={() => {
              if (imageUrl) {
                window.open(
                  imageUrl,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            }}
          >
            <Eye size={15} />
            View image
          </button>

          {status !== 'Published' && (
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

          {status !== 'Rejected' && (
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
