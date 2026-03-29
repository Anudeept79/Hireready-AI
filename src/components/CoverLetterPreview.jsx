import { useState } from 'react';

export default function CoverLetterPreview({ content, isEditing, onEdit, onSaveEdit, onCancelEdit }) {
  const [editText, setEditText] = useState(content);

  if (isEditing) {
    return (
      <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 24 }}>
        <textarea
          value={editText}
          onChange={e => setEditText(e.target.value)}
          style={{
            width: '100%', minHeight: 300, border: '1px solid #DDD', borderRadius: 8,
            padding: 16, fontSize: 10, fontFamily: 'Georgia, serif', lineHeight: 1.8,
            color: '#333', resize: 'vertical', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancelEdit} style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #DDD', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          <button onClick={() => onSaveEdit(editText)} style={{ padding: '8px 16px', background: '#00C8FF', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 32, position: 'relative' }}>
      <button
        onClick={onEdit}
        style={{
          position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
          cursor: 'pointer', color: '#888', fontSize: 12, fontFamily: 'Inter, system-ui',
          opacity: 0.6, transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
      >
        ✏️ Edit
      </button>

      {content.split('\n').map((line, i) => (
        line.trim()
          ? <p key={i} style={{ fontSize: 9.5, color: '#333', lineHeight: 1.8, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{line.trim()}</p>
          : <div key={i} style={{ height: 10 }} />
      ))}
    </div>
  );
}
