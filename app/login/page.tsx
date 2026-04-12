'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function validate() {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    if (!password) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background-tertiary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>

      {/* Logo */}
      <Link href="/" style={{
        fontSize: '32px',
        fontWeight: '700',
        color: 'var(--color-text-primary)',
        textDecoration: 'none',
        letterSpacing: '-1px',
        marginBottom: '2rem'
      }}>
        NewsAI
      </Link>

      {/* Card */}
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '440px',
        boxSizing: 'border-box'
      }}>

        {/* Title */}
        <h1 style={{
          fontSize: '26px',
          fontWeight: '500',
          color: 'var(--color-text-primary)',
          margin: '0 0 4px'
        }}>
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-text-secondary)',
          margin: '0 0 2rem'
        }}>
          {isSignup
            ? 'Sign up to save and personalize your news'
            : 'Sign in to access your saved articles'}
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--color-background-danger)',
            color: 'var(--color-text-danger)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '14px',
            marginBottom: '1.5rem',
            border: '0.5px solid var(--color-border-danger)'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div>
            <label style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Min. 6 characters"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {isSignup && (
              <p style={{
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
                margin: '4px 0 0'
              }}>
                Must be at least 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px'
            }}
          >
            {loading
              ? 'Please wait...'
              : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '1.5rem 0'
        }}>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border-tertiary)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border-tertiary)' }} />
        </div>

        {/* Toggle */}
        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          margin: 0
        }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignup(!isSignup); setError('') }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      {/* Back to home */}
      <Link href="/" style={{
        fontSize: '14px',
        fontWeight: '700',
        color: 'var(--color-text-tertiary)',
        textDecoration: 'none',
        marginTop: '1.5rem'
      }}>
        ← Back to NewsAI
      </Link>
    </div>
  )
}