
import { useState } from 'react'

import {
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Trash2,
  XCircle,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Ruler,
} from 'lucide-react'

import type { Property } from '../../types'
import type { PropertyStatus } from '../../pages/AdminPage'

interface AdminPropertyCardProps {
  property: Property & {
    id?: string
    $id?: string
    status: PropertyStatus
    ownerName?: string
    ownerPhone?: string
    ownerEmail?: string
    countryCode?: string
    bedrooms?: number
    bathrooms?: number
    size?: number | string
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
  const [showDetails, setShowDetails] = useState(false)

  const id = property.id || property.$id
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
        <span className={`status-label status-${status.toLowerCase()}`}>
          {status === 'Pending' && <Clock size={13} />}
          {status === 'Published' && <CheckCircle size={13} />}
          {status === 'Rejected' && <XCircle size={13} />}

          {status === 'Pending' ? 'Pending review' : status}
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
                window.open(imageUrl, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            <Eye size={15} />
            View image
          </button>

          <button
            type="button"
            className="view-image-button"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {showDetails ? 'Hide Details' : 'View Details'}
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

        {showDetails && (
          <div className="admin-full-details">
            <h4>Property information</h4>

            <p><strong>Title:</strong> {title}</p>
            <p><strong>Description:</strong> {property.description || 'Not provided'}</p>
            <p><strong>Country:</strong> {property.countryCode || 'Not provided'}</p>
            <p><strong>City:</strong> {property.city || 'Not provided'}</p>
            <p><strong>Area:</strong> {property.area || 'Not provided'}</p>
            <p><strong>Property type:</strong> {property.type || 'Not provided'}</p>
            <p><strong>Listing type:</strong> {property.listingType || 'Not provided'}</p>
            <p><strong>Price:</strong> {formatPrice(property)}</p>

            <p>
              <BedDouble size={15} /> Bedrooms: {property.bedrooms ?? 'Not provided'}
            </p>

            <p>
              <Bath size={15} /> Bathrooms: {property.bathrooms ?? 'Not provided'}
            </p>

            <p>
              <Ruler size={15} /> Size: {property.size ?? 'Not provided'}
            </p>

            <p><strong>Status:</strong> {status}</p>

            <hr />

            <h4>Owner information</h4>

            <p>
              <User size={15} /> Name: {property.ownerName || 'Not provided'}
            </p>

            <p>
              <Phone size={15} /> Phone: {property.ownerPhone || 'Not provided'}
            </p>

            <p>
              <Mail size={15} /> Email: {property.ownerEmail || 'Not provided'}
            </p>

            {imageUrl && (
              <>
                <h4>Property photo</h4>
                <img
                  src={imageUrl}
                  alt="Full property"
                  className="admin-detail-image"
                />
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
