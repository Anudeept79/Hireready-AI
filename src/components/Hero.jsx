import { useState, useEffect } from 'react';
import { haptic } from '../utils/haptics';
import SampleResume from './SampleResume';

export default function Hero({ onStart }) {
  const [count, setCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: 48, textAlign: 'center' }}>
      {/* Pill */}
      <div className="anim-fadeInUp delay-1" style={{ opacity: 0, marginBottom: 24 }}>
        <span style={{
          border: '0.5px solid #2A2A2A',
          color: '#888888',
          fontSize: 12,
          padding: '6px 14px',
          borderRadius: 20,
          fontFamily: 'Inter, system-ui',
        }}>
          Built for every job seeker
        </span>
      </div>

      {/* H1 */}
      <h1 className="anim-fadeInUp delay-2 hero-heading" style={{
        opacity: 0,
        fontWeight: 500,
        color: '#FFFFFF',
        lineHeight: 1.2,
        fontFamily: 'Inter, system-ui',
        marginBottom: 16,
      }}>
        Get your dream job. Start with the right resume.
      </h1>

      {/* Subtitle */}
      <p className="anim-fadeInUp delay-3" style={{
        opacity: 0,
        fontSize: 16,
        color: '#888888',
        marginBottom: 16,
        fontFamily: 'Inter, system-ui',
      }}>
        Get a professional, ATS-optimised resume written for you in 60 seconds — no experience needed.
      </p>

      {/* Live counter */}
      <p className="anim-fadeInUp delay-3" style={{
        opacity: 0,
        fontSize: 13,
        color: '#00FF88',
        marginBottom: 24,
        fontFamily: 'Inter, system-ui',
      }}>
        {count.toLocaleString()} resumes created today
      </p>

      {/* Trust pills */}
      <div className="anim-fadeInUp delay-4" style={{
        opacity: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        {['ATS Optimised', 'India Format', 'Free to try', 'No signup'].map(label => (
          <span key={label} style={{
            border: '0.5px solid #2A2A2A',
            color: '#888888',
            fontSize: 11,
            padding: '4px 12px',
            borderRadius: 20,
            fontFamily: 'Inter, system-ui',
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* CTA button */}
      <div className="anim-fadeInUp delay-5" style={{ opacity: 0, marginBottom: 40 }}>
        <button
          className="cta-button"
          onClick={() => { haptic.tap(); onStart(); }}
          style={{
            background: '#00C8FF',
            color: '#000000',
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            border: 'none',
            borderRadius: 10,
            height: 52,
            width: '100%',
            maxWidth: 280,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1.02)'}
        >
          Build my resume free →
        </button>
      </div>

      {/* Sample resume label + component */}
      <div className="anim-fadeInUp delay-6" style={{ opacity: 0 }}>
        <p style={{
          fontSize: 12,
          color: '#888888',
          marginBottom: 12,
          fontFamily: 'Inter, system-ui',
        }}>
          This is what your resume will look like:
        </p>
        <SampleResume onClick={onStart} />
      </div>
    </div>
  );
}
