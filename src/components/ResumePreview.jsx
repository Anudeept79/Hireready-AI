import { useState } from 'react';

const toTitleCase = str => str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

// Known resume section headers — used to distinguish section headers from ALL CAPS role titles
const KNOWN_SECTIONS = /^(PROFESSIONAL SUMMARY|WORK EXPERIENCE|KEY PROJECTS|KEY SKILLS|SKILLS|EDUCATION|CERTIFICATIONS|CERTIFICATIONS & LEARNING|ACHIEVEMENTS?)$/;

// Detect lines ending with a date pattern — anchored to end of line with required whitespace before
const DATE_PATTERN = /\s+(\d{4}\s*[–\-—]\s*(?:Present|\d{4})|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}\s*[–\-—]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+)?\d{4})\s*$/i;

function isDateLine(line) {
  return DATE_PATTERN.test(line.trim());
}

function splitTitleDate(line) {
  const trimmed = line.trim();
  const dateMatch = trimmed.match(DATE_PATTERN);
  if (dateMatch) {
    const date = dateMatch[1].trim();
    const title = trimmed.slice(0, dateMatch.index).trim();
    return { title, date };
  }
  // Try standalone year at very end with whitespace before it
  const yearMatch = trimmed.match(/\s+(\d{4})\s*$/);
  if (yearMatch) {
    const date = yearMatch[1];
    const title = trimmed.slice(0, yearMatch.index).trim();
    return { title, date };
  }
  return { title: trimmed, date: '' };
}

function isSectionHeader(line) {
  const t = line.trim();
  return KNOWN_SECTIONS.test(t);
}

function isBulletLine(line) {
  const t = line.trim();
  return t.startsWith('•') || t.startsWith('-');
}

function isContactLine(line) {
  const t = line.trim();
  return (t.includes('@') || (t.includes('|') && t.length < 120)) && !isSectionHeader(t);
}

function isLinkLine(line) {
  return /^(LinkedIn|Portfolio):/i.test(line.trim());
}

