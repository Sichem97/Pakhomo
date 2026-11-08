
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  Clock,
  Eye,
  Home,
  MapPin,
  Trash2,
  XCircle,
} from 'lucide-react'

import type { Property } from '../types'

export type PropertyStatus = 'Pending' | 'Published' | 'Rejected'

export interface AdminProperty extends Property {
  status: PropertyStatus
}

interface AdminPageProps {
  properties: AdminProperty[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  onBack: () => void
  t: Record<string, string>
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

export default function AdminPage({
  properties,
  onApprove,
  onReject,
  onDelete,
  onBack,
  t,
}: AdminPageProps) {
  const pending = properties.filter(
    (property) => property.status === 'Pending'
  )

  const published = properties.filter(
    (property) => property.status === 'Published'
  )

  const rejected = properties.filter(
    (property) => property.status === 'Rejected'
  )

  const statusLabel = (status: PropertyStatus) => {
    switch (status) {
      case 'Pending':
        return 'Pending review'
      case 'Published':
        return 'Published'
      case 'Rejected':
        return 'Rejected'
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-heading">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back to website
        </button>

        <div>
          <span className="section-eyebrow">
            HABITAT AFRICA
          </span>
          <h1>Administration dashboard</h1>
          <p>
            Review property submissions and manage marketplace listings.
          </p>
        </div>
      </div>

      <section className="admin-stat-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-icon">
            <Home size={21} />
          </div>
          <span>Total submissions</span>
          <strong>{properties.length}</strong>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon pending-icon">
            <Clock size={21} />
          </div>
          <span>Awaiting review</span>
          <strong>{pending.length}</strong>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon published-icon">
            <BadgeCheck size={21} />
          </div>
          <span>Published</span>
          <strong>{published.length}</strong>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon rejected-icon">
            <XCircle size={21} />
          </div>
          <span>Rejected</span>
          <strong>{rejected.length}</strong>
        </article>
      </section>

      <section className="admin-listing-section">
        <div className="admin-section-heading">
          <div>
            <h2>Property submissions</h2>
            <p>
              Check each property before making it visible to the public.
            </p>
          </div>

          <span className="admin-total-count">
            {properties.length} properties
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="admin-empty-state">
            <Home size={35} />
            <h3>No property submissions yet</h3>
            <p>
              New property submissions will appear here for review.
            </p>
          </div>
        ) : (
          <div className="admin-property-list">
            {properties.map((property, index) => {
              const id = property.$id || property.title

              return (
                <article
                  className="admin-property-card"
                  key={`${id}-${index}`}
                >
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
                        {property.status === 'Pending' && (
                          <Clock size={13} />
                        )}
                        {property.status === 'Published' && (
                          <CheckCircle size={13} />
                        )}
                        {property.status === 'Rejected' && (
                          <XCircle size={13} />
                        )}
                        {statusLabel(property.status)}
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
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to delete this property?'
                            )
                          ) {
                            onDelete(id)
                          }
                        }}
                        aria-label="Delete property"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <p className="admin-demo-notice">
        Note: This is currently a frontend administration interface.
        Secure administrator authentication and permanent database
        actions will be connected later.
      </p>
    </main>
  )
}
