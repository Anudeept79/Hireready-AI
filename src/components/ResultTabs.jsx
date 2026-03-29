import { useState, useEffect } from 'react';
import { haptic } from '../utils/haptics';
import SkeletonResume from './SkeletonResume';
import AtsScoreBadge from './AtsScoreBadge';
import ResumePreview from './ResumePreview';
import CoverLetterPreview from './CoverLetterPreview';
import LinkedInPreview from './LinkedInPreview';

const TABS = ['Resume', 'Cover Letter', 'LinkedIn About'];

export default function ResultTabs({ resumeData, formData, atsScore, onDownload, onEnhanceWithAI, onEditManually }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [editing, setEditing] = useState(null); // 'resume' | 'cover' | 'linkedin' | null
  const [data, setData] = useState(resumeData);
  const [fadingTab, setFadingTab] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(t);
  }, []);

  const switchTab = (idx) => {
    setFadingTab(true);
    setTimeout(() => {
      setActiveTab(idx);
      setFadingTab(false);
    }, 150);
  };

  const handleSaveEdit = (key, text) => {
    setData(prev => ({ ...prev, [key]: text }));
    setEditing(null);
  };

  return (
    <div style={{ paddingTop: 48 }}>
      {/* Header */}
      <div className="anim-fadeInDown" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#00FF8820" stroke="#00FF88" strokeWidth="1.5" />
            <path d="M8 12l3 3 5-5" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="100" style={{ animation: 'drawCheck 0.4s ease forwards' }} />
          </svg>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#00FF88', fontFamily: 'Inter, system-ui' }}>
            Your documents are ready
          </span>
        </div>
      </div>

      {/* ATS Score */}
      <div className="anim-fadeInUp delay-1" style={{ opacity: 0, marginBottom: 24 }}>
        <AtsScoreBadge score={atsScore.score} items={atsScore.items} />
      </div>

      {/* Tab bar */}
      <div className="anim-fadeIn delay-2" style={{
        opacity: 0,
        display: 'flex',
        borderBottom: '0.5px solid #2A2A2A',
        marginBottom: 16,
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => switchTab(i)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #00C8FF' : '2px solid transparent',
              color: activeTab === i ? '#FFFFFF' : '#888888',
              fontSize: 13,
              fontFamily: 'Inter, system-ui',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Document content */}
      <div className="anim-slideUp delay-3" style={{
        opacity: fadingTab ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        {showSkeleton ? (
          <SkeletonResume />
        ) : (
          <>
            {activeTab === 0 && (
              <ResumePreview
                content={data.resume}
                formData={formData}
                isEditing={editing === 'resume'}
                onEdit={() => setEditing('resume')}
                onSaveEdit={(text) => handleSaveEdit('resume', text)}
                onCancelEdit={() => setEditing(null)}
              />
            )}
            {activeTab === 1 && (
              <CoverLetterPreview
                content={data.coverLetter}
                isEditing={editing === 'cover'}
                onEdit={() => setEditing('cover')}
                onSaveEdit={(text) => handleSaveEdit('coverLetter', text)}
                onCancelEdit={() => setEditing(null)}
              />
            )}
            {activeTab === 2 && (
              <LinkedInPreview
                content={data.linkedinAbout}
                isEditing={editing === 'linkedin'}
                onEdit={() => setEditing('linkedin')}
                onSaveEdit={(text) => handleSaveEdit('linkedinAbout', text)}
                onCancelEdit={() => setEditing(null)}
              />
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="anim-fadeInUp delay-4" style={{ opacity: 0, marginTop: 24 }}>
        <button
          onClick={() => { haptic.tap(); onDownload(); }}
          style={{
            width: '100%',
            height: 52,
            background: '#00C8FF',
            color: '#000',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            marginBottom: 12,
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1.02)'}
        >
          Download all 3 as PDF — ₹49
        </button>

        <button
          onClick={() => { haptic.tap(); setShowRegenerateModal(true); }}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: 'transparent',
            border: '0.5px solid #2A2A2A',
            borderRadius: 10,
            color: '#888888',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#00C8FF'; e.currentTarget.style.color = '#00C8FF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Want a better resume? Enhance it
        </button>

        <p style={{
          fontSize: 12, color: '#888888', marginTop: 16, lineHeight: 1.6,
          fontFamily: 'Inter, system-ui', textAlign: 'center',
        }}>
          Applying to a different role? Change the job role and regenerate.<br />
          Unlimited versions for ₹199/month — or ₹49 each time.
        </p>
      </div>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }} onClick={() => setShowRegenerateModal(false)}>
          <div onClick={e => e.stopPropagation()} className="result-modal" style={{
            background: '#141414', border: '0.5px solid #2A2A2A',
            borderRadius: 20, maxWidth: 480, width: '100%',
            animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#FFFFFF', marginBottom: 8, fontFamily: 'Inter, system-ui' }}>
                Let's make your resume stronger
              </div>
              <div style={{ fontSize: 13, color: '#888888', lineHeight: 1.6, fontFamily: 'Inter, system-ui' }}>
                Your current ATS score is {atsScore?.score}/94. Adding more details can push it higher.
              </div>
            </div>

            {/* Current score gap indicator */}
            <div style={{
              background: '#1A1A1A', borderRadius: 10, padding: '12px 16px',
              marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 12, color: '#888888', fontFamily: 'Inter, system-ui' }}>Current score</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: atsScore?.score >= 90 ? '#00FF88' : '#FFB800', fontFamily: 'Inter, system-ui' }}>
                {atsScore?.score}/94
              </div>
            </div>

            {/* Missing items hint */}
            {atsScore?.items?.filter(i => !i.pass).length > 0 && (
              <div style={{
                background: '#0D1A0D', border: '0.5px solid #00FF8830',
                borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, color: '#00CC66', marginBottom: 6, fontFamily: 'Inter, system-ui' }}>To reach a higher score:</div>
                {atsScore.items.filter(i => !i.pass).map((item, i) => (
                  <div key={i} style={{ fontSize: 11, color: '#00FF88', display: 'flex', gap: 6, marginBottom: 2, fontFamily: 'Inter, system-ui' }}>
                    <span>+</span><span>{item.note || `Add ${item.label}`}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Option 1 — AI enhance */}
            <button onClick={() => { setShowRegenerateModal(false); haptic.tap(); onEnhanceWithAI(); }} style={{
              width: '100%', background: '#00C8FF', border: 'none',
              borderRadius: 12, padding: '16px 24px', marginBottom: 10,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#000', marginBottom: 2, fontFamily: 'Inter, system-ui' }}>
                  Enhance automatically with AI
                </div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', fontFamily: 'Inter, system-ui' }}>
                  HireReady AI fills the gaps and rebuilds your resume to maximise your ATS score
                </div>
              </div>
            </button>

            {/* Option 2 — Edit manually */}
            <button onClick={() => { setShowRegenerateModal(false); haptic.tap(); onEditManually(); }} style={{
              width: '100%', background: 'transparent',
              border: '0.5px solid #2A2A2A', borderRadius: 12, padding: '16px 24px',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#888888'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: '#1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#FFFFFF', marginBottom: 2, fontFamily: 'Inter, system-ui' }}>
                  Edit my details and regenerate
                </div>
                <div style={{ fontSize: 12, color: '#666666', fontFamily: 'Inter, system-ui' }}>
                  Go back to the form, add more information, and generate a stronger resume
                </div>
              </div>
            </button>

            {/* Cancel */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => setShowRegenerateModal(false)} style={{
                background: 'transparent', border: 'none',
                color: '#444444', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, system-ui',
              }}>
                Keep my current resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
