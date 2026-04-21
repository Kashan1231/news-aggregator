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

  const featuredArticle = articles[0]
  const restArticles = articles.slice(1)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Hero Section */}
        {!searchQuery && activeCategory === 'all' && (
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '3rem' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#2563eb',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              AI-Powered News
            </span>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '800',
              color: '#111',
              margin: '12px 0 16px',
              lineHeight: '1.15',
              letterSpacing: '-2px',
              fontFamily: "'Playfair Display', serif"
            }}>
              Insights and trends shaping<br />the world today
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '520px',
              margin: '0 auto 2rem',
              lineHeight: '1.7'
            }}>
              Stay informed with AI-analyzed news — sentiment detection, bias scoring, and semantic search.
            </p>
            <button
              onClick={fetchFreshNews}
              disabled={fetching}
              style={{
                padding: '12px 28px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: fetching ? 'not-allowed' : 'pointer',
                opacity: fetching ? 0.7 : 1
              }}
            >
              {fetching ? 'Fetching...' : 'Refresh News'}
            </button>
          </div>
        )}

        {/* Search/Category Header */}
        {(searchQuery || activeCategory !== 'all') && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#111',
              margin: '0 0 4px',
              fontFamily: "'Playfair Display', serif"
            }}>
              {searchQuery ? `Results for "${searchQuery}"` : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
              {searchQuery ? `${articles.length} articles found` : 'AI-analyzed • Sentiment & bias detected'}
            </p>
          </div>
        )}

        {/* Category Filter */}
        {!searchQuery && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '100px',
                  border: activeCategory === cat ? '1.5px solid #111' : '1px solid #e5e5e5',
                  background: activeCategory === cat ? '#111' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#555',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <>
            {/* Featured skeleton */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{ height: '300px', background: '#f5f5f5', borderRadius: '12px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                <div style={{ height: '16px', width: '30%', background: '#f5f5f5', borderRadius: '4px' }} />
                <div style={{ height: '32px', width: '90%', background: '#f5f5f5', borderRadius: '4px' }} />
                <div style={{ height: '32px', width: '70%', background: '#f5f5f5', borderRadius: '4px' }} />
                <div style={{ height: '16px', width: '100%', background: '#f5f5f5', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#888' }}>
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>No articles found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              {searchQuery ? 'Try different keywords' : 'Click "Refresh News" to fetch latest news'}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && !searchQuery && activeCategory === 'all' && (
              <div
                onClick={() => window.open(featuredArticle.url, '_blank')}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2.5rem',
                  marginBottom: '3rem',
                  paddingBottom: '3rem',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
              >
                {featuredArticle.image_url && (
                  <img
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#2563eb',
                    textTransform: 'capitalize'
                  }}>
                    {featuredArticle.category}
                  </span>
                  <h2 style={{
                    fontSize: 'clamp(22px, 2.5vw, 32px)',
                    fontWeight: '700',
                    color: '#111',
                    margin: 0,
                    lineHeight: '1.25',
                    letterSpacing: '-0.5px',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {featuredArticle.title}
                  </h2>
                  <p style={{
                    fontSize: '15px',
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.7'
                  }}>
                    {featuredArticle.description?.slice(0, 150)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {featuredArticle.source?.charAt(0) || 'N'}
                    </div>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                      {featuredArticle.source} • {new Date(featuredArticle.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: featuredArticle.sentiment === 'positive' ? '#f0fdf4' : featuredArticle.sentiment === 'negative' ? '#fff1f2' : '#f5f5f5',
                      color: featuredArticle.sentiment === 'positive' ? '#16a34a' : featuredArticle.sentiment === 'negative' ? '#dc2626' : '#555',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {featuredArticle.sentiment}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: '#f5f5f5',
                      color: featuredArticle.bias_score === 'high' ? '#dc2626' : featuredArticle.bias_score === 'medium' ? '#d97706' : '#16a34a',
                      fontWeight: '500'
                    }}>
                      Bias: {featuredArticle.bias_score}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Section Header */}
            {!searchQuery && activeCategory === 'all' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Articles
                </span>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111',
                  margin: '8px 0 0',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Check out the latest news
                </h3>
              </div>
            )}

            {/* Articles Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {(activeCategory === 'all' && !searchQuery ? restArticles : articles).map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff' }} />}>
      <HomeContent />
    </Suspense>
  )
}