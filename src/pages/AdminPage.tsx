
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Home,
  LockKeyhole,
  Mail,
  LogOut,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

import {
  AdminStats,
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

function mapAdminProperty(
  property: APIAdminProperty
): AdminProperty {
  return {
    ...property,
    status:
      property.status === 'Approved'
        ? 'Published'
        : property.status,
  } as AdminProperty
}

export default function AdminPage({
  onBack,
}: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [properties, setProperties] = useState<AdminProperty[]>([])

  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // ==========================================
  // LOAD ADMINISTRATOR SESSION
  // ==========================================

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

          if (active) {
            setAuthenticated(true)
          }
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
        if (active) {
          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  // ==========================================
  // AUTOMATIC LOGOUT AFTER 2 MINUTES INACTIVE
  // ==========================================

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
        setEmail('')
        setPassword('')
        setSuccessMessage(
          'Your session expired after 2 minutes of inactivity. Please sign in again.'
        )
      }
    }

    function resetTimer() {
      window.clearTimeout(timeoutId)

      timeoutId = window.setTimeout(
        logoutAfterInactivity,
        5 * 60 * 1000
      )
    }

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ]

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      window.clearTimeout(timeoutId)

      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [authenticated])

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      await adminLogin(email.trim(), password)

      const result = await getAdminProperties()

      setProperties(result.map(mapAdminProperty))
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

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  async function handleLogout() {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await adminLogout()

      setAuthenticated(false)
      setProperties([])
      setEmail('')
      setPassword('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to log out.'
      )
    }
  }

  // ==========================================
  // REFRESH PROPERTY LIST
  // ==========================================

  async function refreshProperties() {
    const result = await getAdminProperties()

    setProperties(result.map(mapAdminProperty))
  }

  // ==========================================
  // APPROVE PROPERTY
  // ==========================================

  async function handleApprove(id: string) {
    setActionLoading(id)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await updateAdminProperty(id, 'Approved')

      await refreshProperties()

      setSuccessMessage('Property approved successfully.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to approve property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // ==========================================
  // REJECT PROPERTY
  // ==========================================

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
        error instanceof Error
          ? error.message
          : 'Unable to reject property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // ==========================================
  // DELETE PROPERTY
  // ==========================================

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
        error instanceof Error
          ? error.message
          : 'Unable to delete property.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const pending = properties.filter(
    property => property.status === 'Pending'
  )

  const published = properties.filter(
    property => property.status === 'Published'
  )

  const rejected = properties.filter(
    property => property.status === 'Rejected'
  )

  // ==========================================
  // SHARED MESSAGE DISPLAY
  // ==========================================

  const messages = (
    <>
      {errorMessage && (
        <div
          role="alert"
          style={{
            margin: '15px 0',
            padding: '13px 16px',
            borderRadius: 9,
            background: '#fff0f0',
            color: '#b42318',
            fontSize: 13,
          }}
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          style={{
            margin: '15px 0',
            padding: '13px 16px',
            borderRadius: 9,
            background: '#eaf8ef',
            color: '#18733c',
            fontSize: 13,
          }}
        >
          {successMessage}
        </div>
      )}
    </>
  )

  // ==========================================
  // SESSION CHECKING SCREEN
  // ==========================================

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

  // ==========================================
  // ADMIN LOGIN SCREEN
  // ==========================================

  if (!authenticated) {
    return (
      <main
        className="admin-page"
        style={{
          minHeight: '75vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <section
          style={{
            width: '100%',
            maxWidth: 430,
            padding: '32px 25px',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 16,
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div
            style={{
              width: 55,
              height: 55,
              display: 'grid',
              placeItems: 'center',
              marginBottom: 20,
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              borderRadius: 14,
            }}
          >
            <ShieldCheck size={29} />
          </div>

          <span className="overline">
            PAKHOMO AFRICA
          </span>

          <h1
            style={{
              margin: '10px 0',
              fontSize: 27,
              color: 'var(--text)',
            }}
          >
            Administrator login
          </h1>

          <p
            style={{
              marginBottom: 25,
              color: 'var(--text-light)',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Sign in with your authorized administrator
            account to manage property submissions.
          </p>

          {messages}

          <form onSubmit={handleLogin}>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Administrator email
            </label>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 13,
                  top: 14,
                  color: 'var(--text-light)',
                }}
              />

              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  minHeight: 46,
                  padding: '10px 12px 10px 42px',
                  border: '1px solid var(--border)',
                  borderRadius: 9,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative', marginBottom: 22 }}>
              <LockKeyhole
                size={18}
                style={{
                  position: 'absolute',
                  left: 13,
                  top: 14,
                  color: 'var(--text-light)',
                }}
              />

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  minHeight: 46,
                  padding: '10px 12px 10px 42px',
                  border: '1px solid var(--border)',
                  borderRadius: 9,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                color: '#fff',
                background: 'var(--primary)',
                border: 0,
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 750,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} />
                  Signing in...
                </>
              ) : (
                'Sign in securely'
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%',
              marginTop: 18,
              padding: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 7,
              color: 'var(--text-light)',
              background: 'transparent',
              border: 0,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Back to website
          </button>
        </section>
      </main>
    )
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================

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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            className="admin-header-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to website
          </button>

          <button
            type="button"
            className="admin-header-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      {messages}

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
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}

      </section>

      <div className="admin-security-note">
        <span>
          <ShieldCheck
            size={15}
            style={{ verticalAlign: 'middle', marginRight: 6 }}
          />
          Administrator session active. Property actions are saved
          directly to the Appwrite database.
        </span>
      </div>

      {actionLoading && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            color: '#fff',
            background: 'var(--primary)',
            borderRadius: 10,
            boxShadow: 'var(--shadow-soft)',
            zIndex: 1000,
            fontSize: 13,
          }}
        >
          <Loader2 size={17} />
          Processing property...
        </div>
      )}

    </main>
  )
}
