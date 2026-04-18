'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
      setSearch('')
    }
  }

  return (
    <>
      <nav style={{
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '0 1.5rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-background-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '12px'
      }}>

        {/* Left — Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
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

          <Link href="/" style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            letterSpacing: '-1px'
          }}>
            NewsAI
          </Link>
        </div>

        {/* Center — Search */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1a1a1a',
            border: '0.5px solid #333',
            borderRadius: 'var(--border-radius-lg)',
            padding: '7px 14px',
            flex: 1,
            maxWidth: '400px',
            minWidth: '120px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#888" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#fff',
              fontSize: '14px',
              width: '100%',
              minWidth: 0
            }}
          />
          {search && (
            <button type="button" onClick={() => setSearch('')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: 0, fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>
              ×
            </button>
          )}
        </form>

        {/* Right — Desktop only links */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
          {/* Desktop nav links - hidden on mobile */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
            className="desktop-nav">
            {['Technology', 'Sports', 'Business'].map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
              }}>
                {cat}
              </Link>
            ))}
          </div>

          {user ? (
            <button onClick={handleLogout} style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              background: 'none',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '5px 14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Logout
            </button>
          ) : (
            <Link href="/login" style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff',
              background: '#111',
              textDecoration: 'none',
              padding: '5px 14px',
              borderRadius: 'var(--border-radius-md)',
              whiteSpace: 'nowrap'
            }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar Menu */}
      {menuOpen && (
        <>
          <div style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            width: '260px',
            height: '100vh',
            background: 'var(--color-background-primary)',
            borderRight: '0.5px solid var(--color-border-tertiary)',
            zIndex: 200,
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto'
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 12px 12px'
            }}>
              Categories
            </p>
            {['Technology', 'Sports', 'Business', 'Health', 'Politics', 'Entertainment', 'Science'].map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'block'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {cat}
              </Link>
            ))}

            <div style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '0.5px solid var(--color-border-tertiary)'
            }}>
              <Link href="/saved" onClick={() => setMenuOpen(false)} style={{
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                padding: '10px 12px',
                display: 'block',
                borderRadius: 'var(--border-radius-md)',
              }}>
                Saved Articles
              </Link>

              {user ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderRadius: 'var(--border-radius-md)',
                }}>
                  Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  display: 'block',
                  borderRadius: 'var(--border-radius-md)',
                }}>
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Overlay */}
          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199
          }} />
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}