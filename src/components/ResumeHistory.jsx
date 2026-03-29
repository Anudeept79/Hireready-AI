import { haptic } from '../utils/haptics';

export default function ResumeHistory({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ marginTop: 32, marginBottom: 32 }} className="anim-fadeInUp">
      <div style={{
        fontSize: 13, fontWeight: 500, color: '#888888',
        marginBottom: 12, fontFamily: 'Inter, system-ui',
      }}>
        Your recent resumes
      </div>
      {history.map((item) => (
        <div key={item.id} style={{
          background: '#141414', border: '0.5px solid #2A2A2A',
          borderRadius: 12, padding: '14px 16px', marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 500, color: '#FFFFFF',
              marginBottom: 2, fontFamily: 'Inter, system-ui',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.role} resume
            </div>
            <div style={{
              fontSize: 11, color: '#666', fontFamily: 'Inter, system-ui',
            }}>
              {new Date(item.createdAt).toLocaleDateString('en-IN')} · ATS score {item.score}
              {item.paid ? (
                <span style={{ color: '#00FF88' }}> · Paid — can re-download</span>
              ) : (
                <span style={{ color: '#888' }}> · Not downloaded</span>
              )}
            </div>
          </div>
          <button
            onClick={() => { haptic.tap(); onSelect(item); }}
            style={{
              background: item.paid ? '#00C8FF' : 'transparent',
              color: item.paid ? '#000' : '#888',
              border: item.paid ? 'none' : '0.5px solid #2A2A2A',
              borderRadius: 8, padding: '6px 14px', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Inter, system-ui',
              transition: 'all 0.2s',
            }}
          >
            {item.paid ? 'Download again' : 'View — ₹49'}
          </button>
        </div>
      ))}
      <button
        onClick={() => { haptic.tap(); onClear(); }}
        style={{
          background: 'transparent', border: 'none',
          color: '#444', fontSize: 11, cursor: 'pointer', marginTop: 4,
          fontFamily: 'Inter, system-ui',
        }}
      >
        Clear history
      </button>
    </div>
  );
}
