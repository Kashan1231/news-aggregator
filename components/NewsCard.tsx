'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Article = {
  id: string
  title: string
  description: string
  url: string
  image_url: string
  source: string
  category: string
  sentiment: string
  bias_score: string
  published_at: string
}

export default function NewsCard({
  article,
  initialSaved = false,
  onUnsave
}: {
  article: Article
  initialSaved?: boolean
  onUnsave?: () => void
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) { window.location.href = '/login'; return }
    if (loading) return
    setLoading(true)
    try {
      if (saved) {
        await fetch('/api/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, article_id: article.id })
        })
        setSaved(false)
        if (onUnsave) onUnsave()
      } else {
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, article_id: article.id })
        })
        setSaved(true)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (!article) return null

  const categoryColors: Record<string, string> = {
    technology: '#2563eb',
    sports: '#16a34a',
    politics: '#dc2626',
    business: '#d97706',
    health: '#0891b2',
    entertainment: '#9333ea',
    science: '#0d9488',
    general: '#555'
  }

  return (
    <div
      onClick={() => window.open(article.url, '_blank')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Image */}
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          background: '#f5f5f5',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ccc',
          fontSize: '32px'
        }}>
          📰
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Category */}
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: categoryColors[article.category] || '#555',
          textTransform: 'capitalize'
        }}>
          {article.category}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#111',
          margin: 0,
          lineHeight: '1.4',
          letterSpacing: '-0.3px',
          fontFamily: "'Playfair Display', serif"
        }}>
          {article.title?.replace(/\s-\s[^-]+$/, '')}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: '#777',
          margin: 0,
          lineHeight: '1.6',
        }}>
          {article.description?.slice(0, 100)}...
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              {article.source?.charAt(0) || 'N'}
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {article.source?.replace(' English', '')} • {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <button
            onClick={toggleSave}
            disabled={loading}
            style={{
              background: saved ? '#111' : '#f5f5f5',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: saved ? '#fff' : '#555',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '...' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>

        {/* Sentiment + Bias badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '100px',
            background: article.sentiment === 'positive' ? '#f0fdf4' : article.sentiment === 'negative' ? '#fff1f2' : '#f5f5f5',
            color: article.sentiment === 'positive' ? '#16a34a' : article.sentiment === 'negative' ? '#dc2626' : '#777',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {article.sentiment}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '100px',
            background: '#f5f5f5',
            color: article.bias_score === 'high' ? '#dc2626' : article.bias_score === 'medium' ? '#d97706' : '#16a34a',
            fontWeight: '500'
          }}>
            Bias: {article.bias_score}
          </span>
        </div>
      </div>
    </div>
  )
}