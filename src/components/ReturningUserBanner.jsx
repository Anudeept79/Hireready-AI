import { haptic } from '../utils/haptics';

export default function ReturningUserBanner({ savedDate, savedRole, hasPaid, onContinue, onRedownload, onStartFresh }) {
  return (
    <div className="anim-fadeInDown" style={{
      background: '#141414',
      borderBottom: '0.5px solid #2A2A2A',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      {hasPaid ? (
        <>
          <p style={{
            fontSize: 13, color: '#FFFFFF', fontFamily: 'Inter, system-ui',
            flex: 1, minWidth: 200,
          }}>
            Welcome back — your paid <span style={{ color: '#00C8FF' }}>{savedRole}</span> resume is still available
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { haptic.tap(); onRedownload(); }}
              style={{
                height: 36,
                padding: '0 16px',
                background: '#00C8FF',
                color: '#000',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Inter, system-ui',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Download again — free
            </button>
            <button
              onClick={() => { haptic.tap(); onStartFresh(); }}
              style={{
                height: 36,
                padding: '0 16px',
                background: 'transparent',
                border: '0.5px solid #2A2A2A',
                color: '#888888',
                fontSize: 12,
                fontFamily: 'Inter, system-ui',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Build new resume
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{
            fontSize: 13, color: '#FFFFFF', fontFamily: 'Inter, system-ui',
            flex: 1, minWidth: 200,
          }}>
            Welcome back! Your <span style={{ color: '#00C8FF' }}>{savedRole}</span> resume from {savedDate} is still saved.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { haptic.tap(); onContinue(); }}
              style={{
                height: 36,
                padding: '0 16px',
                background: '#00C8FF',
                color: '#000',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Inter, system-ui',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Download my resume
            </button>
            <button
              onClick={() => { haptic.tap(); onStartFresh(); }}
              style={{
                height: 36,
                padding: '0 16px',
                background: 'transparent',
                border: '0.5px solid #2A2A2A',
                color: '#888888',
                fontSize: 12,
                fontFamily: 'Inter, system-ui',
                borderRadius: 8,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Start fresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}
