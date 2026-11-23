
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Home,
  LockKeyhole,
  Mail,
  LogOut,
  Loader2,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  BadgeCheck,
  XCircle,
  TrendingUp,
  Menu,
  Building2,
} from 'lucide-react'

import {
  AdminPropertyList,
} from '../components/admin'

import {
  adminLogin,
  adminLogout,
  getCurrentUser,
  getAdminProperties,
  updateAdminProperty,
  deleteAdminProperty,
} from '../lib/appwrite'

import type { AdminProperty as APIAdminProperty } from '../lib/appwrite'
import type { Property } from '../types'

import './AdminPage.css'

export type PropertyStatus = 'Pending' | 'Published' | 'Rejected'
type DashboardTab =
  | 'overview'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'trends'

export interface AdminProperty extends Property {
  id?: string
  status: PropertyStatus
  createdAt?: string
  $createdAt?: string
}

function mapAdminProperty(
  property: APIAdminProperty
): AdminProperty {
  return {
    ...property,
    id: property.id,
    status:
      property.status === 'Approved'
        ? 'Published'
        : property.status,
  } as AdminProperty
}

interface AdminPageProps {
  properties?: AdminProperty[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onDelete?: (id: string) => void
  onBack: () => void
  t?: Record<string, string>
}

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pending', label: 'Awaiting Review', icon: Clock },
  { id: 'published', label: 'Published', icon: BadgeCheck },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
  { id: 'trends', label: 'Publication Trends', icon: TrendingUp },
] as const

