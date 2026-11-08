
import type { Property } from '../../types'
import type { PropertyStatus } from '../../pages/AdminPage'

import AdminPropertyCard from './AdminPropertyCard'

interface AdminPropertyListProps {
  properties: (Property & { status: PropertyStatus })[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}

export default function AdminPropertyList({
  properties,
  onApprove,
  onReject,
  onDelete,
}: AdminPropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>No property submissions yet</h3>
        <p>
          New property submissions will appear here for review.
        </p>
      </div>
    )
  }

  return (
    <div className="admin-property-list">
      {properties.map((property, index) => (
        <AdminPropertyCard
          key={`${property.$id || property.title}-${index}`}
          property={property}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
