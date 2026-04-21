'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function validate() {
    if (isSignup && !fullName.trim()) { setError('Full name is required'); return false }
    if (!email.trim()) { setError('Email is required'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return false }
    if (!password) { setError('Password is required'); return false }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return false }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)

    try {
      if (isSignup) {
        // Step 1: Signup
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        // Step 2: Profile banao
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName,
            username: email.split('@')[0]
          })
        }
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
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: '28px',
        fontWeight: '800',
        color: '#111',
        textDecoration: 'none',
        letterSpacing: '-1px',
        marginBottom: '2rem',
        fontFamily: "'Playfair Display', serif"
      }}>
        NewsAI
      </Link>

      {/* Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#111',
          margin: '0 0 6px',
          fontFamily: "'Playfair Display', serif"
        }}>
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#888',
          margin: '0 0 2rem',
          lineHeight: '1.5'
        }}>
          {isSignup ? 'Sign up to save and personalize your news' : 'Sign in to access your saved articles'}
        </p>

        {error && (
          <div style={{
            background: '#fff1f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Full Name - signup only */}
          {isSignup && (
            <div>
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
                display: 'block',
                marginBottom: '6px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError('') }}
                placeholder="Kashan Malik"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  background: '#fafafa',
                  color: '#111',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={e => (e.target.style.border = '1px solid #111')}
                onBlur={e => (e.target.style.border = '1px solid #e5e5e5')}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
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
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                background: '#fafafa',
                color: '#111',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={e => (e.target.style.border = '1px solid #111')}
              onBlur={e => (e.target.style.border = '1px solid #e5e5e5')}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
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
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                background: '#fafafa',
                color: '#111',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={e => (e.target.style.border = '1px solid #111')}
              onBlur={e => (e.target.style.border = '1px solid #e5e5e5')}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px'
            }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '1.5rem 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
          <span style={{ fontSize: '12px', color: '#bbb' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
        </div>

        <p style={{
          fontSize: '14px',
          color: '#888',
          textAlign: 'center',
          margin: 0
        }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignup(!isSignup); setError('') }}
            style={{
              background: 'none',
              border: 'none',
              color: '#111',
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

      <Link href="/" style={{
        fontSize: '13px',
        color: '#bbb',
        textDecoration: 'none',
        marginTop: '1.5rem'
      }}>
        ← Back to NewsAI
      </Link>
    </div>
  )
}