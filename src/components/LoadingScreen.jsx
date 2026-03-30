import { useState, useEffect, useRef } from 'react';
import { SUCCESS_QUOTES, ATS_TIPS } from '../constants/quotes';

const STEPS = [
  'Analysing your experience and skills',
  'Matching keywords to job description',
  'Writing your ATS-optimised resume',
  'Crafting your personalised cover letter',
  'Building your LinkedIn About section',
  'Running final quality check',
];

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="#00FF88"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="100"
        style={{ animation: 'drawCheck 0.4s ease forwards' }}
      />
    </svg>
  );
}

export default function LoadingScreen({ generatedData, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [quoteFade, setQuoteFade] = useState(true);
  const [tipFade, setTipFade] = useState(true);
  const completedRef = useRef(false);

  // Step progression
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => {
        const next = s + 1;
        if (next >= 6) {
          clearInterval(timer);
          return 5;
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Completion check
  useEffect(() => {
    if (currentStep >= 5 && generatedData && !completedRef.current) {
      completedRef.current = true;
      setTimeout(() => onComplete(), 600);
    }
  }, [generatedData, currentStep, onComplete]);

  // Quote rotation with crossfade
  useEffect(() => {
    const q = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % SUCCESS_QUOTES.length);
        setQuoteFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(q);
  }, []);

  // Tip rotation with fade
  useEffect(() => {
    const t = setInterval(() => {
      setTipFade(false);
      setTimeout(() => {
        setTipIndex(i => (i + 1) % ATS_TIPS.length);
        setTipFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Slow message
  useEffect(() => {
    const slow = setTimeout(() => setShowSlowMessage(true), 20000);
    return () => clearTimeout(slow);
  }, []);

  const quote = SUCCESS_QUOTES[quoteIndex];

  return (
    <div style={{ paddingTop: 48, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      {/* Title */}
      <h2 className="anim-fadeIn" style={{
        fontSize: 15, fontWeight: 500, color: '#FFFFFF', marginBottom: 4, fontFamily: 'Inter, system-ui',
      }}>
        MyResumeAI is crafting your resume
      </h2>
      <p className="anim-fadeIn delay-1" style={{
        fontSize: 12, color: '#888888', marginBottom: 32, fontFamily: 'Inter, system-ui',
      }}>
        Sit back — your professional resume is being written right now
      </p>

      {/* Steps */}
      <div style={{ textAlign: 'left', marginBottom: 32 }}>
        {STEPS.map((label, i) => {
          const isDone = i < currentStep || (i === 5 && currentStep >= 5 && generatedData);
          const isActive = i === currentStep && !(i === 5 && generatedData);

          return (
            <div
              key={i}
              className={isActive ? 'anim-fadeIn' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                transition: 'opacity 0.3s',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: isDone ? '#00FF8820' : isActive ? '#00C8FF20' : '#1A1A1A',
                border: `1.5px solid ${isDone ? '#00FF88' : isActive ? '#00C8FF' : '#2A2A2A'}`,
              }}>
                {isDone ? (
                  <CheckIcon />
                ) : isActive ? (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#00C8FF',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ) : null}
              </div>

              {/* Text */}
              <span style={{
                fontSize: 13,
                fontFamily: 'Inter, system-ui',
                color: isDone ? '#00FF88' : isActive ? '#00C8FF' : '#333333',
                transition: 'color 0.3s',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quote card */}
      <div style={{
        background: '#141414',
        border: '0.5px solid #2A2A2A',
        borderRadius: 10,
        padding: '16px 20px',
        maxWidth: 340,
        margin: '0 auto 16px',
        opacity: quoteFade ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <p style={{
          fontSize: 12, color: '#AAAAAA', fontStyle: 'italic', lineHeight: 1.7,
          fontFamily: 'Inter, system-ui', marginBottom: 8,
        }}>
          "{quote.text}"
        </p>
        <p style={{ fontSize: 11, color: '#00C8FF', fontWeight: 500, fontFamily: 'Inter, system-ui' }}>
          {quote.name}
        </p>
        <p style={{ fontSize: 10, color: '#555555', fontFamily: 'Inter, system-ui' }}>
          {quote.role}
        </p>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 16 }}>
        {SUCCESS_QUOTES.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === quoteIndex ? '#00C8FF' : '#2A2A2A',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* ATS Tip bar */}
      <div style={{
        background: '#0D1F0D',
        border: '0.5px solid #00FF8830',
        borderRadius: 8,
        padding: '8px 14px',
        opacity: tipFade ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <p style={{
          fontSize: 11, color: '#00CC66', textAlign: 'center', fontFamily: 'Inter, system-ui',
        }}>
          {ATS_TIPS[tipIndex]}
        </p>
      </div>

      {/* Slow network message */}
      {showSlowMessage && (
        <p className="anim-fadeIn" style={{
          fontSize: 11, color: '#FFB800', marginTop: 16, fontFamily: 'Inter, system-ui',
        }}>
          Taking a bit longer than usual — MyResumeAI is working hard. Please don't close this tab.
        </p>
      )}
    </div>
  );
}
