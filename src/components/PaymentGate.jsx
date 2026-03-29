import { useState, useEffect } from 'react';
import { haptic } from '../utils/haptics';

export default function PaymentGate({ onPay, onBack, isProcessing, paymentError }) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (paymentError) {
      const id = requestAnimationFrame(() => setShaking(true));
      haptic.error();
      const t = setTimeout(() => setShaking(false), 400);
      return () => { cancelAnimationFrame(id); clearTimeout(t); };
    }
  }, [paymentError]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      <div
        className={shaking ? 'anim-shake' : ''}
        style={{
          background: '#141414',
          borderRadius: '20px 20px 0 0',
          padding: '32px 24px 48px',
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Handle bar */}
        <div style={{
          width: 32, height: 4, background: '#2A2A2A', borderRadius: 2,
          margin: '0 auto 24px',
        }} />

        {/* Lock icon */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 20, fontWeight: 500, color: '#FFFFFF', textAlign: 'center', marginBottom: 8, fontFamily: 'Inter, system-ui' }}>
          Download your resume
        </h2>

        {/* Subtitle */}
        <p style={{ fontSize: 14, color: '#888888', textAlign: 'center', marginBottom: 24, lineHeight: 1.6, fontFamily: 'Inter, system-ui' }}>
          Your resume, cover letter and LinkedIn profile are ready. One payment, download all three instantly.
        </p>

        {/* Price */}
        <p style={{ fontSize: 44, fontWeight: 500, color: '#00FF88', textAlign: 'center', marginBottom: 4, fontFamily: 'Inter, system-ui' }}>
          ₹49
        </p>
        <p style={{ fontSize: 11, color: '#444444', textAlign: 'center', marginBottom: 24, fontFamily: 'Inter, system-ui' }}>
          One-time payment. No subscription. No hidden charges.
        </p>

        {/* Payment error */}
        {paymentError && paymentError !== 'PAYMENT_CANCELLED' && (
          <div style={{
            background: '#1F0D0D',
            border: '0.5px solid #FF444430',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 12,
            color: '#FF4444',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui',
          }}>
            {paymentError === 'PAYMENT_FAIL' ? 'Payment did not go through — your resume is still here. Try again.' :
             paymentError === 'RAZORPAY_LOAD' ? 'Payment window could not load. Please disable your ad blocker and try again.' :
             'Something went wrong — please try again.'}
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={() => { haptic.tap(); onPay(); }}
          disabled={isProcessing}
          style={{
            width: '100%',
            height: 56,
            background: isProcessing ? '#00C8FF80' : '#00C8FF',
            color: '#000',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            border: 'none',
            borderRadius: 10,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => !isProcessing && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => !isProcessing && (e.currentTarget.style.transform = 'scale(1)')}
          onMouseDown={e => !isProcessing && (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => !isProcessing && (e.currentTarget.style.transform = 'scale(1.02)')}
        >
          {isProcessing && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="3" strokeDasharray="31 31" strokeLinecap="round" />
            </svg>
          )}
          Pay ₹49 — UPI / Card / Netbanking
        </button>

        {/* Back link */}
        <button
          onClick={onBack}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#888888',
            fontSize: 13,
            fontFamily: 'Inter, system-ui',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: 16,
          }}
        >
          Review my resume again
        </button>

        {/* Trust footer */}
        <p style={{ fontSize: 11, color: '#444444', textAlign: 'center', fontFamily: 'Inter, system-ui' }}>
          Secured by Razorpay • ₹49 one-time payment
        </p>
      </div>
    </div>
  );
}
