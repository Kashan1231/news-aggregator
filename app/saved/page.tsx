'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import NewsCard from '@/components/NewsCard'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SavedPage() {
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        loadSaved(data.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function loadSaved(userId: string) {
    setLoading(true)
    const res = await fetch(`/api/saved?user_id=${userId}`)
    const data = await res.json()
    setSaved(data.saved || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 4px'
        }}>
          Saved Articles
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: '0 0 2rem'
        }}>
          {saved.length} articles saved
        </p>

        {!user ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--color-text-secondary)'
          }}>
            <p style={{ fontSize: '16px' }}>Please login to see saved articles</p>
            <Link href="/login" style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '10px 24px',
              background: '#111',
              color: '#fff',
              borderRadius: 'var(--border-radius-md)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Login
            </Link>
          </div>
        ) : loading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        ) : saved.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--color-text-secondary)'
          }}>
            <p style={{ fontSize: '16px' }}>No saved articles yet</p>
            <Link href="/" style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '10px 24px',
              background: '#111',
              color: '#fff',
              borderRadius: 'var(--border-radius-md)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Browse News
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
           {saved.map((item: any) => (
     <NewsCard 
        key={item.id} 
        article={item.articles}
        initialSaved={true}
        onUnsave={() => loadSaved(user.id)}
  />
))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}