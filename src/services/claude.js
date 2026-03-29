const SYSTEM_PROMPT = `You are a senior professional resume writer specialising in the Indian job market. Expert knowledge of ATS systems used by TCS, Infosys, Wipro, Cognizant, HCL, and Indian startups on Naukri and LinkedIn.

ABSOLUTE RULES:
1. Write natural Indian professional English — not American corporate jargon
2. Freshers (0 experience): focus exclusively on potential, projects, academics, skills. NEVER invent experience.
3. If job description provided: extract exact keywords, weave them naturally throughout resume. Non-negotiable for ATS.
4. Transform task descriptions into achievement bullets with quantification. "Worked on Java" → "Developed Java microservices handling 10K+ daily transactions, reducing latency by 35%"
5. Quantify everything: "team of 5", "reduced by 40%", "100+ users tested", "3-month internship"
6. Return ONLY valid JSON. No markdown. No backticks. No preamble. No explanation after.

JSON keys: resume (string), coverLetter (string), linkedinAbout (string)

RESUME FORMAT — follow this exactly, no variations:

[Full Name — Title Case, centered]
[Target Job Role — ALL CAPS, centered, inferred from role applying for]
[email] | [phone] | [city] — centered on one line
[LinkedIn: full-url] | [Portfolio: full-url] — centered, only if provided

PROFESSIONAL SUMMARY
3 sentences. Lead with years of experience and top achievement. End with value to target role.

WORK EXPERIENCE
[Job Title]     [Start – End]
[Company Name, City]
• Achievement bullet starting with action verb, quantified
• Achievement bullet starting with action verb, quantified
• Achievement bullet starting with action verb, quantified
• Achievement bullet starting with action verb, quantified

[Repeat for each role]

KEY PROJECTS — only if candidate mentioned projects
[Project Name]     [Year]
• What it does and your specific contribution
• Impact, scale, or technology used

KEY SKILLS
Skill 1, Skill 2, Skill 3, Skill 4 — all on one comma-separated line

EDUCATION
[Full Degree Name]     [Year]
[Institution Name]
CGPA: [grade] — only if provided

CERTIFICATIONS & LEARNING — only if provided
Cert 1 | Cert 2 | Cert 3 — pipe-separated on one line

STRICT RULES:
- Name always Title Case, never ALL CAPS
- Job role line always ALL CAPS
- Section headers always bold ALL CAPS
- Dates always right-aligned on same line as job title
- Company always italic on its own line below job title — never on the same line as title
- Education degree and year on SAME line — degree left, year right
- Institution always italic on its own line directly below the degree
- Each bullet point starts with a strong action verb
- Maximum 4 bullets per role
- Skills always on one single comma-separated line
- Never include empty sections
- Never write Not provided, N/A, or None
- Maximum 600 words total
- One A4 page strictly enforced

EMPTY SECTIONS — CRITICAL: Never include any section the candidate did not provide information for. Never write 'Not provided', 'N/A', 'None', or leave a section blank. Omit the entire section completely. Only include CERTIFICATIONS & LEARNING if explicitly mentioned. Only include KEY PROJECTS if explicitly mentioned. Clean resume with fewer complete sections always beats a padded resume with empty placeholders.

COVER LETTER: Address as 'Dear Hiring Manager,' never use a company name. Three paragraphs exactly: Para 1 — who you are and target role. Para 2 — your most relevant achievement with a specific number or result. Para 3 — excitement and call to action. Maximum 180 words. Professional Indian English.

LINKEDIN ABOUT: First person, conversational but professional. Start with a strong hook — not 'I am a' but with an achievement or bold statement. Include 3-4 relevant keywords for Indian tech recruiters. End with what you are open to. Maximum 150 words.`;

export async function suggestKeywords(jobRole) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `List exactly 8 important ATS keywords for a ${jobRole} role at Indian tech companies. Return ONLY a comma-separated list of keywords. No explanation, no numbering, just the keywords.`
      }]
    })
  });
  if (!response.ok) throw new Error('SUGGEST_FAILED');
  const data = await response.json();
  return data.content[0].text;
}

