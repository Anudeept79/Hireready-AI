import { useEffect, useRef, useState } from 'react';
import { haptic } from '../utils/haptics';
import { rewriteExperience, rewriteJobDescription, suggestKeywords } from '../services/claude';

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

const EXP_OPTIONS = [
  'Fresher / 0 years',
  'Less than 1 year',
  '1 to 2 years',
  '3 to 5 years',
  '5 to 10 years',
  '10+ years',
];

const aiButtonStyle = {
  display: 'flex', alignItems: 'center', gap: 5,
  background: 'transparent', border: '0.5px solid #2A2A2A',
  borderRadius: 20, padding: '4px 10px',
  color: '#888888', fontSize: 11, fontWeight: 500,
  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  fontFamily: 'Inter, system-ui',
};

export default function FormStep2({ formData, onChange, onBack, onNext, addTag }) {
  const firstRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [isRewritingExp, setIsRewritingExp] = useState(false);
  const [showExpSuccess, setShowExpSuccess] = useState(false);
  const [isRewritingJD, setIsRewritingJD] = useState(false);
  const [showJDSuccess, setShowJDSuccess] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleRewriteExperience = async () => {
    setIsRewritingExp(true);
    setShowExpSuccess(false);
    try {
      const result = await rewriteExperience(formData.experience, formData.jobRole || 'professional');
      onChange('experience', result);
      setShowExpSuccess(true);
      haptic.success();
      setTimeout(() => setShowExpSuccess(false), 3000);
    } catch {
      haptic.error();
    } finally {
      setIsRewritingExp(false);
    }
  };

  const handleRewriteJD = async () => {
    setIsRewritingJD(true);
    setShowJDSuccess(false);
    try {
      const result = await rewriteJobDescription(formData.jobDescription);
      onChange('jobDescription', result);
      setShowJDSuccess(true);
      haptic.success();
      setTimeout(() => setShowJDSuccess(false), 3000);
    } catch {
      haptic.error();
    } finally {
      setIsRewritingJD(false);
    }
  };

  const handleSuggestKeywords = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestKeywords(formData.jobRole);
      const keywords = result.split(',').map(k => k.trim()).filter(Boolean);
      setSuggestedKeywords(keywords);
    } catch {
      haptic.error();
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => firstRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const isFresher = formData.yearsOfExperience === 'Fresher / 0 years';

  const wordCount = (formData.experience || '').trim().split(/\s+/).filter(Boolean).length;
  const wordColor = wordCount >= 80 && wordCount <= 300 ? '#00FF88' : wordCount < 80 ? '#FFB800' : '#FF4444';

  const jdLength = (formData.jobDescription || '').length;

  const validate = () => {
    const e = {};
    if (!formData.yearsOfExperience) e.yearsOfExperience = 'Please select your experience level';
    if (!formData.experience.trim()) e.experience = isFresher ? 'Please describe at least one project or activity' : 'Please describe your work experience';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    haptic.tap();
    if (validate()) onNext();
  };

  const handleBack = () => {
    haptic.tap();
    onBack();
  };

  const hoverCyan = {
    onMouseEnter: e => { e.currentTarget.style.borderColor = '#00C8FF'; e.currentTarget.style.color = '#00C8FF'; },
    onMouseLeave: e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; },
  };

  const hoverGreen = {
    onMouseEnter: e => { e.currentTarget.style.borderColor = '#00FF88'; e.currentTarget.style.color = '#00FF88'; },
    onMouseLeave: e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; },
  };

  const SpinnerIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  );

  const ImproveIcon = () => (
    <>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#00C8FF" style={{marginLeft:-2}}>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    </>
  );

  const SuccessMessage = ({ text }) => (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#00FF88', marginTop:4 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      {text}
    </div>
  );

  return (
    <div className="form-card" style={{
      background: '#141414',
      border: '0.5px solid #2A2A2A',
      borderRadius: 16,
      marginTop: 16,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFF', marginBottom: 4, fontFamily: 'Inter, system-ui' }}>
        {isFresher ? 'Your background' : 'Your experience'}
      </h2>
      <p style={{ fontSize: 12, color: '#888888', marginBottom: 24, fontFamily: 'Inter, system-ui' }}>
        Step 2 of 3 — the details that make your resume stand out
      </p>

      {/* Years of Experience */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Years of Experience</label>
        <select
          ref={firstRef}
          value={formData.yearsOfExperience}
          onChange={e => onChange('yearsOfExperience', e.target.value)}
          onFocus={() => setFocused('exp')}
          onBlur={() => setFocused(null)}
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            ...(focused === 'exp' ? focusRing : {}),
            ...(errors.yearsOfExperience ? { borderColor: '#FF4444' } : {}),
          }}
        >
          {EXP_OPTIONS.map(opt => (
            <option key={opt} value={opt} style={{ background: '#1A1A1A', color: '#FFFFFF' }}>{opt}</option>
          ))}
        </select>
        {errors.yearsOfExperience && <p style={errorTextStyle}>{errors.yearsOfExperience}</p>}
      </div>

      {/* Fresher helper message */}
      <div style={{
        maxHeight: isFresher ? 100 : 0,
        opacity: isFresher ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-out, opacity 0.3s ease-out',
        marginBottom: isFresher ? 16 : 0,
      }}>
        <div style={{
          background: '#0D1F0D',
          border: '0.5px solid #00FF8830',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 12,
          color: '#00CC66',
          lineHeight: 1.6,
          fontFamily: 'Inter, system-ui',
        }}>
          No work experience? That's completely fine — 60% of our users are freshers.
          Describe any project, hackathon, internship, or college activity, however small.
        </div>
      </div>

      {/* Experience textarea */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#FFFFFF', fontFamily:'Inter, system-ui' }}>
            {isFresher ? 'Your Projects or College Activities' : 'Work Experience'}
          </label>
          {formData.experience?.length >= 20 && (
            <button
              onClick={handleRewriteExperience}
              disabled={isRewritingExp}
              style={{ ...aiButtonStyle, cursor: isRewritingExp ? 'not-allowed' : 'pointer' }}
              {...hoverCyan}
            >
              {isRewritingExp ? ( <><SpinnerIcon /> Improving...</> ) : ( <><ImproveIcon /> Improve with AI</> )}
            </button>
          )}
        </div>
        <textarea
          rows={5}
          value={formData.experience}
          onChange={e => onChange('experience', e.target.value)}
          onFocus={() => setFocused('experience')}
          onBlur={() => setFocused(null)}
          placeholder={isFresher
            ? 'e.g. Built a food ordering app using React and Firebase for final year project.\nWon 2nd place at college hackathon. Completed Python for Data Science on Coursera.'
            : 'e.g. Worked at Infosys for 2 years on a core banking application.\nLed a team of 3 to migrate legacy Java code to microservices. Reduced API response time by 40%.'
          }
          style={{
            ...textareaStyle,
            ...(focused === 'experience' ? focusRing : {}),
            ...(errors.experience ? { borderColor: '#FF4444' } : {}),
          }}
        />
        <p style={{ fontSize: 11, color: wordColor, marginTop: 4, fontFamily: 'Inter, system-ui' }}>
          Best results with 80–300 words. Currently: {wordCount} words.
        </p>
        {showExpSuccess && (
          <SuccessMessage text="Improved — your experience now reads like a professional" />
        )}
        {errors.experience && <p style={errorTextStyle}>{errors.experience}</p>}
      </div>

      {/* Company/College */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Current or Last Company / College</label>
        <input
          type="text"
          value={formData.companyOrCollege}
          onChange={e => onChange('companyOrCollege', e.target.value)}
          onFocus={() => setFocused('company')}
          onBlur={() => setFocused(null)}
          placeholder="e.g. TCS, Wipro, JNTU Hyderabad (optional)"
          style={{
            ...inputStyle,
            ...(focused === 'company' ? focusRing : {}),
          }}
        />
      </div>

      {/* Job Description */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:6, flexWrap:'wrap', gap:6 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#FFFFFF', fontFamily:'Inter, system-ui' }}>
            Job Description
          </label>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            {formData.jobRole && (
              <button
                onClick={handleSuggestKeywords}
                disabled={isSuggesting}
                style={{ ...aiButtonStyle, cursor: isSuggesting ? 'not-allowed' : 'pointer' }}
                {...hoverGreen}
              >
                {isSuggesting ? 'Suggesting...' : '✦ Suggest keywords'}
              </button>
            )}
            {formData.jobDescription?.length >= 20 && (
              <button
                onClick={handleRewriteJD}
                disabled={isRewritingJD}
                style={{ ...aiButtonStyle, cursor: isRewritingJD ? 'not-allowed' : 'pointer' }}
                {...hoverCyan}
              >
                {isRewritingJD ? ( <><SpinnerIcon /> Improving...</> ) : ( <><ImproveIcon /> Improve with AI</> )}
              </button>
            )}
          </div>
        </div>
        <textarea
          rows={3}
          maxLength={2500}
          value={formData.jobDescription}
          onChange={e => onChange('jobDescription', e.target.value)}
          onFocus={() => setFocused('jd')}
          onBlur={() => setFocused(null)}
          placeholder="Enter the job description you are applying to. MyResumeAI will extract and match keywords to your resume automatically — this is the most powerful ATS feature."
          style={{
            ...textareaStyle,
            ...(focused === 'jd' ? focusRing : {}),
          }}
        />
        {jdLength >= 2000 && (
          <p style={{ fontSize: 11, color: '#FFB800', marginTop: 4, fontFamily: 'Inter, system-ui' }}>
            Getting long — trim to the key requirements for best results ({2500 - jdLength} chars remaining)
          </p>
        )}
        {showJDSuccess && (
          <SuccessMessage text="Key requirements extracted — MyResumeAI will match these to your resume" />
        )}
        <div style={{
          background: '#1A1800',
          border: '0.5px solid #FFB80030',
          borderRadius: 8,
          padding: '6px 12px',
          marginTop: 8,
          fontSize: 11,
          color: '#FFB800',
          fontFamily: 'Inter, system-ui',
        }}>
          Secret weapon: resumes matched to job descriptions get 3× more callbacks
        </div>
        {suggestedKeywords.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 11, color: '#888888', marginBottom: 6, fontFamily: 'Inter, system-ui' }}>
              Suggested keywords for your role — click to add to skills:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestedKeywords.map(kw => (
                <button
                  key={kw}
                  onClick={() => { addTag(kw); haptic.tap(); setSuggestedKeywords(prev => prev.filter(k => k !== kw)); }}
                  className="anim-popIn"
                  style={{
                    background: '#00C8FF15', border: '0.5px solid #00C8FF40', color: '#00C8FF',
                    borderRadius: 20, padding: '4px 10px', fontSize: 11, fontFamily: 'Inter, system-ui',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  + {kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={handleBack}
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
          onClick={handleNext}
          style={{
            flex: 2,
            height: 52,
            background: '#00C8FF',
            color: '#000000',
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
          Continue — Add skills →
        </button>
      </div>
    </div>
  );
}
