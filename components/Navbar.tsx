'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

 useEffect(() => {
  supabase.auth.getUser().then(async ({ data }) => {
    setUser(data.user)
    if (data.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()
      setProfile(prof)
    }
  })
  supabase.auth.onAuthStateChange(async (_, session) => {
    setUser(session?.user ?? null)
    if (session?.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()
      setProfile(prof)
    } else {
      setProfile(null)
    }
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
        borderBottom: '1px solid #f0f0f0',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '16px'
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
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
              color: '#111'
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'currentColor' }} />
            <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'currentColor' }} />
            <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'currentColor' }} />
          </button>

          <Link href="/" style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#111',
            textDecoration: 'none',
            letterSpacing: '-1px',
            fontFamily: "'Playfair Display', serif"
          }}>
            NewsAI
          </Link>
        </div>

        {/* Center links - desktop */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          {['Technology', 'Politics', 'Business', 'Sports', 'Health'].map(cat => (
            <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#555',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#111')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f5f5f5',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '6px 12px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#999" strokeWidth="2" strokeLinecap="round">
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
                color: '#111',
                fontSize: '13px',
                width: '140px',
              }}
            />
          </form>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  {profile?.full_name && (
    <span style={{
      fontSize: '13px',
      color: '#555',
      fontWeight: '500'
    }}>
      Hi, {profile.full_name.split(' ')[0]}!
    </span>
  )}
  <button onClick={handleLogout} style={{
    fontSize: '13px',
    fontWeight: '500',
    color: '#111',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '6px 16px',
    cursor: 'pointer',
  }}>
    Logout
  </button>
</div>
          ) : (
            <Link href="/login" style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff',
              background: '#111',
              textDecoration: 'none',
              padding: '7px 18px',
              borderRadius: '8px',
            }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {menuOpen && (
        <>
          <div style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            width: '260px',
            height: '100vh',
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            zIndex: 200,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#999',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 16px'
            }}>
              Categories
            </p>
            {['Technology', 'Sports', 'Business', 'Health', 'Politics', 'Entertainment', 'Science'].map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#111',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  display: 'block',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {cat}
              </Link>
            ))}

            <div style={{ marginTop: 'auto', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
              <Link href="/saved" onClick={() => setMenuOpen(false)} style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#111',
                textDecoration: 'none',
                padding: '10px 12px',
                display: 'block',
                borderRadius: '8px',
              }}>
                Saved Articles
              </Link>
              {user ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#111',
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}>
                  Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#111',
                  textDecoration: 'none',
                  padding: '10px 12px',
                  display: 'block',
                  borderRadius: '8px',
                }}>
                  Login
                </Link>
              )}
            </div>
          </div>

          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 199
          }} />
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}