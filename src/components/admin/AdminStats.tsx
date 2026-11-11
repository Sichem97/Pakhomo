
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
    <section className="admin-stats">

      <article>
        <div className="stat-icon">
          <Home size={21} />
        </div>

        <div>
          <strong>{total}</strong>
          <small>Total submissions</small>
        </div>
      </article>

      <article>
        <div className="stat-icon pending-icon">
          <Clock size={21} />
        </div>

        <div>
          <strong>{pending}</strong>
          <small>Awaiting review</small>
        </div>
      </article>

      <article>
        <div className="stat-icon published-icon">
          <BadgeCheck size={21} />
        </div>

        <div>
          <strong>{published}</strong>
          <small>Published</small>
        </div>
      </article>

      <article>
        <div className="stat-icon rejected-icon">
          <XCircle size={21} />
        </div>

        <div>
          <strong>{rejected}</strong>
          <small>Rejected</small>
        </div>
      </article>

    </section>
  )
}
