
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class AdminErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Unknown dashboard error',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Admin dashboard render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '70vh',
            padding: 24,
            background: '#fff',
            color: '#222',
          }}
        >
          <h1>Admin dashboard error</h1>
          <p>The dashboard could not be displayed.</p>

          <pre
            style={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
            }}
          >
            {this.state.message}
          </pre>

          <button
            type="button"
            onClick={() =>
              this.setState({
                hasError: false,
                message: '',
              })
            }
          >
            Try again
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
