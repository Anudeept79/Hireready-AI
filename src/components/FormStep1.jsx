import { useEffect, useRef, useState } from 'react';
import { haptic } from '../utils/haptics';

const inputStyle = {
  width: '100%',
  height: 48,
  background: '#1A1A1A',
  border: '0.5px solid #2A2A2A',
  borderRadius: 8,
  padding: '0 16px',
  color: '#FFFFFF',
  fontSize: 14,
  fontFamily: 'Inter, system-ui',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const focusStyle = { borderColor: '#00C8FF', boxShadow: '0 0 0 3px #00C8FF30' };
const labelStyle = { fontSize: 13, color: '#FFFFFF', marginBottom: 6, display: 'block', fontFamily: 'Inter, system-ui' };
const errorStyle = { fontSize: 11, color: '#FF4444', marginTop: 4, fontFamily: 'Inter, system-ui', overflow: 'hidden', transition: 'max-height 0.2s ease, opacity 0.2s ease' };

export default function FormStep1({ formData, onChange, onNext, onBack }) {
  const firstRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => firstRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^(\+91[-\s]?)?[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) e.phone = 'Please enter a valid Indian mobile number';
    if (!formData.jobRole.trim()) e.jobRole = 'Job role is required';
    if (!formData.city.trim()) e.city = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    haptic.tap();
    if (validate()) onNext();
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', autoComplete: 'name', placeholder: 'e.g. Rahul Sharma', inputMode: 'text' },
    { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'e.g. rahul@email.com', inputMode: 'email' },
    { key: 'phone', label: 'Phone', type: 'text', autoComplete: 'tel', placeholder: 'e.g. 98765 43210', inputMode: 'tel' },
    { key: 'jobRole', label: 'Job Role Applying For', type: 'text', autoComplete: 'off', placeholder: 'e.g. Frontend Developer, Data Analyst, Product Manager', inputMode: 'text' },
    { key: 'city', label: 'City', type: 'text', autoComplete: 'off', placeholder: 'e.g. Hyderabad, Bangalore, Pune', inputMode: 'text' },
    { key: 'linkedinUrl', label: 'LinkedIn Profile (optional but recommended)', type: 'text', autoComplete: 'off', placeholder: 'e.g. linkedin.com/in/rahulsharma', inputMode: 'url', optional: true },
    { key: 'portfolioUrl', label: 'Portfolio or GitHub (optional)', type: 'text', autoComplete: 'off', placeholder: 'e.g. github.com/rahulsharma', inputMode: 'url', optional: true },
  ];

  return (
    <div className="form-card" style={{
      background: '#141414',
      border: '0.5px solid #2A2A2A',
      borderRadius: 16,
      marginTop: 16,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFF', marginBottom: 4, fontFamily: 'Inter, system-ui' }}>
        Tell us about you
      </h2>
      <p style={{ fontSize: 12, color: '#888888', marginBottom: 24, fontFamily: 'Inter, system-ui' }}>
        Step 1 of 3 — takes 30 seconds
      </p>

      {fields.map((f, i) => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>{f.label}</label>
          <input
            ref={i === 0 ? firstRef : undefined}
            type={f.type}
            autoComplete={f.autoComplete}
            inputMode={f.inputMode}
            placeholder={f.placeholder}
            value={formData[f.key]}
            onChange={e => onChange(f.key, e.target.value)}
            onFocus={() => setFocused(f.key)}
            onBlur={() => setFocused(null)}
            style={{
              ...inputStyle,
              ...(focused === f.key ? focusStyle : {}),
              ...(errors[f.key] ? { borderColor: '#FF4444' } : {}),
            }}
          />
          {errors[f.key] && (
            <p style={{ ...errorStyle, maxHeight: 20, opacity: 1 }}>{errors[f.key]}</p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          height: 52,
          background: '#00C8FF',
          color: '#000000',
          fontSize: 15,
          fontWeight: 500,
          fontFamily: 'Inter, system-ui',
          border: 'none',
          borderRadius: 10,
          cursor: 'pointer',
          marginTop: 8,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1.02)'}
      >
        Continue — Add your experience →
      </button>

      <button
        onClick={() => { haptic.tap(); onBack(); }}
        style={{
          width: '100%',
          height: 44,
          background: 'transparent',
          color: '#888888',
          fontSize: 13,
          fontFamily: 'Inter, system-ui',
          border: 'none',
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        ← Back to home
      </button>
    </div>
  );
}
