export default function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
    }}>
      {/* Image skeleton */}
      <div style={{
        width: '100%',
        height: '180px',
        background: 'var(--color-background-secondary)',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Badges skeleton */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[60, 80].map(w => (
            <div key={w} style={{
              height: '20px',
              width: `${w}px`,
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-background-secondary)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          ))}
        </div>

        {/* Title skeleton */}
        <div style={{
          height: '16px',
          width: '90%',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-secondary)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          height: '16px',
          width: '70%',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-secondary)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />

        {/* Description skeleton */}
        {[100, 85, 60].map(w => (
          <div key={w} style={{
            height: '12px',
            width: `${w}%`,
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-background-secondary)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        ))}

        {/* Footer skeleton */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '0.5px solid var(--color-border-tertiary)'
        }}>
          <div style={{ height: '12px', width: '80px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '12px', width: '60px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}