'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import NewsCard from '@/components/NewsCard'
import SkeletonCard from '@/components/SkeletonCard'
import Footer from '@/components/Footer'

const CATEGORIES = ['all', 'technology', 'sports', 'politics', 'business', 'health', 'entertainment', 'science']

function HomeContent() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [fetching, setFetching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
      setActiveCategory('all')
    } else if (cat) {
      setActiveCategory(cat)
      setSearchQuery('')
    } else {
      setActiveCategory('all')
      setSearchQuery('')
    }
  }, [searchParams])

  const loadArticles = useCallback(async () => {
    setLoading(true)
    try {
      let url = ''
      if (searchQuery) {
        url = `/api/search?q=${encodeURIComponent(searchQuery)}`
      } else if (activeCategory === 'all') {
        url = '/api/articles'
      } else {
        url = `/api/articles?category=${activeCategory}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [activeCategory, searchQuery])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  async function fetchFreshNews() {
    setFetching(true)
    await fetch('/api/fetch-news')
    await loadArticles()
    setFetching(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory === 'all'
                  ? "Today's News"
                  : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
              }
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0'
            }}>
              {searchQuery
                ? `${articles.length} articles found`
                : 'AI-analyzed • Sentiment & bias detected'
              }
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={fetchFreshNews}
              disabled={fetching}
              style={{
                opacity: fetching ? 0.6 : 1,
                background: '#111',
                color: '#fff',
                border: 'none',
                padding: '8px 20px',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {fetching ? 'Fetching...' : 'Refresh News'}
            </button>
          )}
        </div>

        {!searchQuery && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  border: activeCategory === cat
                    ? '0.5px solid var(--color-border-primary)'
                    : '0.5px solid var(--color-border-tertiary)',
                  background: activeCategory === cat
                    ? 'var(--color-background-secondary)'
                    : 'transparent',
                  color: activeCategory === cat
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--color-text-secondary)'
          }}>
            <p style={{ fontSize: '16px' }}>
              {searchQuery ? `No results for "${searchQuery}"` : 'No articles yet'}
            </p>
            <p style={{ fontSize: '14px' }}>
              {searchQuery ? 'Try different keywords' : 'Click "Refresh News" to fetch latest news'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {articles.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}