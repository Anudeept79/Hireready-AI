export default function SkeletonResume() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
      <div className="skeleton" style={{ height: 20, width: '60%', margin: '0 auto 8px', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: '80%', margin: '0 auto 24px', borderRadius: 4 }} />
      {[100, 90, 85, 100, 70, 95, 80, 88, 75].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 10, width: `${w}%`, marginBottom: 8, borderRadius: 3 }} />
      ))}
    </div>
  );
}
