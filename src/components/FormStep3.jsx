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

const textareaStyle = {
  ...inputStyle,
  height: 'auto',
  padding: '12px 16px',
  resize: 'vertical',
  lineHeight: 1.5,
};

const focusRing = { borderColor: '#00C8FF', boxShadow: '0 0 0 3px #00C8FF30' };
const labelStyle = { fontSize: 13, color: '#FFFFFF', marginBottom: 6, display: 'block', fontFamily: 'Inter, system-ui' };
const errorTextStyle = { fontSize: 11, color: '#FF4444', marginTop: 4, fontFamily: 'Inter, system-ui' };

const SUGGESTIONS = {
  'frontend': ['React.js', 'JavaScript', 'HTML/CSS', 'TypeScript'],
  'backend': ['Node.js', 'Python', 'Java', 'SQL'],
  'data': ['Python', 'SQL', 'Excel', 'Power BI'],
  'product': ['User Research', 'Wireframing', 'Jira', 'SQL'],
  'default': ['Communication', 'Problem Solving', 'Excel', 'Git'],
};

function getSuggestions(jobRole) {
  const lower = (jobRole || '').toLowerCase();
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui')) return SUGGESTIONS.frontend;
  if (lower.includes('backend') || lower.includes('node') || lower.includes('java')) return SUGGESTIONS.backend;
  if (lower.includes('data') || lower.includes('analyst')) return SUGGESTIONS.data;
  if (lower.includes('product') || lower.includes('manager')) return SUGGESTIONS.product;
  return SUGGESTIONS.default;
}

export default function FormStep3({ formData, onChange, addTag, removeTag, onBack, onGenerate, isLoading }) {
  const skillInputRef = useRef(null);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => skillInputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  // Generate button pulse on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setPulsed(true));
    const t = setTimeout(() => setPulsed(false), 600);
    return () => { cancelAnimationFrame(id); clearTimeout(t); };
  }, []);

  const commitSkill = (val) => {
    const tag = (val || skillInput).trim().replace(/,/g, '');
    if (tag) {
      addTag(tag);
      haptic.tap();
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      commitSkill();
    } else if (e.key === 'Tab' && skillInput.trim()) {
      e.preventDefault();
      commitSkill();
    } else if (e.key === 'Backspace' && !skillInput && formData.skillTags.length > 0) {
      removeTag(formData.skillTags[formData.skillTags.length - 1]);
      haptic.tap();
    }
  };

  // Handle comma typed on Android (onChange fires instead of onKeyDown)
  const handleSkillChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      val.split(',').forEach(part => {
        const tag = part.trim();
        if (tag) addTag(tag);
      });
      setSkillInput('');
      haptic.tap();
    } else {
      setSkillInput(val);
    }
  };

  const validate = () => {
    const e = {};
    if (formData.skillTags.length === 0 && !formData.skills?.trim()) e.skills = 'Please add at least one skill';
    if (!formData.education.trim()) e.education = 'Please add your education details';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    haptic.tap();
    if (validate()) onGenerate();
  };

  const suggestions = getSuggestions(formData.jobRole).filter(s => !formData.skillTags.includes(s));

  return (
    <div style={{
      background: '#141414',
      border: '0.5px solid #2A2A2A',
      borderRadius: 16,
      padding: 32,
      marginTop: 16,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFF', marginBottom: 4, fontFamily: 'Inter, system-ui' }}>
        Almost done!
      </h2>
      <p style={{ fontSize: 12, color: '#888888', marginBottom: 24, fontFamily: 'Inter, system-ui' }}>
        Step 3 of 3 — add your skills and education
      </p>

      {/* Skills with chips */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Your top skills</label>
        <div style={{
          background: '#1A1A1A',
          border: `0.5px solid ${focused === 'skills' ? '#00C8FF' : errors.skills ? '#FF4444' : '#2A2A2A'}`,
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          minHeight: 48,
          alignItems: 'center',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...(focused === 'skills' ? { boxShadow: '0 0 0 3px #00C8FF30' } : {}),
        }}>
          {formData.skillTags.map((tag) => (
            <span key={tag} className="anim-popIn" style={{
              background: '#00C8FF15',
              border: '0.5px solid #00C8FF40',
              color: '#00C8FF',
              borderRadius: 20,
              padding: '4px 10px',
              fontSize: 12,
              fontFamily: 'Inter, system-ui',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}>
              {tag}
              <button
                onClick={() => { removeTag(tag); haptic.tap(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888888',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={skillInputRef}
            type="text"
            value={skillInput}
            onChange={handleSkillChange}
            onKeyDown={handleSkillKeyDown}
            onFocus={() => setFocused('skills')}
            onBlur={() => setFocused(null)}
            placeholder={formData.skillTags.length === 0 ? 'Type a skill and press comma or Enter' : ''}
            style={{
              flex: 1,
              minWidth: 120,
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontFamily: 'Inter, system-ui',
              outline: 'none',
              padding: '4px 0',
            }}
          />
        </div>
        {formData.skillTags.length >= 15 && (
          <p style={{ fontSize: 11, color: '#FFB800', marginTop: 4, fontFamily: 'Inter, system-ui' }}>Maximum 15 skills reached</p>
        )}
        {errors.skills && <p style={errorTextStyle}>{errors.skills}</p>}

        {/* Suggestions */}
        {suggestions.length > 0 && formData.skillTags.length < 15 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#888888', fontFamily: 'Inter, system-ui', alignSelf: 'center' }}>Suggested:</span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { addTag(s); haptic.tap(); }}
                style={{
                  background: '#1A1A1A',
                  border: '0.5px solid #2A2A2A',
                  color: '#888888',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontFamily: 'Inter, system-ui',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Education */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Education</label>
        <input
          type="text"
          value={formData.education}
          onChange={e => onChange('education', e.target.value)}
          onFocus={() => setFocused('education')}
          onBlur={() => setFocused(null)}
          placeholder="e.g. B.Tech CSE, JNTU Hyderabad, 2024, CGPA 8.2"
          style={{
            ...inputStyle,
            ...(focused === 'education' ? focusRing : {}),
            ...(errors.education ? { borderColor: '#FF4444' } : {}),
          }}
        />
        {errors.education && <p style={errorTextStyle}>{errors.education}</p>}
      </div>

      {/* Achievement */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>One achievement you are proud of (optional but powerful)</label>
        <textarea
          rows={2}
          value={formData.achievement}
          onChange={e => onChange('achievement', e.target.value)}
          onFocus={() => setFocused('achievement')}
          onBlur={() => setFocused(null)}
          placeholder="e.g. Won best project award at college hackathon"
          style={{
            ...textareaStyle,
            ...(focused === 'achievement' ? focusRing : {}),
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={() => { haptic.tap(); onBack(); }}
          style={{
            flex: 1,
            height: 52,
            background: 'transparent',
            border: '0.5px solid #2A2A2A',
            borderRadius: 10,
            color: '#888888',
            fontSize: 15,
            fontFamily: 'Inter, system-ui',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ← Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          style={{
            flex: 2,
            height: 56,
            background: isLoading ? '#00C8FF80' : '#00C8FF',
            color: '#000000',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            border: 'none',
            borderRadius: 10,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s ease',
            transform: pulsed ? 'scale(1.03)' : 'scale(1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={e => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          onMouseDown={e => !isLoading && (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
        >
          {isLoading && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="3" strokeDasharray="31 31" strokeLinecap="round" />
            </svg>
          )}
          Generate my resume →
        </button>
      </div>
    </div>
  );
}
