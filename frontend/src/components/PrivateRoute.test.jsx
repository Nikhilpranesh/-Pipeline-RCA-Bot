import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { AuthContext } from '../context/AuthContext'

describe('PrivateRoute', () => {
  it('redirects to login when user is not authenticated', () => {
    const mockAuthContext = {
      user: null,
      login: vi.fn(),
      logout: vi.fn()
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    )

    // Should redirect to login
    expect(window.location.pathname).toBe('/login')
  })

  it('renders children when user is authenticated', () => {
    const mockAuthContext = {
      user: { _id: '1', username: 'testuser', email: 'test@example.com' },
      login: vi.fn(),
      logout: vi.fn()
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
