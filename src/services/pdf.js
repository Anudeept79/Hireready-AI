import jsPDF from 'jspdf';

const safeName = s => s.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
const dateStr = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/\s/g, '');

function triggerDownload(doc, filename) {
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}

function ensureUrl(val) {
  if (!val) return '';
  return val.startsWith('http') ? val : `https://${val}`;
}

// Returns true if a line is a raw LinkedIn/Portfolio URL line that should be skipped
function isLinkLine(line) {
  const l = line.toLowerCase();
  return /^(linkedin|portfolio):/i.test(line.trim()) ||
    (l.includes('linkedin.com') && !l.includes('@')) ||
    (l.includes('github.com') && !l.includes('@')) ||
    (/\.(dev|io)\//i.test(l) && !l.includes('@') && l.split(/\s+/).length <= 2);
}

// Shared: render resume header (name, role, contact, links) and return {y, lineIndex}
function renderResumeHeader(doc, lines, pageW, marginL, marginR, linkedinUrl, portfolioUrl) {
  let y = 18;
  let lineIndex = 0;

  const toTitleCase = s => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  // LINE 1 — Candidate name
  const nameLine = lines[0]?.trim();
  if (nameLine) {
    doc.setFontSize(17); doc.setFont('helvetica', 'bold');
    doc.text(toTitleCase(nameLine), pageW / 2, y, { align: 'center' });
    y += 7; lineIndex = 1;
  }

  // LINE 2 — Role/title if present
  const potentialRole = lines[1]?.trim();
  if (potentialRole && !potentialRole.includes('@') && !potentialRole.match(/\d{10}/) && !potentialRole.includes('|')) {
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(potentialRole.toUpperCase(), pageW / 2, y, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 5; lineIndex = 2;
  }

  // CONTACT LINES — centered, 8px — skip any that are pure linkedin/portfolio URLs
  for (let i = lineIndex; i < Math.min(lineIndex + 5, lines.length); i++) {
    const l = lines[i]?.trim();
    if (!l || (l === l.toUpperCase() && l.length > 3 && !l.includes('@') && !l.includes('|'))) break;

    // Skip pure link lines — we render them separately below
    if (isLinkLine(l)) {
      lineIndex = i + 1;
      continue;
    }

    if (l.includes('@') || l.includes('|')) {
      // Strip any linkedin/portfolio segments from pipe-separated contact lines
      const parts = l.split('|').map(p => p.trim()).filter(p => {
        const pl = p.toLowerCase();
        return !pl.includes('linkedin.com') && !pl.includes('github.com') &&
          !/^(linkedin|portfolio):/i.test(p) && !(/(\.dev|\.io)\//i.test(pl) && !pl.includes('@'));
      });
      if (parts.length > 0) {
        doc.setFontSize(8); doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(parts.join(' | '), pageW / 2, y, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        y += 4.5;
      }
      lineIndex = i + 1;
    } else break;
  }

  // LINKEDIN / PORTFOLIO — render as titled hyperlinks
  if (linkedinUrl || portfolioUrl) {
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    const linkColor = [0, 80, 180];
    const labels = [];
    const linkData = [];

    if (linkedinUrl) { labels.push('LinkedIn'); linkData.push({ label: 'LinkedIn', url: ensureUrl(linkedinUrl) }); }
    if (portfolioUrl) { labels.push('Portfolio'); linkData.push({ label: 'Portfolio', url: ensureUrl(portfolioUrl) }); }

    const fullText = labels.join('  |  ');
    const textWidth = doc.getTextWidth(fullText);
    const startX = (pageW - textWidth) / 2;

    let cursorX = startX;
    linkData.forEach((link, idx) => {
      const labelWidth = doc.getTextWidth(link.label);
      doc.setTextColor(...linkColor);
      doc.text(link.label, cursorX, y);
      doc.link(cursorX, y - 3, labelWidth, 4, { url: link.url });
      cursorX += labelWidth;
      if (idx < linkData.length - 1) {
        doc.setTextColor(100, 100, 100);
        const sep = '  |  ';
        doc.text(sep, cursorX, y);
        cursorX += doc.getTextWidth(sep);
      }
    });
    doc.setTextColor(0, 0, 0);
    y += 4.5;
  }

  // THICK BLACK DIVIDER
  y += 2;
  doc.setLineWidth(0.6); doc.setDrawColor(0, 0, 0);
  doc.line(marginL, y, pageW - marginR, y);
  y += 5;

  return { y, lineIndex };
}

// Shared: render resume body sections from lineIndex onwards
function renderResumeBody(doc, lines, lineIndex, startY, pageW, pageH, marginL, marginR, usableW) {
  let y = startY;

  const addPageCheck = (needed = 6) => { if (y + needed > pageH - 15) { doc.addPage(); y = 18; } };

  const datePattern = /\s+(\d{4}\s*[–\-—]\s*(?:Present|\d{4})|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}\s*[–\-—]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+)?\d{4})\s*$/i;
  const isDateLine = (l) => datePattern.test(l);
  const splitTitleDate = (l) => {
    const dateMatch = l.match(datePattern);
    if (dateMatch) return { title: l.slice(0, dateMatch.index).trim(), date: dateMatch[1].trim() };
    const yearMatch = l.match(/\s+(\d{4})\s*$/);
    if (yearMatch) return { title: l.slice(0, yearMatch.index).trim(), date: yearMatch[1] };
    return { title: l, date: '' };
  };

  const KNOWN_SECTIONS = /^(PROFESSIONAL SUMMARY|WORK EXPERIENCE|KEY PROJECTS|KEY SKILLS|SKILLS|EDUCATION|CERTIFICATIONS|CERTIFICATIONS & LEARNING|ACHIEVEMENTS?)$/;
  let currentSection = '';
  let firstSection = true;

  for (let i = lineIndex; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    // Skip raw link lines in body
    if (isLinkLine(line)) continue;

    addPageCheck(6);
    const isSection = KNOWN_SECTIONS.test(line);

    if (isSection) {
      if (!firstSection) {
        y += 1; doc.setLineWidth(0.2); doc.setDrawColor(180, 180, 180);
        doc.line(marginL, y, pageW - marginR, y); doc.setDrawColor(0, 0, 0); y += 4;
      }
      firstSection = false; currentSection = line;
      doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(line, marginL, y); y += 5;
    } else if (/WORK EXPERIENCE|KEY PROJECTS|EDUCATION/.test(currentSection) && isDateLine(line) && !line.startsWith('•') && !line.startsWith('-')) {
      const { title, date } = splitTitleDate(line);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(title, marginL, y);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80);
      doc.text(date, pageW - marginR, y, { align: 'right' }); doc.setTextColor(0, 0, 0);
      y += 4.5;
      let nextIdx = i + 1;
      while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;
      if (nextIdx < lines.length) {
        const nextLine = lines[nextIdx].trim();
        if (nextLine && !nextLine.startsWith('•') && !nextLine.startsWith('-')
          && !(nextLine === nextLine.toUpperCase() && nextLine.length > 3)
          && !isDateLine(nextLine) && !/^CGPA:/i.test(nextLine)) {
          doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(80, 80, 80);
          doc.text(nextLine, marginL, y); doc.setTextColor(0, 0, 0); y += 4; i = nextIdx;
        }
      }
    } else if (line.startsWith('•') || line.startsWith('-')) {
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
      const bulletText = '• ' + line.replace(/^[•\-]\s*/, '');
      doc.splitTextToSize(bulletText, usableW - 4).forEach((sl, si) => {
        addPageCheck(5); doc.text(sl, marginL + (si === 0 ? 0 : 3), y); y += 4.5;
      });
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
      doc.splitTextToSize(line, usableW).forEach(sl => { addPageCheck(5); doc.text(sl, marginL, y); y += 4.5; });
      doc.setTextColor(0, 0, 0);
    }
  }

  return y;
}

export function downloadResumePDF(resumeText, name, role, formData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 20, marginR = 20;
  const usableW = pageW - marginL - marginR;

  const lines = resumeText.split('\n');
  const linkedinUrl = formData?.linkedinUrl || '';
  const portfolioUrl = formData?.portfolioUrl || '';

  const { y, lineIndex } = renderResumeHeader(doc, lines, pageW, marginL, marginR, linkedinUrl, portfolioUrl);
  renderResumeBody(doc, lines, lineIndex, y, pageW, pageH, marginL, marginR, usableW);

  triggerDownload(doc, `${safeName(name)}_${safeName(role)}_Resume_${dateStr()}.pdf`);
}

export function downloadCoverLetterPDF(text, name, role) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 25, W = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 30;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  text.split('\n').forEach(line => {
    if (y > 272) { doc.addPage(); y = 30; }
    if (line.trim()) {
      doc.splitTextToSize(line.trim(), W).forEach(s => { doc.text(s, margin, y); y += 6; });
    } else { y += 3; }
  });
  triggerDownload(doc, `${safeName(name)}_${safeName(role)}_Cover_Letter_${dateStr()}.pdf`);
}