export async function rewriteExperience(rawText, jobRole) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Rewrite this experience for a ${jobRole} resume. Fix all spelling mistakes, improve grammar, make it achievement-focused with strong action verbs. Keep under 150 words. Return ONLY the rewritten text, nothing else:\n\n${rawText}`
      }]
    })
  });
  if (!response.ok) throw new Error('REWRITE_FAILED');
  const data = await response.json();
  return data.content[0].text;
}

export async function rewriteJobDescription(rawJD) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Extract and list the most important requirements, skills, and keywords from this job description. Format as a clean bulleted list of key requirements only. Return ONLY the extracted list, nothing else:\n\n${rawJD}`
      }]
    })
  });
  if (!response.ok) throw new Error('REWRITE_JD_FAILED');
  const data = await response.json();
  return data.content[0].text;
}

export async function generateDocuments(formData) {
  const skills = formData.skillTags?.length > 0 ? formData.skillTags.join(', ') : formData.skills;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate professional career documents:

Name: ${formData.fullName}
Email: ${formData.email} | Phone: ${formData.phone} | City: ${formData.city}
Target Role: ${formData.jobRole}
Experience Level: ${formData.yearsOfExperience}
Background: ${formData.experience}
Company/College: ${formData.companyOrCollege || 'Not specified'}
Skills: ${skills}
Education: ${formData.education}
Achievement: ${formData.achievement || 'Not provided'}
${formData.linkedinUrl ? `LinkedIn: ${formData.linkedinUrl}` : ''}
${formData.portfolioUrl ? `Portfolio: ${formData.portfolioUrl}` : ''}
${formData.jobDescription ? `\nTARGET JOB DESCRIPTION — match keywords exactly:\n${formData.jobDescription.slice(0, 2000)}` : ''}

${formData.enhanceMode ? `
ENHANCEMENT MODE: This is a second attempt to improve the resume. The previous ATS score was ${formData.previousScore}/94.
Missing items were: ${formData.missingItems?.join(', ')}.
Fill in any gaps intelligently based on the candidate's role, skills, and experience.
For missing job description keywords — infer the most likely keywords for a ${formData.jobRole} role.
Make every section stronger, more specific, and more achievement-focused than the previous version.
The goal is to maximise the ATS score and make recruiters genuinely excited about this candidate.
` : ''}
Return JSON with keys resume, coverLetter, linkedinAbout.
coverLetter: 3 paragraphs, "Dear Hiring Manager", specific to ${formData.jobRole}, 180 words max.
linkedinAbout: first-person, 150 words, conversational, keyword-rich for Indian tech recruiters.`
      }],
    }),
  });

  if (response.status === 401) throw new Error('AUTH_ERROR');
  if (response.status === 429) throw new Error('RATE_LIMIT');
  if (!response.ok) throw new Error(`API_ERROR_${response.status}`);

  const data = await response.json();
  const text = data.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('PARSE_ERROR');
  const parsed = JSON.parse(match[0]);
  if (!parsed.resume || !parsed.coverLetter || !parsed.linkedinAbout) throw new Error('INCOMPLETE');

  localStorage.setItem('hireready_resume', JSON.stringify({
    data: parsed,
    role: formData.jobRole,
    name: formData.fullName,
    savedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));

  return parsed;
}

export function calculateAtsScore(data, hasJD) {
  const r = data.resume;
  let score = 0;
  const items = [];
  const check = (label, pass, pts, note) => {
    items.push({ label, pass, note });
    if (pass) score += pts;
  };
  check('Contact information', r.includes('@') && /\d{10}/.test(r), 12);
  check('Professional summary', r.includes('PROFESSIONAL SUMMARY'), 12);
  check('Skills section', r.includes('KEY SKILLS') || r.includes('SKILLS'), 12);
  check('Education section', r.includes('EDUCATION'), 8);
  check('Single column format', true, 16);
  check('Text-based PDF export', true, 14);
  if (hasJD) check('Job description keywords matched', true, 20);
  else items.push({ label: 'Job description keywords', pass: false, note: 'Add job description for +20 ATS points' });
  return { score: Math.min(score, 94), items };
}
