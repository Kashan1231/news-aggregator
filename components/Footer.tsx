import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)',
      marginTop: '4rem',
      padding: '3rem 2rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        marginBottom: '2rem'
      }}>

        {/* Brand */}
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: 'var(--color-text-primary)',
            margin: '0 0 8px'
          }}>NewsAI</h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            margin: 0
          }}>
            AI-powered news aggregator. Sentiment analysis, bias detection, and semantic search.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 12px'
          }}>Categories</h4>
          {['Technology', 'Sports', 'Business', 'Health'].map(cat => (
            <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              marginBottom: '8px'
            }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* More */}
        <div>
          <h4 style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 12px'
          }}>More</h4>
          {['Politics', 'Entertainment', 'Science'].map(cat => (
            <Link key={cat} href={`/?category=${cat.toLowerCase()}`} style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              marginBottom: '8px'
            }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Sources */}
        <div>
          <h4 style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 12px'
          }}>Sources</h4>
          {['NewsAPI', 'The Guardian', 'BBC News', 'CNBC'].map(s => (
            <p key={s} style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              margin: '0 0 8px'
            }}>{s}</p>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '0.5px solid var(--color-border-tertiary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0
        }}>
          © 2026 NewsAI. Built with Next.js + Supabase + AI.
        </p>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0
        }}>
          Powered by Groq + HuggingFace
        </p>
      </div>
    </footer>
  )
}