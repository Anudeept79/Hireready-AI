import { useState, useEffect } from 'react';
import { haptic } from '../utils/haptics';
import { sendResumeEmail } from '../services/email';
import { downloadResumePDF, downloadCoverLetterPDF, downloadLinkedInPDF } from '../services/pdf';

// Pre-compute particle data outside component to avoid impure calls during render
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: 20 + Math.random() * 60,
  color: ['#00C8FF', '#00FF88', '#FFB800', '#FF6B35'][i % 4],
  size: 4 + Math.random() * 4,
  delay: Math.random() * 0.4,
}));

export default function SuccessScreen({ userName, userEmail, generatedData, formData, savedResume, onBuildNew, onGoHome }) {
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloaded, setDownloaded] = useState({ resume: false, cover: false, linkedin: false });

  useEffect(() => {
    haptic.success();
  }, []);

  const data = generatedData || savedResume?.data;
  const name = formData?.fullName || savedResume?.name || 'Resume';
  const role = formData?.jobRole || savedResume?.role || 'Role';

  const handleDownloadResume = () => {
    if (!data?.resume) return;
    haptic.tap();
    downloadResumePDF(data.resume, name, role, formData);
    setDownloaded(prev => ({ ...prev, resume: true }));
  };

  const handleDownloadCover = () => {
    if (!data?.coverLetter) return;
    haptic.tap();
    downloadCoverLetterPDF(data.coverLetter, name, role);
    setDownloaded(prev => ({ ...prev, cover: true }));
  };

  const handleDownloadLinkedIn = () => {
    if (!data?.linkedinAbout) return;
    haptic.tap();
    downloadLinkedInPDF(data.linkedinAbout, name);
    setDownloaded(prev => ({ ...prev, linkedin: true }));
  };

  const handleDownloadAll = () => {
    if (!data) return;
    haptic.tap();
    downloadResumePDF(data.resume, name, role, formData);
    setDownloaded(prev => ({ ...prev, resume: true }));
    setTimeout(() => {
      downloadCoverLetterPDF(data.coverLetter, name, role);
      setDownloaded(prev => ({ ...prev, cover: true }));
    }, 800);
    setTimeout(() => {
      downloadLinkedInPDF(data.linkedinAbout, name);
      setDownloaded(prev => ({ ...prev, linkedin: true }));
    }, 1600);
  };

  const handleSendEmail = async () => {
    if (!emailInput.trim()) return;
    if (!data) return;
    setSendingEmail(true);
    setEmailError('');
    try {
      const result = await sendResumeEmail({
        toEmail: emailInput,
        generatedData: data,
        formData,
        userName: name,
      });
      setSendingEmail(false);
      if (result === 'mailto') {
        setEmailSent(true);
        setEmailError('');
      } else {
        setEmailSent(true);
      }
      haptic.success();
    } catch (err) {
      setSendingEmail(false);
      setEmailError('Could not send email — please download the files above');
    }
  };

  const allDownloaded = downloaded.resume && downloaded.cover && downloaded.linkedin;
  const firstName = userName || 'there';
  const whatsappText = encodeURIComponent('Bhai, I just made my resume in 60 seconds using AI — try it free: https://hirereadyai.in');

  const downloadBtnStyle = (done) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px',
    background: done ? '#0A1F0A' : '#141414',
    border: `0.5px solid ${done ? '#00FF88' : '#2A2A2A'}`,
    borderRadius: 10, cursor: 'pointer',
    transition: 'all 0.2s', textAlign: 'left',
  });

  return (
    <div style={{ paddingTop: 48 }}>
      <div className="success-card" style={{
        background: '#0A1F0A',
        border: '0.5px solid #00FF88',
        borderRadius: 16,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Confetti particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '40%',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.size > 5 ? 2 : '50%',
            animation: `confetti 1.2s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }} />
        ))}

        {/* Stars */}
        {[
          { left: '15%', top: '10%', delay: '0s', size: 16 },
          { left: '80%', top: '15%', delay: '0.15s', size: 12 },
          { left: '50%', top: '5%', delay: '0.3s', size: 14 },
        ].map((star, i) => (
          <svg key={i} width={star.size} height={star.size} viewBox="0 0 24 24" fill="#FFB800"
            style={{
              position: 'absolute', left: star.left, top: star.top,
              animation: `starBurst 0.6s ease ${star.delay} forwards`,
              opacity: 0,
            }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}

        {/* Checkmark */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#00FF8820" stroke="#00FF88" strokeWidth="1.5" />
            <path
              d="M14 24l7 7 13-13"
              stroke="#00FF88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="100"
              style={{ animation: 'drawCheck 0.6s ease 0.2s forwards', strokeDashoffset: 100 }}
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="anim-fadeInUp delay-3" style={{
          opacity: 0, fontSize: 22, fontWeight: 500, color: '#00FF88',
          marginBottom: 8, fontFamily: 'Inter, system-ui',
        }}>
          Your documents are ready, {firstName}!
        </h2>

        {/* Subtitle */}
        <p className="anim-fadeInUp delay-4" style={{
          opacity: 0, fontSize: 14, color: '#AAAAAA', lineHeight: 1.6,
          marginBottom: 24, fontFamily: 'Inter, system-ui',
        }}>
          You are now ahead of 90% of applicants. Download each document below.
        </p>

        {/* Download All Button */}
        <div className="anim-fadeInUp delay-4" style={{ opacity: 0, marginBottom: 16 }}>
          <button
            onClick={handleDownloadAll}
            style={{
              width: '100%', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: allDownloaded ? '#0A1F0A' : '#00C8FF', color: allDownloaded ? '#00FF88' : '#000',
              border: allDownloaded ? '0.5px solid #00FF88' : 'none',
              borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Inter, system-ui', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!allDownloaded) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {allDownloaded ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
                All 3 downloaded
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download all 3 PDFs
              </>
            )}
          </button>
          {!allDownloaded && (
            <p style={{ fontSize: 10, color: '#666', marginTop: 6, fontFamily: 'Inter, system-ui', textAlign: 'center' }}>
              Resume + Cover Letter + LinkedIn About — 3 separate files
            </p>
          )}
        </div>

        {/* Or download individually */}
        <p style={{ fontSize: 11, color: '#555', marginBottom: 8, fontFamily: 'Inter, system-ui', textAlign: 'center' }}>
          or download individually
        </p>

        {/* 3 Individual Download Buttons */}
        <div className="anim-fadeInUp delay-4" style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {/* Resume */}
          <button
            onClick={handleDownloadResume}
            style={downloadBtnStyle(downloaded.resume)}
            onMouseEnter={e => { if (!downloaded.resume) e.currentTarget.style.borderColor = '#00C8FF'; }}
            onMouseLeave={e => { if (!downloaded.resume) e.currentTarget.style.borderColor = '#2A2A2A'; }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: downloaded.resume ? '#00FF8820' : '#00C8FF15',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {downloaded.resume ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', fontFamily: 'Inter, system-ui' }}>
                Resume
              </div>
              <div style={{ fontSize: 11, color: '#888', fontFamily: 'Inter, system-ui' }}>
                {downloaded.resume ? 'Downloaded — tap to download again' : 'ATS-optimised PDF'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={downloaded.resume ? '#00FF88' : '#888'} strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          {/* Cover Letter */}
          <button
            onClick={handleDownloadCover}
            style={downloadBtnStyle(downloaded.cover)}
            onMouseEnter={e => { if (!downloaded.cover) e.currentTarget.style.borderColor = '#00C8FF'; }}
            onMouseLeave={e => { if (!downloaded.cover) e.currentTarget.style.borderColor = '#2A2A2A'; }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: downloaded.cover ? '#00FF8820' : '#00C8FF15',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {downloaded.cover ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', fontFamily: 'Inter, system-ui' }}>
                Cover Letter
              </div>
              <div style={{ fontSize: 11, color: '#888', fontFamily: 'Inter, system-ui' }}>
                {downloaded.cover ? 'Downloaded — tap to download again' : 'Personalised for ' + role}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={downloaded.cover ? '#00FF88' : '#888'} strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          {/* LinkedIn About */}
          <button
            onClick={handleDownloadLinkedIn}
            style={downloadBtnStyle(downloaded.linkedin)}
            onMouseEnter={e => { if (!downloaded.linkedin) e.currentTarget.style.borderColor = '#00C8FF'; }}
            onMouseLeave={e => { if (!downloaded.linkedin) e.currentTarget.style.borderColor = '#2A2A2A'; }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: downloaded.linkedin ? '#00FF8820' : '#00C8FF15',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {downloaded.linkedin ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#00C8FF">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', fontFamily: 'Inter, system-ui' }}>
                LinkedIn About
              </div>
              <div style={{ fontSize: 11, color: '#888', fontFamily: 'Inter, system-ui' }}>
                {downloaded.linkedin ? 'Downloaded — tap to download again' : 'Keyword-rich profile section'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={downloaded.linkedin ? '#00FF88' : '#888'} strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>

        {/* Email section */}
        <div className="anim-fadeInUp delay-5" style={{ opacity: 0, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#FFFFFF', marginBottom: 8, fontFamily: 'Inter, system-ui' }}>
            Email me my resume
          </p>
          {emailError && (
            <p style={{ fontSize: 11, color: '#FFB800', marginBottom: 8, fontFamily: 'Inter, system-ui' }}>
              {emailError}
            </p>
          )}
          {emailSent ? (
            <p style={{ fontSize: 12, color: '#00FF88', fontFamily: 'Inter, system-ui' }}>
              Sent! Check your inbox.
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  height: 44,
                  background: '#1A1A1A',
                  border: '0.5px solid #2A2A2A',
                  borderRadius: 8,
                  padding: '0 12px',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontFamily: 'Inter, system-ui',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                style={{
                  height: 44,
                  padding: '0 20px',
                  background: '#00C8FF',
                  color: '#000',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'Inter, system-ui',
                  border: 'none',
                  borderRadius: 8,
                  cursor: sendingEmail ? 'not-allowed' : 'pointer',
                }}
              >
                {sendingEmail ? '...' : 'Send'}
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp share */}
        <div className="anim-fadeInUp delay-6" style={{ opacity: 0, marginBottom: 24 }}>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic.success()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 48,
              padding: '0 24px',
              background: '#25D366',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, system-ui',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.228A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.734-5.988-1.975l-.418-.312-2.774.73.743-2.717-.343-.544A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
            Share with a friend who needs this
          </a>
        </div>

        {/* Monthly upgrade nudge */}
        <p className="anim-fadeInUp delay-7" style={{
          opacity: 0, fontSize: 12, color: '#888888', lineHeight: 1.6, fontFamily: 'Inter, system-ui',
        }}>
          Applying to multiple companies? Stop paying ₹49 each time.<br />
          Get unlimited resumes for ₹199/month →
        </p>
      </div>

      {/* Clear exit actions */}
      {(onBuildNew || onGoHome) && (
        <div style={{ borderTop: '0.5px solid #1A1A1A', marginTop: 24, paddingTop: 20 }}>
          {onBuildNew && (
            <button
              onClick={onBuildNew}
              style={{
                width: '100%', background: 'transparent',
                border: '0.5px solid #2A2A2A', borderRadius: 10,
                padding: '12px 24px', color: '#888888', fontSize: 13,
                cursor: 'pointer', marginBottom: 8, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Inter, system-ui',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00C8FF'; e.currentTarget.style.color = '#00C8FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Build a new resume for a different role
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                color: '#444444', fontSize: 12, cursor: 'pointer', padding: '8px',
                fontFamily: 'Inter, system-ui',
              }}
            >
              Back to home
            </button>
          )}
        </div>
      )}
    </div>
  );
}