export function downloadAllDocumentsPDF(resumeText, coverLetterText, linkedinText, name, role, formData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 20, marginR = 20;
  const usableW = pageW - marginL - marginR;

  const lines = resumeText.split('\n');
  const linkedinUrl = formData?.linkedinUrl || '';
  const portfolioUrl = formData?.portfolioUrl || '';

  // === PAGE 1+: RESUME ===
  const { y: headerY, lineIndex } = renderResumeHeader(doc, lines, pageW, marginL, marginR, linkedinUrl, portfolioUrl);
  renderResumeBody(doc, lines, lineIndex, headerY, pageW, pageH, marginL, marginR, usableW);

  // === NEW PAGE: COVER LETTER ===
  doc.addPage();
  let y = 30;
  const clMargin = 25, clW = pageW - clMargin * 2;
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('Cover Letter', clMargin, y); y += 10;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  coverLetterText.split('\n').forEach(line => {
    if (y > 272) { doc.addPage(); y = 30; }
    if (line.trim()) {
      doc.splitTextToSize(line.trim(), clW).forEach(s => { doc.text(s, clMargin, y); y += 6; });
    } else { y += 3; }
  });

  // === NEW PAGE: LINKEDIN ABOUT ===
  doc.addPage(); y = 30;
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('LinkedIn About Section', clMargin, y); y += 10;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  doc.splitTextToSize(linkedinText, clW).forEach(line => { doc.text(line, clMargin, y); y += 6; });

  triggerDownload(doc, `${safeName(name)}_${safeName(role)}_Complete_Package_${dateStr()}.pdf`);
}

