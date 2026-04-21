import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      {/* Newsletter Section */}
      <div style={{
        background: '#1a1a2e',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#fff',
            margin: '0 0 12px',
            letterSpacing: '-1px',
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.2'
          }}>
            Subscribe to our newsletter
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#888',
            margin: '0 0 2rem',
            lineHeight: '1.7'
          }}>
            Stay in the loop with AI-analyzed news, trending stories, and bias-free reporting.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '440px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button style={{
              padding: '12px 24px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{
        background: '#111',
        padding: '3rem 2rem 2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#fff',
              margin: '0 0 12px',
              fontFamily: "'Playfair Display', serif"
            }}>NewsAI</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', margin: 0 }}>
              AI-powered news with sentiment analysis, bias detection, and semantic search.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Categories</h4>
            {['Technology', 'Sports', 'Business', 'Health'].map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{ display: 'block', fontSize: '14px', color: '#888', textDecoration: 'none', marginBottom: '10px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>More</h4>
            {['Politics', 'Entertainment', 'Science'].map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{ display: 'block', fontSize: '14px', color: '#888', textDecoration: 'none', marginBottom: '10px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>Sources</h4>
            {['NewsAPI', 'The Guardian', 'BBC News', 'CNBC'].map(s => (
              <p key={s} style={{ fontSize: '14px', color: '#888', margin: '0 0 10px' }}>{s}</p>
            ))}
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #222',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
            © 2026 NewsAI. Built with Next.js + Supabase + AI.
          </p>
          <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
            Powered by Groq + HuggingFace
          </p>
        </div>
      </div>
    </footer>
  )
}