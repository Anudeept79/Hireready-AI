import { useState, useEffect } from 'react';

export default function AtsScoreBadge({ score, items }) {
  const [displayScore, setDisplayScore] = useState(0);

  const color = score >= 90 ? '#00FF88' : score >= 74 ? '#FFB800' : '#FF4444';

  useEffect(() => {
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="anim-glow" style={{ display: 'inline-block', borderRadius: '50%' }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="38" fill="none" stroke="#2A2A2A" strokeWidth="6" />
          <circle
            cx="44" cy="44" r="38" fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 238.76} 238.76`}
            transform="rotate(-90 44 44)"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />
          <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize="22" fontWeight="500" fontFamily="Inter, system-ui">
            {displayScore}
          </text>
        </svg>
      </div>

      {score >= 94 ? (
        <p style={{ fontSize: 11, color: '#00FF88', marginTop: 4, fontFamily: 'Inter, system-ui' }}>
          Excellent — your resume will pass automated screening
        </p>
      ) : score >= 74 ? (
        <p style={{ fontSize: 11, color: '#FFB800', marginTop: 4, fontFamily: 'Inter, system-ui' }}>
          Good — add a job description to reach 94
        </p>
      ) : (
        <p style={{ fontSize: 11, color: '#FF4444', marginTop: 4, fontFamily: 'Inter, system-ui' }}>
          Needs improvement — fill all sections for a higher score
        </p>
      )}

      {/* Items list */}
      {items && (
        <div style={{ marginTop: 12, textAlign: 'left', maxWidth: 280, margin: '12px auto 0' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
            }}>
              <span style={{ fontSize: 12, color: item.pass ? '#00FF88' : '#FF4444' }}>
                {item.pass ? '✓' : '○'}
              </span>
              <span style={{
                fontSize: 11, fontFamily: 'Inter, system-ui',
                color: item.pass ? '#FFFFFF' : '#888888',
              }}>
                {item.label}
              </span>
              {item.note && (
                <span style={{ fontSize: 10, color: '#FFB800', fontFamily: 'Inter, system-ui', marginLeft: 'auto' }}>
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