export function downloadLinkedInPDF(text, name) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 25, W = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 30;
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('LinkedIn About Section', margin, y); y += 10;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  doc.splitTextToSize(text, W).forEach(line => { doc.text(line, margin, y); y += 6; });
  triggerDownload(doc, `${safeName(name)}_LinkedIn_About.pdf`);
}

// --- Base64 PDF generators for email attachments ---

export function generateResumeBase64(resumeText, name, role, formData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 20, marginR = 20;
  const usableW = pageW - marginL - marginR;
  const lines = resumeText.split('\n');
  const { y, lineIndex } = renderResumeHeader(doc, lines, pageW, marginL, marginR, formData?.linkedinUrl || '', formData?.portfolioUrl || '');
  renderResumeBody(doc, lines, lineIndex, y, pageW, pageH, marginL, marginR, usableW);
  return doc.output('datauristring').split(',')[1];
}

export function generateCoverLetterBase64(text) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 25, W = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 30;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  text.split('\n').forEach(line => {
    if (y > 272) { doc.addPage(); y = 30; }
    if (line.trim()) {
      doc.splitTextToSize(line.trim(), W).forEach(s => { doc.text(s, margin, y); y += 6; });
    } else { y += 3; }
  });
  return doc.output('datauristring').split(',')[1];
}

export function generateLinkedInBase64(text) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 25, W = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 30;
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('LinkedIn About Section', margin, y); y += 10;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  doc.splitTextToSize(text, W).forEach(line => { doc.text(line, margin, y); y += 6; });
  return doc.output('datauristring').split(',')[1];
}
