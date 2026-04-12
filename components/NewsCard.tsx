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

  const sentimentColor: Record<string, string> = {
    positive: '#639922',
    negative: '#A32D2D',
    neutral: '#5F5E5A'
  }

  const biasColor: Record<string, string> = {
    low: '#639922',
    medium: '#BA7517',
    high: '#A32D2D'
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) {
      window.location.href = '/login'
      return
    }
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
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (!article) return null

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.2s',
      cursor: 'pointer',
      position: 'relative'
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-primary)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-tertiary)')}
      onClick={() => window.open(article.url, '_blank')}
    >
      {/* Save Button */}
      <button
        onClick={toggleSave}
        disabled={loading}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: saved ? '#111' : 'rgba(255,255,255,0.9)',
          border: '0.5px solid var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          color: saved ? '#fff' : 'var(--color-text-primary)',
          zIndex: 10,
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '...' : saved ? 'Unsave' : 'Save'}
      </button>

      {/* Image */}
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {article.category && (
            <span style={{
              fontSize: '11px',
              padding: '2px 10px',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-background-info)',
              color: 'var(--color-text-info)',
              textTransform: 'capitalize'
            }}>
              {article.category}
            </span>
          )}
          {article.sentiment && (
            <span style={{
              fontSize: '11px',
              padding: '2px 10px',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-background-secondary)',
              color: sentimentColor[article.sentiment] || 'var(--color-text-secondary)',
              textTransform: 'capitalize'
            }}>
              {article.sentiment}
            </span>
          )}
          {article.bias_score && (
            <span style={{
              fontSize: '11px',
              padding: '2px 10px',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-background-secondary)',
              color: biasColor[article.bias_score] || 'var(--color-text-secondary)',
              textTransform: 'capitalize'
            }}>
              Bias: {article.bias_score}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '15px',
          fontWeight: '500',
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: '1.4'
        }}>
          {article.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: '1.6',
          flex: 1
        }}>
          {article.description?.slice(0, 120)}...
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '0.5px solid var(--color-border-tertiary)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            {article.source}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}