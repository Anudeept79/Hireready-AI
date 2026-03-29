const LABELS = { 1: 'Basic details', 2: 'Your experience', 3: 'Skills and education' };

export default function ProgressBar({ currentStep }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: s < currentStep ? '#00C8FF' : s === currentStep ? 'rgba(0,200,255,0.6)' : '#2A2A2A',
            transition: 'background 0.4s ease-out',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {s === currentStep && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '60%',
                background: '#00C8FF',
                borderRadius: 2,
                transition: 'width 0.4s ease-out',
              }} />
            )}
          </div>
        ))}
      </div>
      <p style={{
        fontSize: 11,
        color: '#888888',
        marginTop: 8,
        fontFamily: 'Inter, system-ui',
      }}>
        Step {currentStep} of 3 — {LABELS[currentStep]}
      </p>
    </div>
  );
}
