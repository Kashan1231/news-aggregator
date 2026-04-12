'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => setUser(data.user))
  supabase.auth.onAuthStateChange((_, session) => {
    setUser(session?.user ?? null)
  })
}, [])

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <>
      <nav style={{
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-background-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>

        {/* Left — Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              color: 'var(--color-text-primary)'
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
          </button>

          {/* Logo */}
          <Link href="/" style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            letterSpacing: '-1px'
          }}>
            NewsAI
          </Link>
        </div>

        {/* Center — Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1a1a1a',
            border: '0.5px solid #333',
            borderRadius: 'var(--border-radius-lg)',
            padding: '8px 16px',
            width: '340px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#888" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#fff',
              fontSize: '14px',
              width: '100%',
            }}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#888',
                padding: 0,
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          )}
        </form>

        {/* Right — Nav Links */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {['Technology', 'Sports', 'Business', 'Health'].map(cat => (
            <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              {cat}
            </Link>
          ))}
          <Link href="/saved" style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            padding: '6px 16px',
            border: '0.5px solid var(--color-border-primary)',
            borderRadius: 'var(--border-radius-md)',
          }}>
            Saved
          </Link>

          {user ? (
  <button
    onClick={handleLogout}
    style={{
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--color-text-primary)',
      background: 'none',
      border: '0.5px solid var(--color-border-secondary)',
      borderRadius: 'var(--border-radius-md)',
      padding: '6px 16px',
      cursor: 'pointer'
    }}
  >
    Logout
  </button>
) : (
  <Link href="/login" style={{
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    background: '#111',
    textDecoration: 'none',
    padding: '6px 16px',
    borderRadius: 'var(--border-radius-md)',
  }}>
    Login
  </Link>
)}
        </div>
      </nav>

      {/* Hamburger Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          width: '280px',
          height: '100vh',
          background: 'var(--color-background-primary)',
          borderRight: '0.5px solid var(--color-border-tertiary)',
          zIndex: 99,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Categories
          </p>
          {['Technology', 'Sports', 'Business', 'Health', 'Politics', 'Entertainment', 'Science'].map(cat => (
            <Link
              key={cat}
              href={`/?category=${cat.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                padding: '10px 12px',
                borderRadius: 'var(--border-radius-md)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {cat}
            </Link>
          ))}

          <div style={{
            marginTop: 'auto',
            borderTop: '0.5px solid var(--color-border-tertiary)',
            paddingTop: '1rem'
          }}>
            <Link href="/saved" onClick={() => setMenuOpen(false)} style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '10px 12px',
              display: 'block',
              borderRadius: 'var(--border-radius-md)',
            }}>
              Saved Articles
            </Link>
          </div>
        </div>
      )}

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 98
          }}
        />
      )}
    </>
  )
}