export default function AdminPage({ onBack }: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function loadAdminProperties() {
    const result = await getAdminProperties()
    setProperties(result.map(mapAdminProperty))
  }

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const user = await getCurrentUser()

        if (!active) return

        if (user) {
          await loadAdminProperties()
          if (active) setAuthenticated(true)
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to verify administrator access.'
          )
        }
      } finally {
        if (active) setCheckingSession(false)
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  // Automatic logout after five minutes of inactivity
  useEffect(() => {
    if (!authenticated) return

    let timeoutId: number

    async function logoutAfterInactivity() {
      try {
        await adminLogout()
      } catch (error) {
        console.error('Automatic logout failed:', error)
      } finally {
        setAuthenticated(false)
        setProperties([])
        setSuccessMessage('Your session expired. Please sign in again.')
      }
    }

    function resetTimer() {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(
        logoutAfterInactivity,
        5 * 60 * 1000
      )
    }

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ]

    events.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer()

    return () => {
      window.clearTimeout(timeoutId)
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [authenticated])

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      await adminLogin(email.trim(), password)
      await loadAdminProperties()
      setAuthenticated(true)
      setPassword('')
      setSuccessMessage('Administrator login successful.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Login failed. Check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await adminLogout()
      setAuthenticated(false)
      setProperties([])
      setEmail('')
      setPassword('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to log out.'
      )
    }
  }

  async function refreshProperties() {
    await loadAdminProperties()
  }

  async function handleApprove(id: string) {
    setActionLoading(id)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await updateAdminProperty(id, 'Approved')
      await refreshProperties()
      setSuccessMessage('Property published successfully.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to approve property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await updateAdminProperty(id, 'Rejected')
      await refreshProperties()
      setSuccessMessage('Property rejected successfully.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to reject property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this property?'
    )

    if (!confirmed) return

    setActionLoading(id)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await deleteAdminProperty(id)
      await refreshProperties()
      setSuccessMessage('Property deleted successfully.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to delete property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  const pending = properties.filter(p => p.status === 'Pending')
  const published = properties.filter(p => p.status === 'Published')
  const rejected = properties.filter(p => p.status === 'Rejected')

  const total = properties.length

  const statusStats = [
    {
      id: 'pending' as const,
      label: 'Awaiting Review',
      count: pending.length,
      color: '#e7a33e',
      icon: Clock,
    },
    {
      id: 'published' as const,
      label: 'Published',
      count: published.length,
      color: '#20a36b',
      icon: BadgeCheck,
    },
    {
      id: 'rejected' as const,
      label: 'Rejected',
      count: rejected.length,
      color: '#dc5555',
      icon: XCircle,
    },
  ]

  const monthlyData = useMemo(() => {
    const now = new Date()

    return [0, 1, 2].map(monthOffset => {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset,
        1
      )

      const end = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset + 1,
        1
      )

      const count = properties.filter(property => {
        const dateValue =
          property.createdAt || property.$createdAt

        if (!dateValue) return false

        const date = new Date(dateValue)

        return date >= start && date < end
      }).length

      return {
        label: start.toLocaleDateString('en', {
          month: 'long',
          year: 'numeric',
        }),
        count,
      }
    }).reverse()
  }, [properties])

  const hasCreationDates = properties.some(
    p => p.createdAt || p.$createdAt
  )

  const messages = (
    <>
      {errorMessage && (
        <div role="alert" className="admin-message admin-error">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div role="status" className="admin-message admin-success">
          {successMessage}
        </div>
      )}
    </>
  )

  if (checkingSession) {
    return (
      <main className="admin-page">
        <div className="admin-empty">
          <Loader2 size={35} className="animate-spin" />
          <h3>Checking administrator access</h3>
          <p>Please wait...</p>
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="admin-page admin-login-page">
        <section className="admin-login-card">
          <div className="admin-login-icon">
            <ShieldCheck size={29} />
          </div>

          <span className="overline">PAKHOMO AFRICA</span>
          <h1>Administrator login</h1>
          <p>
            Sign in with your authorized administrator account
            to manage property submissions.
          </p>

          {messages}

          <form onSubmit={handleLogin}>
            <label htmlFor="admin-email">Administrator email</label>
            <div className="admin-input-wrap">
              <Mail size={18} />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button className="admin-login-button" type="submit" disabled={loading}>
              {loading ? <Loader2 size={18} /> : <ShieldCheck size={18} />}
              {loading ? 'Signing in...' : 'Sign in securely'}
            </button>
          </form>

          <button className="admin-back-button" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to website
          </button>
        </section>
      </main>
    )
  }

  const currentTab = navigation.find(item => item.id === activeTab)

  let visibleProperties: AdminProperty[] = []

  if (activeTab === 'pending') visibleProperties = pending
  if (activeTab === 'published') visibleProperties = published
  if (activeTab === 'rejected') visibleProperties = rejected

  function selectTab(tab: DashboardTab) {
    setActiveTab(tab)
    setSidebarOpen(false)
    setErrorMessage('')
    setSuccessMessage('')
  }

  return (
    <main className="admin-dashboard">

      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Building2 size={23} />
          </div>
          <div>
            <strong>PAKHOMO</strong>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.id}
                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => selectTab(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.id === 'pending' && pending.length > 0 && (
                  <small>{pending.length}</small>
                )}
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-secure-label">
            <ShieldCheck size={17} />
            <span>Secure admin session</span>
          </div>

          <button className="admin-sidebar-action" onClick={onBack}>
            <ArrowLeft size={17} />
            Back to website
          </button>

          <button className="admin-sidebar-action logout" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <section className="admin-main">

        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <span className="admin-topbar-label">PAKHOMO / ADMIN</span>
            <h1>{currentTab?.label || 'Overview'}</h1>
          </div>

          <div className="admin-topbar-status">
            <span />
            Administrator
          </div>
        </header>

        <div className="admin-content">
          {messages}

          {activeTab === 'overview' && (
            <>
              <div className="admin-welcome">
                <div>
                  <span className="overline">DASHBOARD OVERVIEW</span>
                  <h2>Marketplace at a glance</h2>
                  <p>Monitor and manage property submissions across Pakhomo.</p>
                </div>

                <div className="admin-total-card">
                  <Home size={20} />
                  <div>
                    <strong>{total}</strong>
                    <span>Total properties</span>
                  </div>
                </div>
              </div>

              <section className="admin-circle-grid">
                {statusStats.map(stat => {
                  const Icon = stat.icon
                  const percentage = total
                    ? Math.round((stat.count / total) * 100)
                    : 0

                  return (
                    <button
                      key={stat.id}
                      className="admin-circle-card"
                      onClick={() => selectTab(stat.id)}
                    >
                      <div
                        className="admin-status-circle"
                        style={{
                          background: `conic-gradient(${stat.color} ${percentage * 3.6}deg, #edf0f4 0deg)`,
                        }}
                      >
                        <div className="admin-circle-inner">
                          <strong>{stat.count}</strong>
                          <small>{percentage}%</small>
                        </div>
                      </div>

                      <div className="admin-circle-label">
                        <Icon size={17} style={{ color: stat.color }} />
                        <span>{stat.label}</span>
                      </div>
                    </button>
                  )
                })}
              </section>

              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Recent submissions</h2>
                    <p>Latest properties received by the platform.</p>
                  </div>
                  <button
                    className="admin-text-button"
                    onClick={() => selectTab('pending')}
                  >
                    Review pending
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="admin-empty">
                    <Home size={34} />
                    <h3>No property submissions yet</h3>
                    <p>New property submissions will appear here.</p>
                  </div>
                ) : (
                  <AdminPropertyList
                    properties={[...properties].slice(-5).reverse()}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                )}
              </section>
            </>
          )}

          {['pending', 'published', 'rejected'].includes(activeTab) && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>{currentTab?.label}</h2>
                  <p>
                    {activeTab === 'pending'
                      ? 'Review submissions and decide whether to publish them.'
                      : activeTab === 'published'
                      ? 'Properties currently approved for public display.'
                      : 'Properties that have not been approved.'}
                  </p>
                </div>

                <span className="trending-count">
                  {visibleProperties.length} properties
                </span>
              </div>

              {visibleProperties.length === 0 ? (
                <div className="admin-empty">
                  <Home size={34} />
                  <h3>No properties in this section</h3>
                  <p>There are currently no properties with this status.</p>
                </div>
              ) : (
                <AdminPropertyList
                  properties={visibleProperties}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              )}
            </section>
          )}

          {activeTab === 'trends' && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Publication trends</h2>
                  <p>Property submissions over the last three months.</p>
                </div>
                <TrendingUp size={24} />
              </div>

              {!hasCreationDates ? (
                <div className="admin-empty">
                  <TrendingUp size={34} />
                  <h3>Creation dates not available</h3>
                  <p>
                    The current property API does not provide confirmed
                    creation dates. We need to expose the Appwrite creation
                    timestamp before monthly statistics can be calculated.
                  </p>
                </div>
              ) : (
                <div className="admin-trend-list">
                  {monthlyData.map(month => (
                    <div className="admin-trend-row" key={month.label}>
                      <span>{month.label}</span>
                      <div className="admin-trend-track">
                        <div
                          className="admin-trend-fill"
                          style={{
                            width: `${Math.max(
                              2,
                              (month.count /
                                Math.max(1, ...monthlyData.map(m => m.count))) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                      <strong>{month.count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="admin-security-note">
            <ShieldCheck size={16} />
            Administrator session active. Property actions are saved
            directly to the Appwrite database.
          </div>
        </div>
      </section>

      {actionLoading && (
        <div className="admin-action-toast">
          <Loader2 size={17} />
          Processing property...
        </div>
      )}
    </main>
  )
}
