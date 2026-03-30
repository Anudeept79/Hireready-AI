import { haptic } from '../utils/haptics';

const BACK_STATES = ['form_step_1', 'form_step_2', 'form_step_3', 'results', 'payment'];

export default function Navbar({ appState, onHome, onBack, onHelp }) {
  const showBack = BACK_STATES.includes(appState) || appState === 'help';

  return (
    <nav style={{
      height: 56,
      background: '#0A0A0A',
      borderBottom: '0.5px solid #2A2A2A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {showBack && (
          <span
            onClick={() => { haptic.tap(); appState === 'help' ? onHome() : onBack(); }}
            style={{
              fontSize: 20,
              color: '#888888',
              cursor: 'pointer',
              lineHeight: 1,
              userSelect: 'none',
              minWidth: 24,
              minHeight: 48,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Go back"
          >
            ←
          </span>
        )}
        <span
          onClick={onHome}
          style={{ fontSize: 16, fontWeight: 500, color: '#FFFFFF', fontFamily: 'Inter, system-ui', cursor: 'pointer' }}
        >
          MyResumeAI
        </span>
      </div>
      {appState !== 'help' && (
        <span
          onClick={() => { haptic.tap(); onHelp(); }}
          style={{
            color: '#888888',
            fontSize: 13,
            fontFamily: 'Inter, system-ui',
            cursor: 'pointer',
            padding: '8px 0',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'}
          onMouseLeave={e => e.currentTarget.style.color = '#888888'}
        >
          Help
        </span>
      )}
    </nav>
  );
}
