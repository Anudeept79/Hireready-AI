export default function SavedIndicator({ show }) {
  if (!show) return null;

  return (
    <div className="anim-slideUp" style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#141414',
      border: '0.5px solid #00FF88',
      borderRadius: 20,
      padding: '8px 16px',
      fontSize: 12,
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui',
      zIndex: 100,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#00FF88' }}>●</span> Progress saved
    </div>
  );
}
