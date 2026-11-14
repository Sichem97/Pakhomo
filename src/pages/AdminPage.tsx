import './AdminPage.css'
import { ArrowLeft, Home } from 'lucide-react'

import {
  AdminStats,
  AdminPropertyList,
} from '../components/admin'

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

export default function AdminPage({
  properties,
  onApprove,
  onReject,
  onDelete,
  onBack,
}: AdminPageProps) {
  const pending = properties.filter(
    property => property.status === 'Pending'
  )

  const published = properties.filter(
    property => property.status === 'Published'
  )

  const rejected = properties.filter(
    property => property.status === 'Rejected'
  )

  return (
    <main className="admin-page">

      <div className="admin-heading">
        <div>
          <span className="overline">
            PAKHOMO AFRICA
          </span>

          <h1>Administration dashboard</h1>

          <p>
            Review property submissions and manage marketplace listings.
          </p>
        </div>

        <button
          type="button"
          className="admin-header-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to website
        </button>
      </div>

      <AdminStats
        total={properties.length}
        pending={pending.length}
        published={published.length}
        rejected={rejected.length}
      />

      <section className="admin-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>Property submissions</h2>

            <p>
              Check each property before making it visible to the public.
            </p>
          </div>

          <span className="trending-count">
            {properties.length} properties
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="admin-empty">
            <Home size={35} />
            <h3>No property submissions yet</h3>
            <p>
              New property submissions will appear here for review.
            </p>
          </div>
        ) : (
          <AdminPropertyList
            properties={properties}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        )}

      </section>

      <div className="admin-security-note">
        <span>
          Note: This is currently a frontend administration interface.
          Secure administrator authentication and permanent database
          actions will be connected later.
        </span>
      </div>

    </main>
  )
}