export default function ResumePreview({ content, formData, isEditing, onEdit, onSaveEdit, onCancelEdit }) {
  const [editText, setEditText] = useState(content);

  if (isEditing) {
    return (
      <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 24 }}>
        <textarea
          value={editText}
          onChange={e => setEditText(e.target.value)}
          style={{
            width: '100%', minHeight: 400, border: '1px solid #DDD', borderRadius: 8,
            padding: 16, fontSize: 10, fontFamily: 'Georgia, serif', lineHeight: 1.6,
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

  const lines = content.split('\n');
  const elements = [];
  let idx = 0;

  // --- PARSE HEADER FIELDS ---
  // Skip leading empty lines
  while (idx < lines.length && !lines[idx].trim()) idx++;

  // LINE 1 — Candidate name
  let candidateName = '';
  if (idx < lines.length) {
    candidateName = lines[idx].trim();
    idx++;
  }

  // Skip empty lines
  while (idx < lines.length && !lines[idx].trim()) idx++;

  // LINE 2 — Role title (if not contact, not a known section header, not a link)
  let roleTitle = '';
  if (idx < lines.length) {
    const potentialRole = lines[idx].trim();
    if (potentialRole && !isContactLine(lines[idx]) && !KNOWN_SECTIONS.test(potentialRole) && !isLinkLine(lines[idx])) {
      roleTitle = potentialRole;
      idx++;
    }
  }

  // Get LinkedIn and portfolio URLs from formData (user-typed values) — authoritative source
  let linkedinUrl = formData?.linkedinUrl || '';
  let portfolioUrl = formData?.portfolioUrl || '';

  // Collect contact and link lines, stripping any linkedin/portfolio URLs from the resume text
  const contactLines = [];

  while (idx < lines.length) {
    const l = lines[idx].trim();
    if (!l) { idx++; continue; }

    // Check link lines BEFORE contact lines — link lines contain | which would false-match isContactLine
    if (isLinkLine(lines[idx])) {
      // If we don't have URLs from formData, fall back to parsing from resume text
      if (!linkedinUrl || !portfolioUrl) {
        const parts = l.split('|').map(p => p.trim());
        parts.forEach(part => {
          const match = part.match(/^(LinkedIn|Portfolio):\s*(.+)$/i);
          if (match) {
            if (match[1].toLowerCase() === 'linkedin' && !linkedinUrl) linkedinUrl = match[2].trim();
            else if (!portfolioUrl) portfolioUrl = match[2].trim();
          }
        });
      }
      idx++;
    } else if (isContactLine(lines[idx])) {
      // Check if contact line contains an embedded linkedin or portfolio URL — extract and strip it
      const parts = l.split('|').map(p => p.trim());
      const cleanParts = [];
      parts.forEach(part => {
        const linkMatch = part.match(/^(LinkedIn|Portfolio):\s*(.+)$/i);
        if (linkMatch) {
          if (linkMatch[1].toLowerCase() === 'linkedin' && !linkedinUrl) linkedinUrl = linkMatch[2].trim();
          else if (!portfolioUrl) portfolioUrl = linkMatch[2].trim();
        } else if (/linkedin\.com/i.test(part)) {
          if (!linkedinUrl) linkedinUrl = part;
        } else if (/github\.com|portfolio|\.dev|\.io/i.test(part) && !part.includes('@')) {
          if (!portfolioUrl) portfolioUrl = part;
        } else {
          cleanParts.push(part);
        }
      });
      if (cleanParts.length > 0) contactLines.push(cleanParts.join(' | '));
      idx++;
    } else {
      break;
    }
  }

  // --- RENDER HEADER ---
  elements.push(
    <div key="header" style={{ textAlign: 'center', marginBottom: 12 }}>

      <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#000', marginBottom: 6 }}>
        {toTitleCase(candidateName)}
      </div>

      {roleTitle && (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
          {roleTitle}
        </div>
      )}

      {contactLines.map((cl, ci) => (
        <div key={`contact-${ci}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#444', marginBottom: 4 }}>
          {cl}
        </div>
      ))}

      {(linkedinUrl || portfolioUrl) && (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 8.5, marginBottom: 2 }}>
          {linkedinUrl && (
            <a
              href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#000', textDecoration: 'underline', fontFamily: 'Arial, sans-serif', fontSize: 8.5 }}>
              LinkedIn
            </a>
          )}
          {linkedinUrl && portfolioUrl && (
            <span style={{ color: '#444', fontSize: 8.5 }}> | </span>
          )}
          {portfolioUrl && (
            <a
              href={portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#000', textDecoration: 'underline', fontFamily: 'Arial, sans-serif', fontSize: 8.5 }}>
              Portfolio
            </a>
          )}
        </div>
      )}

    </div>
  );

  // THICK BLACK DIVIDER after header
  elements.push(
    <div key="thick-divider" style={{ height: 1.5, background: '#000', marginBottom: 14 }} />
  );

  // Track if we're inside a section that expects title+company patterns (WORK EXPERIENCE, KEY PROJECTS, EDUCATION)
  let currentSection = '';

  // Process remaining body lines
  for (let i = idx; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // Strip lines that contain raw LinkedIn/portfolio URLs to prevent duplicates in the body
    const lower = trimmed.toLowerCase();
    if (lower.includes('linkedin.com') || lower.includes('linkedin:') ||
        lower.includes('portfolio:') || lower.includes('github.com')) continue;

    // Section header detection
    if (isSectionHeader(trimmed)) {
      // Thin grey divider before section (except first section)
      if (currentSection) {
        elements.push(
          <div key={`sdiv-${i}`} style={{ height: 0.5, background: '#DDDDDD', margin: '10px 0' }} />
        );
      }
      currentSection = trimmed;
      elements.push(
        <div key={`hdr-${i}`} style={{
          fontFamily: 'Arial, sans-serif', fontSize: 9, fontWeight: 700, color: '#000',
          letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6,
        }}>
          {trimmed}
        </div>
      );
      continue;
    }

    // Inside WORK EXPERIENCE, KEY PROJECTS, or EDUCATION — detect title+date lines
    const isStructuredSection = /WORK EXPERIENCE|KEY PROJECTS|EDUCATION/.test(currentSection);

    if (isStructuredSection && isDateLine(trimmed) && !isBulletLine(trimmed)) {
      const { title, date } = splitTitleDate(trimmed);
      elements.push(
        <div key={`title-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontWeight: 700, color: '#000' }}>
            {title}
          </span>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#555', whiteSpace: 'nowrap', marginLeft: 12 }}>
            {date}
          </span>
        </div>
      );

      // Check if next non-empty line is company/institution (not bullet, not header, not date line)
      let nextIdx = i + 1;
      while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;
      if (nextIdx < lines.length) {
        const nextLine = lines[nextIdx].trim();
        if (nextLine && !isBulletLine(nextLine) && !isSectionHeader(nextLine) && !isDateLine(nextLine)) {
          // Check for CGPA line
          if (/^CGPA:/i.test(nextLine)) {
            // Not a company — it's a grade line, handle below
          } else {
            elements.push(
              <div key={`company-${nextIdx}`} style={{
                fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#666',
                fontStyle: 'italic', marginBottom: 6,
              }}>
                {nextLine}
              </div>
            );
            i = nextIdx; // Skip this line in the main loop
          }
        }
      }
      continue;
    }

    // Bullet line
    if (isBulletLine(trimmed)) {
      const text = trimmed.replace(/^[•\-]\s*/, '');
      elements.push(
        <div key={`bul-${i}`} style={{
          fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#222',
          lineHeight: 1.65, paddingLeft: 12, position: 'relative', marginBottom: 2,
        }}>
          <span style={{ position: 'absolute', left: 0 }}>•</span>
          {text}
        </div>
      );
      continue;
    }

    // CGPA line
    if (/^CGPA:/i.test(trimmed)) {
      elements.push(
        <div key={`cgpa-${i}`} style={{
          fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#444', marginBottom: 4,
        }}>
          {trimmed}
        </div>
      );
      continue;
    }

    // Regular body text (summary, skills line, certifications line, etc.)
    elements.push(
      <div key={`txt-${i}`} style={{
        fontFamily: 'Arial, sans-serif', fontSize: 8.5, color: '#222', lineHeight: 1.7,
      }}>
        {trimmed}
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
      {elements}
    </div>
  );
}
