export default function SampleResume({ onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 24,
          maxHeight: 200,
          overflow: 'hidden',
          position: 'relative',
          textAlign: 'left',
        }}
      >
        <p style={{ fontSize: 17, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 4, fontFamily: 'Georgia, serif' }}>
          Aarav Sharma
        </p>
        <p style={{ fontSize: 9, color: '#555', textAlign: 'center', marginBottom: 16, fontFamily: 'Georgia, serif' }}>
          aarav.sharma@email.com | +91 98765 43210 | Hyderabad
        </p>

        <p style={{ fontSize: 11, fontWeight: 'bold', color: '#000', borderBottom: '0.5px solid #DDD', paddingBottom: 2, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
          PROFESSIONAL SUMMARY
        </p>
        <p style={{ fontSize: 9, color: '#333', lineHeight: 1.6, marginBottom: 12, fontFamily: 'Georgia, serif' }}>
          Motivated Software Developer with strong foundation in React, Node.js, and cloud technologies. Completed 3 internships and built 5+ full-stack projects during B.Tech. Passionate about writing clean, scalable code.
        </p>

        <p style={{ fontSize: 11, fontWeight: 'bold', color: '#000', borderBottom: '0.5px solid #DDD', paddingBottom: 2, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
          KEY SKILLS
        </p>
        <p style={{ fontSize: 9, color: '#333', lineHeight: 1.6, marginBottom: 12, fontFamily: 'Georgia, serif' }}>
          React.js, Node.js, JavaScript, Python, MongoDB, REST APIs, Git, AWS EC2, Tailwind CSS
        </p>

        <p style={{ fontSize: 11, fontWeight: 'bold', color: '#000', borderBottom: '0.5px solid #DDD', paddingBottom: 2, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
          PROJECTS
        </p>
        <p style={{ fontSize: 9, color: '#333', lineHeight: 1.6, fontFamily: 'Georgia, serif' }}>
          • Built a food ordering app using React and Firebase serving 100+ campus users
        </p>

        {/* Gradient fade at bottom of card */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(to bottom, transparent, white)',
        }} />
      </div>

      {/* Overlay text BELOW the card */}
      <p style={{
        paddingTop: 12,
        fontSize: 13,
        color: '#00C8FF',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui',
      }}>
        Your personalised resume, generated in 60 seconds
      </p>
    </div>
  );
}
