import { haptic } from '../utils/haptics';

const SECTIONS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="#00C8FF"/>
      </svg>
    ),
    title: 'What is HireReady AI?',
    body: 'HireReady AI is a free AI-powered resume builder built for Indian freshers and professionals. Fill a 3-step form, and Claude AI writes your resume, cover letter, and LinkedIn About section — all ATS-optimised and ready to download as PDF.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'How does it work?',
    body: '1. Fill in your basic details, experience, and skills across 3 simple steps.\n2. Claude AI generates your resume, cover letter, and LinkedIn About — tailored to the job role you are applying for.\n3. Preview everything for free. If you are happy, pay ₹49 to download all 3 as PDF files.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
      </svg>
    ),
    title: 'What does it cost?',
    body: 'Generating and previewing your resume is completely free — no signup required. Downloading all 3 documents (resume, cover letter, LinkedIn About) costs ₹49 one-time via Razorpay (UPI, card, or netbanking). No hidden charges. No subscription.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    title: 'What is ATS and why does it matter?',
    body: 'ATS (Applicant Tracking System) is software used by companies like TCS, Infosys, Wipro, and most startups to filter resumes before a human ever sees them. 75% of resumes are rejected by ATS. HireReady AI formats your resume to pass ATS screening — single column, correct headings, keyword matching.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: 'I paid but my download failed. What do I do?',
    body: 'Your payment and resume are saved for 7 days. Simply return to the site — you will see a banner saying "Your paid resume is still available" with a free re-download option. You can also download each file individually from the success screen.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'I am a fresher with no experience. Will this work?',
    body: 'Yes — 60% of our users are freshers. When you select "Fresher / 0 years" in Step 2, the form adapts to ask about your projects, hackathons, internships, and college activities instead of work experience. Claude AI is trained to write powerful fresher resumes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/>
      </svg>
    ),
    title: 'What do I get for ₹49?',
    body: '3 separate PDF files:\n• Resume — ATS-optimised, professionally formatted\n• Cover Letter — personalised for the job role you entered\n• LinkedIn About — keyword-rich, ready to paste into your LinkedIn profile\n\nYou can re-download all 3 anytime within 7 days.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'How long does it take?',
    body: 'The 3-step form takes about 2 minutes. Claude AI generates all 3 documents in 15–30 seconds. Total time from start to download: under 3 minutes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'Is my data safe?',
    body: 'Yes. Everything runs in your browser. Your data is saved in localStorage on your device only — we do not have a server or database. Your form data and resume are never sent anywhere except to Claude AI for generation. Payments are handled securely by Razorpay.',
  },
];

export default function HelpScreen({ onBack }) {
  return (
    <div style={{ paddingTop: 32 }} className="anim-fadeIn">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 500, color: '#FFFFFF',
          fontFamily: 'Inter, system-ui', marginBottom: 8,
        }}>
          How can we help?
        </h1>
        <p style={{
          fontSize: 14, color: '#888888', fontFamily: 'Inter, system-ui', lineHeight: 1.6,
        }}>
          Everything you need to know about HireReady AI
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SECTIONS.map((section, i) => (
          <HelpCard key={i} icon={section.icon} title={section.title} body={section.body} index={i} />
        ))}
      </div>

      {/* Contact */}
      <div style={{
        marginTop: 32, padding: 24, background: '#141414',
        border: '0.5px solid #2A2A2A', borderRadius: 16, textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#FFFFFF', fontFamily: 'Inter, system-ui', marginBottom: 4 }}>
          Still have questions?
        </p>
        <p style={{ fontSize: 12, color: '#888888', fontFamily: 'Inter, system-ui', lineHeight: 1.6 }}>
          Email us at <span style={{ color: '#00C8FF' }}>support@hirereadyai.in</span> — we reply within 24 hours.
        </p>
      </div>

      {/* Back button */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          onClick={() => { haptic.tap(); onBack(); }}
          style={{
            background: 'transparent', border: '0.5px solid #2A2A2A',
            borderRadius: 10, padding: '12px 32px', color: '#888888',
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, system-ui',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#00C8FF'; e.currentTarget.style.color = '#00C8FF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

function HelpCard({ icon, title, body, index }) {
  return (
    <div
      className="anim-fadeInUp"
      style={{
        background: '#141414',
        border: '0.5px solid #2A2A2A',
        borderRadius: 12,
        padding: '16px 20px',
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: '#00C8FF10', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          marginTop: 2,
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 500, color: '#FFFFFF',
            fontFamily: 'Inter, system-ui', marginBottom: 6,
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 12, color: '#AAAAAA', lineHeight: 1.7,
            fontFamily: 'Inter, system-ui', whiteSpace: 'pre-line',
          }}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}
