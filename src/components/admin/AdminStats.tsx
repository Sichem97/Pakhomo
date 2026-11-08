
import {
  BadgeCheck,
  Clock,
  Home,
  XCircle,
} from 'lucide-react'

interface AdminStatsProps {
  total: number
  pending: number
  published: number
  rejected: number
}

export default function AdminStats({
  total,
  pending,
  published,
  rejected,
}: AdminStatsProps) {
  return (
    <section className="admin-stat-grid">
      <article className="admin-stat-card">
        <div className="admin-stat-icon">
          <Home size={21} />
        </div>
        <span>Total submissions</span>
        <strong>{total}</strong>
      </article>

      <article className="admin-stat-card">
        <div className="admin-stat-icon pending-icon">
          <Clock size={21} />
        </div>
        <span>Awaiting review</span>
        <strong>{pending}</strong>
      </article>

      <article className="admin-stat-card">
        <div className="admin-stat-icon published-icon">
          <BadgeCheck size={21} />
        </div>
        <span>Published</span>
        <strong>{published}</strong>
      </article>

      <article className="admin-stat-card">
        <div className="admin-stat-icon rejected-icon">
          <XCircle size={21} />
        </div>
        <span>Rejected</span>
        <strong>{rejected}</strong>
      </article>
    </section>
  )
}
