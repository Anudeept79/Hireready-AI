import { useEffect } from 'react';
import { haptic } from '../utils/haptics';

const MESSAGES = {
  AUTH_ERROR:    'API key issue — please contact support.',
  RATE_LIMIT:    'HireReady AI is very busy right now — please try again in 2 minutes. Your form data is saved.',
  PARSE_ERROR:   'Something went wrong formatting your resume — trying again will likely fix this.',
  INCOMPLETE:    'HireReady AI generated an incomplete response — please try again.',
  NETWORK:       'Lost connection — please check your internet and try again.',
  PAYMENT_FAIL:  'Payment did not go through — your resume is still here. Try again.',
  RAZORPAY_LOAD: 'Payment window could not load. Please disable your ad blocker and try again.',
  DEFAULT:       'Something went wrong — your form data is saved. Please try again.',
};

export default function ErrorScreen({ error, onRetry, retryLabel }) {
  useEffect(() => {
    haptic.error();
  }, []);

  const message = MESSAGES[error] || MESSAGES.DEFAULT;

  return (
    <div style={{ paddingTop: 48 }}>
      <div className="anim-shake" style={{
        background: '#141414',
        border: '0.5px solid #FF444440',
        borderRadius: 16,
        padding: 40,
        textAlign: 'center',
      }}>
        {/* Error icon */}
        <div style={{ marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#FF444420" stroke="#FF4444" strokeWidth="1.5" />
            <path d="M16 16l16 16M32 16L16 32" stroke="#FF4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 style={{
          fontSize: 18, fontWeight: 500, color: '#FFFFFF', marginBottom: 8,
          fontFamily: 'Inter, system-ui',
        }}>
          Oops, something went wrong
        </h2>

        <p style={{
          fontSize: 14, color: '#888888', lineHeight: 1.6, marginBottom: 32,
          fontFamily: 'Inter, system-ui', maxWidth: 360, margin: '0 auto 32px',
        }}>
          {message}
        </p>

        <button
          onClick={() => { haptic.tap(); onRetry(); }}
          style={{
            height: 52,
            padding: '0 32px',
            background: '#00C8FF',
            color: '#000',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1.02)'}
        >
          {retryLabel || 'Try again'}
        </button>
      </div>
    </div>
  );
}
