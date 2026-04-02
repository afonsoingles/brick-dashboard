import React, { Component, createContext, useContext, useState, useCallback } from 'react'
import ErrorPage from '../pages/ErrorPage'

// Context for triggering error display from anywhere (e.g., API interceptors)
interface ErrorOverlayContextType {
  showError: () => void
}

const ErrorOverlayContext = createContext<ErrorOverlayContextType>({ showError: () => {} })

export function useErrorOverlay() {
  return useContext(ErrorOverlayContext)
}

// Global setter so the API interceptor can trigger the error overlay without React hooks
let globalShowError: (() => void) | null = null

export function triggerGlobalError() {
  if (globalShowError) {
    globalShowError()
  }
}

// Provider that wraps the app and can show ErrorPage as an overlay
export function ErrorOverlayProvider({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  const showError = useCallback(() => {
    setHasError(true)
  }, [])

  // Register global setter
  globalShowError = showError

  if (hasError) {
    return <ErrorPage />
  }

  return (
    <ErrorOverlayContext.Provider value={{ showError }}>
      {children}
    </ErrorOverlayContext.Provider>
  )
}

// Class-based error boundary for catching render errors
interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }

    return this.props.children
  }
}
