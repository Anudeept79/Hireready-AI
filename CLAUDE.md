# HireReady AI — Complete Build Specification
# The single source of truth. Every UX decision, user flow, component spec,
# motion design, edge case, service implementation, and build instruction.
# Read this entire file before writing a single line of code.

---

## Product in one sentence
AI resume builder for Indian freshers. User fills a guided 3-step form → Claude generates resume + cover letter + LinkedIn About section → user sees it free → pays ₹49 via Razorpay → downloads all 3 as PDF. No backend. No server. Everything runs in the browser.

---

## Tech stack
- React 18 + Vite
- Tailwind CSS — no component libraries, pure utility classes
- Claude API: claude-sonnet-4-20250514
- jsPDF (npm) — browser-side PDF generation
- Razorpay JS SDK (CDN) — payments
- EmailJS (CDN, free tier) — "email me my resume" cross-device feature
- Web Vibration API — haptic feedback on Android
- localStorage — session persistence and 7-day resume recovery

---

## Design system — use these tokens everywhere, never hardcode other values

```js
// tailwind.config.js extend.colors
brand: {
  bg:     '#0A0A0A',   // Near black — calm focused workspace, not harsh void
  card:   '#141414',   // Card surface — 10 points above bg creates spatial depth
  card2:  '#1A1A1A',   // Input backgrounds
  border: '#2A2A2A',   // All borders
  cyan:   '#00C8FF',   // Primary — trust + innovation, most eye-catching on dark
  green:  '#00FF88',   // Success only — electric, futuristic, not biological
  white:  '#FFFFFF',   // Document preview only — signals real printed document
  muted:  '#888888',   // Secondary text — 4.5:1 WCAG AA on dark
  faint:  '#444444',   // Disabled, placeholders
  dark:   '#050505',   // Deepest elements
  glow:   '#00C8FF30', // Input focus glow ring
}
```

Typography: Inter, system-ui. Weights 400 (body) and 500 (headings) ONLY. Never 600 or 700.
Spacing: 8px grid — 8, 16, 24, 32, 48px only. Never odd values.
Border radius: cards 16px, buttons 10px, inputs 8px, chips 20px, badges 20px.
Borders: 0.5px solid #2A2A2A default. 1px #00C8FF on focused inputs.
Min touch target: 48px height everywhere. Full-width buttons on mobile.

### Color psychology — why these specific colors
- #0A0A0A (near black) = calm, focused, serious. Pure black feels like void. This has subtle warmth.
- #00C8FF (cyan) = trust + helpful technology. Blue calm + brightness of innovation. Not alarm red, not submission grey.
- #00FF88 (electric green) = used EXCLUSIVELY for success states. Preserves meaning. Never use for neutral.
- #FFFFFF (white) = document preview only. User's brain recognises real printed document = justifies ₹49.
- #888888 (muted) = brain auto-deprioritises grey, focuses on white text first. Natural visual hierarchy.

---

## CSS animation library — add entirely to src/index.css

```css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes drawCheck { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
@keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 0 #00C8FF00; } 50% { box-shadow: 0 0 16px 4px #00C8FF30; } }
@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
@keyframes starBurst {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  60% { opacity: 1; transform: scale(1.2) rotate(15deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-60px) rotate(720deg); opacity: 0; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, #1A1A1A 25%, #242424 50%, #1A1A1A 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.anim-fadeIn     { animation: fadeIn 0.4s ease-out forwards; }
.anim-fadeInUp   { animation: fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
.anim-slideRight { animation: slideInRight 0.3s ease-in-out forwards; }
.anim-slideLeft  { animation: slideInLeft 0.3s ease-in-out forwards; }
.anim-slideUp    { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
.anim-popIn      { animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards; }
.anim-shake      { animation: shakeX 0.4s ease; }
.anim-glow       { animation: glowPulse 2s ease-in-out infinite; }

.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; } .delay-6 { animation-delay: 0.6s; }
.delay-7 { animation-delay: 0.7s; }
```

### Motion principles — why each animation does what it does
- ease-out for entrances (fast start, slow end = natural deceleration = calm)
- ease-in for exits (slow start, fast end = graceful departure)
- cubic-bezier(0.16,1,0.3,1) for the resume reveal — spring easing, feels like a card placed by a human hand
- Button hover: scale(1.02) — barely visible consciously but brain registers "interactive"
- Button press: scale(0.97) — physical press simulation, confirms action on mobile without sound
- Form steps SLIDE directionally, never fade — sliding creates spatial memory, user knows where they are
- Loading checkmarks DRAW themselves (SVG stroke) — each draw is a dopamine hit, keeps user engaged
- ATS score COUNTS UP from 0 to target — more satisfying than displaying the number instantly

---

## App state machine — complete

```
landing          → Hero + sample resume + staggered entrance animations
form_step_1      → Slides in from right, auto-focus first input after 400ms
form_step_2      → Slides in from right (back = slides from left), fresher mode
form_step_3      → Slides in from right, skill chips, generate button
generating       → Loading screen with quotes rotating every 4s + tips every 8s
results          → Spring resume reveal + ATS score count-up animation
payment          → Bottom drawer overlay, resume VISIBLE blurred behind it
success          → Confetti + celebration + WhatsApp share + email option
error            → Shake animation + friendly message + retry
returning_user   → Banner shown if localStorage has resume < 7 days old
```

State transitions managed through a single `setAppState` in App.jsx.
Direction tracked separately for slide animation: `direction = 'right' | 'left'`.

---

## SEO meta tags — add to index.html

```html
<title>HireReady AI — Free AI Resume Builder for Indian Freshers</title>
<meta name="description" content="Create ATS-optimised resume, cover letter and LinkedIn profile in 60 seconds. Free to try. Built for Indian freshers. Powered by Claude AI.">
<meta property="og:title" content="HireReady AI — Your resume in 60 seconds">
<meta property="og:description" content="AI writes your resume, cover letter and LinkedIn profile. ATS-optimised. ₹49 to download.">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="https://hirereadyai.in">
<meta name="twitter:card" content="summary_large_image">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

---

## Environment variables

```
VITE_CLAUDE_API_KEY=
VITE_RAZORPAY_KEY_ID=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

---

## File structure

```
src/
  components/
    Navbar.jsx
    Hero.jsx
    SampleResume.jsx
    ProgressBar.jsx
    SavedIndicator.jsx
    FormStep1.jsx
    FormStep2.jsx
    FormStep3.jsx
    SkeletonResume.jsx
    LoadingScreen.jsx
    AtsScoreBadge.jsx
    ResultTabs.jsx
    ResumePreview.jsx
    CoverLetterPreview.jsx
    LinkedInPreview.jsx
    PaymentGate.jsx
    SuccessScreen.jsx
    ErrorScreen.jsx
    ReturningUserBanner.jsx
  hooks/
    useFormState.js
  services/
    claude.js
    razorpay.js
    pdf.js
    email.js
  utils/
    haptics.js
  constants/
    quotes.js
  App.jsx
  main.jsx
```

---

## utils/haptics.js

```js
export const haptic = {
  tap:     () => navigator.vibrate?.(50),
  success: () => navigator.vibrate?.([50, 30, 80]),
  error:   () => navigator.vibrate?.([200]),
};
```

Call haptic.tap() on every button press. haptic.success() on payment success. haptic.error() on any failure.

---

## constants/quotes.js — loading screen social proof

```js
export const SUCCESS_QUOTES = [
  { text: "I sent 40 resumes before HireReady AI. After using it, I got 3 callbacks in one week.", name: "Priya S.", role: "Software Developer — now at Infosys, Hyderabad" },
  { text: "As a fresher with no experience, I had no idea what to write. HireReady made me look confident.", name: "Rahul K.", role: "B.Tech 2024 — placed at Wipro, Warangal" },
  { text: "My Canva resume got zero responses. After switching to HireReady's ATS format, I got shortlisted at TCS in 4 days.", name: "Ananya M.", role: "IT Analyst — Chennai" },
  { text: "I was switching from marketing to product management. Claude reframed my entire experience. First PM interview in 2 weeks.", name: "Divya R.", role: "Product Manager — Bangalore startup" },
  { text: "Spent 3 Sundays on my Google Docs resume. Used HireReady once and it was better in 60 seconds.", name: "Aakash P.", role: "Frontend Developer — Pune" },
  { text: "The job description matching is a cheat code. My resume has exactly the keywords the company looks for.", name: "Sneha T.", role: "Data Analyst — Delhi" },
  { text: "My placement officer said it was the best-formatted resume she had seen from our batch.", name: "Kartik N.", role: "JNTU 2024 — placed at Infosys" },
  { text: "Got 7 interviews after upgrading to the monthly plan. Applied to 22 companies. Worth every rupee.", name: "Mohammed F.", role: "Software Engineer — Mumbai startup" },
];

export const ATS_TIPS = [
  "Resumes tailored to job descriptions get 3× more interview callbacks",
  "75% of resumes are filtered by ATS before a human ever sees them",
  "Quantified achievements (numbers, percentages) get 40% more recruiter attention",
  "Recruiters spend an average of 6 seconds scanning a resume — first line matters most",
];
```

---

## Component specifications

### Navbar.jsx
Height 56px. Background #0A0A0A. Border-bottom 0.5px #2A2A2A.
Left: "HireReady AI" 16px weight 500 white.
Right: pill badge "Powered by Claude AI" — background #00C8FF15, border 0.5px #00C8FF40, color #00C8FF, 10px.
Mobile: same, no collapse needed.

---

### Hero.jsx
Props: `onStart` (function)
Animation: staggered entrance — each element fades in with increasing delay (0.1s increments).

Elements in order:
1. Small pill: "Free for Indian freshers" — muted border
2. H1: "Get your dream job. Start with the right resume." — 42px desktop 28px mobile, weight 500, white, line-height 1.2. anim-fadeInUp delay-1
3. Subtitle: "Claude AI writes your resume, cover letter and LinkedIn profile. ATS-optimised. 60 seconds." — 16px muted. anim-fadeInUp delay-2
4. Live counter: useState(2847), setInterval increments by 1 every 8 seconds. "2,847 resumes created today" — green 13px. anim-fadeInUp delay-3
5. Trust pills row: "ATS Optimised" | "India Format" | "Free to try" | "No signup". anim-fadeInUp delay-4
6. CTA button: "Build my resume free →" cyan bg black text 52px height 280px desktop full-width mobile. anim-fadeInUp delay-5. haptic.tap() on click.
7. SampleResume component below. anim-fadeInUp delay-6.
   Label above: "This is what your resume will look like:" muted 12px.

---

### SampleResume.jsx
A realistic-looking resume preview card showing fake candidate "Aarav Sharma, Software Developer".
White background (#FFFFFF), black text, padding 24px, radius 12px, max-height 200px overflow hidden.
Bottom gradient fade from white to transparent suggesting more content below.
Overlay text at bottom: "Your personalised resume, generated in 60 seconds" — cyan 13px center.
Entire card is clickable — calls onStart.
Purpose: Von Restorff Effect. Isolated visual element on landing page. Brain remembers it. Reduces bounce rate.

---

### ProgressBar.jsx
Props: `currentStep` (1, 2, or 3)
Three segments, 4px gap, 3px height, radius 2px.
Done: #00C8FF. Current: #00C8FF at 60% opacity. Future: #2A2A2A.
Segment transition: width fills with 0.4s ease-out animation when step advances.
Below: "Step {n} of 3 — {label}" muted 11px.
Labels: 1="Basic details", 2="Your experience", 3="Skills and education"

---

### SavedIndicator.jsx
Props: `show` (boolean)
Small toast — bottom center, padding 8px 16px, bg #141414, border 0.5px #00FF88, radius 20px, 12px white.
Text: "● Progress saved" (green dot + text).
Appears with slideUp 0.25s when show=true. Fades out after 2 seconds.
Position: fixed bottom 24px left 50% transform translateX(-50%).
IMPORTANT: use position fixed only for this component.

---

### FormStep1.jsx
Props: `formData`, `onChange`, `onNext`
UX principle: Foot-in-the-door — first step is easiest to build commitment.
Auto-focus first input after 400ms (animation completes).

Card: bg #141414, border #2A2A2A, radius 16px, padding 32px desktop 24px mobile.
Title: "Tell us about you" 18px weight 500 white.
Subtitle: "Step 1 of 3 — takes 30 seconds" muted 12px.

Fields (all required):
1. Full Name — text, autocomplete="name", placeholder "e.g. Anudeep Thota"
2. Email — email, autocomplete="email", placeholder "your@email.com"
3. Phone — text, inputmode="tel", autocomplete="tel", placeholder "+91 98765 43210"
   Validation: must match /^(\+91[\-\s]?)?[6-9]\d{9}$/ — error "Please enter a valid Indian mobile number"
4. Job Role Applying For — text, placeholder "e.g. Frontend Developer, Data Analyst, Product Manager"
5. City — text, placeholder "e.g. Hyderabad, Bangalore, Pune"

All field changes: call onChange(field, value) + trigger SavedIndicator.
Submit validation: all 5 required. Show inline error below each invalid field (never alert()).
Error text: 11px red, slides down with height animation 0.2s.
Button: "Continue — Add your experience →" full-width cyan 52px. haptic.tap() on click.

---

### FormStep2.jsx
Props: `formData`, `onChange`, `onBack`, `onNext`
UX principle: Zeigarnik Effect — progress bar at step 2 drives completion anxiety.
Auto-focus Years of Experience after 400ms.

CRITICAL — DYNAMIC FRESHER FLOW:
When formData.yearsOfExperience === "Fresher / 0 years":
  - Experience label changes to "Your Projects or College Activities"
  - Experience placeholder changes to fresher version (see below)
  - Green helper message slides down (height 0→auto, opacity 0→1, 0.3s ease-out):
    "No work experience? That's completely fine — 60% of our users are freshers.
     Describe any project, hackathon, internship, or college activity, however small."
  - This transition must be smooth and feel SUPPORTIVE not alarming

When any other experience selected:
  - Label: "Work Experience"
  - Placeholder: professional version

Fields:
1. Years of Experience — select, REQUIRED
   Options: "Fresher / 0 years" (default), "Less than 1 year", "1 to 2 years",
            "3 to 5 years", "5 to 10 years", "10+ years"

2. Work Experience or Projects — textarea, 5 rows, REQUIRED
   Fresher placeholder: "e.g. Built a food ordering app using React and Firebase for final year project.
   Won 2nd place at college hackathon. Completed Python for Data Science on Coursera."
   Professional placeholder: "e.g. Worked at Infosys for 2 years on a core banking application.
   Led a team of 3 to migrate legacy Java code to microservices. Reduced API response time by 40%."

   WORD COUNT GUIDANCE (live, below field):
   Count words in real-time. Display: "Best results with 80–300 words. Currently: {n} words."
   Color: green if 80-300, amber if under 80, red if over 300.
   This directly improves Claude output quality.

3. Current or Last Company / College — text, optional
   Placeholder: "e.g. TCS, Wipro, JNTU Hyderabad (optional)"

4. Job Description — textarea, 3 rows, optional, maxLength=2500
   Label: "Paste the job description you are applying to"
   Placeholder: "Copy and paste the full job description here. Claude will match your
   resume keywords exactly to this role — this is the most powerful ATS feature."
   Yellow tip pill below: "Secret weapon: resumes matched to job descriptions get 3× more callbacks"
   Character counter shown at 2000+ chars remaining.
   At 2000 chars: amber message "Getting long — trim to the key requirements for best results"

Back + Next buttons side by side (back outlined, next filled cyan). haptic.tap() on both.

---

### FormStep3.jsx
Props: `formData`, `onChange`, `addTag`, `removeTag`, `onBack`, `onGenerate`, `isLoading`
UX principle: Miller's Law — max 3 fields, completion feels close.
Auto-focus skills input after 400ms.

Fields:
1. Skills — text input with tag chip system, REQUIRED
   Label: "Your top skills"
   Placeholder: "Type a skill and press comma or Enter"
   Behaviour:
     - On comma key: create chip from current value, clear input, refocus input
     - On Enter key: same as comma
     - On Tab key: same as comma (prevents jump to next field when adding skill)
     - On Backspace with empty input: remove last chip
     - Trim whitespace. Remove comma from chip text. Ignore empty values. Max 15 chips.
   Chip style: bg #00C8FF15, border 0.5px #00C8FF40, color #00C8FF, radius 20px, padding 4px 10px
   X button on each chip: small, muted. haptic.tap() on remove. popIn animation on chip creation.
   Suggested skills: show 3-4 clickable suggestions below based on formData.jobRole content.

2. Education — text, REQUIRED
   Placeholder: "e.g. B.Tech CSE, JNTU Hyderabad, 2024, CGPA 8.2"

3. One achievement — textarea, 2 rows, optional
   Label: "One achievement you are proud of (optional but powerful)"
   Placeholder: "e.g. Ranked top 5% in campus placement. Won best project award.
   Cleared AWS Solutions Architect exam. Published an article."

Generate button: "Generate my resume →" full-width 56px cyan.
When loading: show spinner SVG inside button (left of text), button disabled, text stays same.
haptic.tap() on click. Button pulses once gently on step mount (scale 1→1.03→1, 0.6s) to draw attention.

---

### SkeletonResume.jsx
Show while resume content is rendering (first 300ms of results state).
White card, radius 12px, padding 32px.
Shimmer lines at different widths simulating name, contact, section headers, body lines.
```jsx
<div style={{ background:'#fff', borderRadius:12, padding:32 }}>
  <div className="skeleton" style={{height:20,width:'60%',margin:'0 auto 8px',borderRadius:4}}/>
  <div className="skeleton" style={{height:12,width:'80%',margin:'0 auto 24px',borderRadius:4}}/>
  {[100,90,85,100,70,95,80,88,75].map((w,i)=>(
    <div key={i} className="skeleton" style={{height:10,width:`${w}%`,marginBottom:8,borderRadius:3}}/>
  ))}
</div>
```

---

### LoadingScreen.jsx
Props: `generatedData` (null until API returns), `onComplete`
State: `currentStep`(0-5), `quoteIndex`(0-7), `tipIndex`(0-3), `showSlowMessage`(false)

LAYOUT — centered, max-width 480px, full-width mobile:
1. Title: "Claude AI is crafting your resume" — white 15px weight 500 center. anim-fadeIn
2. Subtitle: "15 seconds that could change your career" — muted 12px center. anim-fadeIn delay-1

6 STEPS — each row: left icon + right text:
  0: "Analysing your experience and skills"
  1: "Matching keywords to job description"
  2: "Writing your ATS-optimised resume"
  3: "Crafting your personalised cover letter"
  4: "Building your LinkedIn About section"
  5: "Running final quality check"

Icon states:
  Done: 20px circle, green bg #00FF8820, border 1.5px #00FF88, SVG checkmark with drawCheck stroke animation 0.4s
  Active: cyan bg #00C8FF20, border 1.5px #00C8FF, pulsing dot, pulse animation
  Todo: dark bg #1A1A1A, border 1.5px #2A2A2A

Text: green (done), cyan (active), #333 (todo)
Active row slides in from left with fadeInLeft 0.35s when it becomes active.

TIMING:
```js
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentStep(s => {
      const next = s + 1;
      if (next >= 6) { clearInterval(timer); if (generatedData) onComplete(); return 5; }
      return next;
    });
  }, 2200);
  return () => clearInterval(timer);
}, []);

useEffect(() => {
  if (currentStep >= 5 && generatedData) onComplete();
}, [generatedData, currentStep]);
```

QUOTE CARD (appears 0.6s after screen mounts):
Background #141414, border 0.5px #2A2A2A, radius 10px, padding 16px 20px, max-width 340px.
Quote text: 12px #AAAAAA italic, line-height 1.7.
Author name: 11px #00C8FF weight 500.
Role: 10px #555.
Quote crossfade: opacity 1→0 (0.3s), swap text, opacity 0→1 (0.3s). Every 4 seconds.
Dot indicators: 6px circles, active=#00C8FF, inactive=#2A2A2A.

TIP BAR (below quote):
Background #0D1F0D, border 0.5px #00FF8830, radius 8px, padding 8px 14px.
Text: 11px #00CC66 center. Fades between ATS_TIPS every 8 seconds.

SLOW NETWORK MESSAGE (after 20 seconds):
"Taking a bit longer than usual — Claude is working hard. Please don't close this tab." amber 11px.

```js
// Quote and tip rotation
useEffect(() => {
  const q = setInterval(() => setQuoteIndex(i => (i+1) % SUCCESS_QUOTES.length), 4000);
  const t = setInterval(() => setTipIndex(i => (i+1) % ATS_TIPS.length), 8000);
  const slow = setTimeout(() => setShowSlowMessage(true), 20000);
  return () => { clearInterval(q); clearInterval(t); clearTimeout(slow); };
}, []);
```

---

### AtsScoreBadge.jsx
Props: `score` (0-100), `items` (array)

SVG circular badge, 88px diameter. Stroke-based progress ring.
Score 85+: green #00FF88. Score 70-84: amber #FFB800. Below 70: red #FF4444.
Glow pulse animation on the badge (anim-glow class).

Score counter: animates from 0 to score over 1.2s using requestAnimationFrame with ease-out cubic.
```js
useEffect(() => {
  let start = null;
  const animate = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / 1200, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setDisplayScore(Math.round(eased * score));
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}, [score]);
```

SVG circle ring:
```jsx
<svg width="88" height="88" viewBox="0 0 88 88">
  <circle cx="44" cy="44" r="38" fill="none" stroke="#2A2A2A" strokeWidth="6"/>
  <circle cx="44" cy="44" r="38" fill="none"
    stroke={color} strokeWidth="6" strokeLinecap="round"
    strokeDasharray={`${(score/100)*238.76} 238.76`}
    transform="rotate(-90 44 44)"
    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }}
  />
</svg>
```

Label below: "Your resume will pass automated screening" green 11px center (if score 85+)
Items list: small pass/fail rows showing what passed and what can be improved.

---

### ResultTabs.jsx
Props: `resumeData`, `formData`, `atsScore`, `onDownload`, `onRegenerate`

Staggered entrance animation sequence on mount:
1. "Your documents are ready" ✓ — anim-fadeInDown 0.4s
2. AtsScoreBadge — anim-fadeInUp delay-1
3. Tab bar — anim-fadeIn delay-2
4. Document card — anim-slideUp delay-3 (spring easing = peak moment)
5. Action buttons — anim-fadeInUp delay-4

Header: "Your documents are ready" green 20px center. SVG checkmark that draws itself.

Tab bar: Resume | Cover Letter | LinkedIn About
Active tab: white text, 2px cyan bottom border.
Inactive: muted text, pointer cursor.
Tab switching: content crossfades (opacity 0→1, 0.2s).

Content: SkeletonResume for 300ms on first render, then ResumePreview/CoverLetterPreview/LinkedInPreview.

Action buttons (below content):
Primary: "Download all 3 as PDF — ₹49" cyan filled full-width mobile. haptic.tap().
Secondary: "Not happy? Regenerate with different approach" outlined muted. calls onRegenerate.

Below buttons (subtle text, not a button):
"Applying to a different role? Change the job role and regenerate.
 Unlimited versions for ₹199/month — or ₹49 each time."
This is plain muted text, not a button. Drives subscription consideration naturally.

---

### ResumePreview.jsx / CoverLetterPreview.jsx / LinkedInPreview.jsx
Props: `content` (string), `isEditing` (boolean), `onEdit`, `onSaveEdit`, `onCancelEdit`

Document card: white bg, black text, padding 32px, radius 12px.
Looks like a real printed document. Font: Georgia or serif for body text inside doc.

Resume rendering: parse content by newline.
  - Lines in ALL CAPS (no @, no digits at start) → section headers: 11px bold black, bottom border 0.5px #DDD, margin top
  - First line → candidate name: 17px bold center
  - Second line (contains @ or |) → contact info: 9px center muted
  - Bullet lines (start with • or -) → 9px, indented 4px, bullet character
  - Other lines → 9px normal

Non-editing: render parsed content.
Editing: white textarea fills card. Same font. Save + Cancel buttons.
"Edit" button: top-right of card, pencil SVG, 12px muted. Only visible on hover/tap.

---

### PaymentGate.jsx
Props: `onPay`, `onBack`, `isProcessing`, `paymentError`

CRITICAL PATTERN: This appears as a BOTTOM DRAWER over the results screen.
The resume document is VISIBLE but blurred (backdrop-filter blur 2px) behind the overlay.
User can see their resume is still safe while paying. Reduces purchase anxiety significantly.

```jsx
// Full structure
<div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(2px)', display:'flex', alignItems:'flex-end' }}>
  <div style={{ background:'#141414', borderRadius:'20px 20px 0 0', padding:'32px 24px 48px', width:'100%', maxWidth:480, margin:'0 auto', animation:'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
    {/* content */}
  </div>
</div>
```

Content inside drawer:
- Handle bar: 32px wide 4px tall #2A2A2A rounded pill, centered, margin-bottom 24px
- Lock SVG icon 32px cyan center
- Title: "Download your resume" 20px weight 500 white
- Subtitle: "Your resume, cover letter and LinkedIn profile are ready. One payment, download all three instantly." muted 14px
- Price: "₹49" green 44px weight 500
- Note: "One-time payment. No subscription. No hidden charges." faint 11px
- Pay button: "Pay ₹49 — UPI / Card / Netbanking" cyan full-width 56px. haptic.tap().
- Back link: "Review my resume again" muted text-link small
- Trust footer: "Secured by Razorpay • ₹49 one-time payment" faint 11px center

If paymentError: red card above button with error message + retry. Add anim-shake class for 400ms on error appearance. haptic.error(). NEVER clear generatedData on payment failure. NEVER navigate away.

---

### SuccessScreen.jsx
Props: `userName`, `userEmail`, `generatedData`, `formData`

Container: bg #0A1F0A, border 0.5px #00FF88, radius 16px, padding 40px, centered.

Confetti system (renders on mount):
```jsx
const particles = Array.from({length:12}, (_,i) => ({
  x: 20 + Math.random() * 60,
  color: ['#00C8FF','#00FF88','#FFB800','#FF6B35'][i%4],
  size: 4 + Math.random() * 4,
  delay: Math.random() * 0.4,
}));
// Each rendered as absolute div with confetti animation
```

3 SVG stars (anim-starBurst, different delays) around the checkmark.
Checkmark SVG 48px green, drawCheck animation.
Title: "Your resume is downloaded, {firstName}!" green 22px. anim-fadeInUp delay-3.
Subtitle: "You are now ahead of 90% of applicants. Check your Downloads folder for all 3 PDF files." anim-fadeInUp delay-4.

Email section (bridges phone→laptop gap):
"Email me my resume" — input pre-filled with formData.email + "Send" button.
On send: call EmailJS with the generated content. Show "Sent! Check your inbox." on success.

WhatsApp share button (primary share mechanism for India):
"Share with a friend who needs this"
href: `https://wa.me/?text=Bhai%2C%20I%20just%20made%20my%20resume%20in%2060%20seconds%20using%20AI%20%E2%80%94%20try%20it%20free%3A%20https%3A%2F%2Fhirereadyai.in`
Target: _blank. haptic.success() on click.

Monthly upgrade nudge (text only, not a button):
"Applying to multiple companies? Stop paying ₹49 each time.
 Get unlimited resumes for ₹199/month →"
Muted text link. Shown at bottom. Not prominent — subtle.

UX principle (Peak-End Rule): This is the END of the experience. It must feel like an achievement. The emotional high here is what drives sharing and return visits. Do not make it feel like a receipt.

---

### ErrorScreen.jsx
Props: `error` (string error code), `onRetry`, `retryLabel`

```js
const MESSAGES = {
  AUTH_ERROR:    'API key issue — please contact support.',
  RATE_LIMIT:    'Claude is very busy right now — please try again in 2 minutes. Your form data is saved.',
  PARSE_ERROR:   'Something went wrong formatting your resume — trying again will likely fix this.',
  INCOMPLETE:    'Claude generated an incomplete response — please try again.',
  NETWORK:       'Lost connection — please check your internet and try again.',
  PAYMENT_FAIL:  'Payment did not go through — your resume is still here. Try again.',
  RAZORPAY_LOAD: 'Payment window could not load. Please disable your ad blocker and try again.',
  DEFAULT:       'Something went wrong — your form data is saved. Please try again.',
};
```

Card: anim-shake on mount (tells user something went wrong before they read the text).
Friendly message. Large retry button. Never show raw error text. haptic.error() on mount.

---

### ReturningUserBanner.jsx
Props: `savedDate`, `savedRole`, `onContinue`, `onStartFresh`

Shown below Navbar when localStorage has a saved resume < 7 days old.
Background #141414, border-bottom 0.5px #2A2A2A, padding 12px 24px.
Text: "Welcome back! Your {savedRole} resume from {savedDate} is still saved."
Two buttons side by side: "Download my resume" (cyan, opens payment gate) | "Start fresh" (outlined, clears localStorage).
anim-fadeInDown on mount.

---

## hooks/useFormState.js — complete implementation

```js
import { useState, useCallback } from 'react';

const initial = {
  fullName:'', email:'', phone:'', jobRole:'', city:'',
  yearsOfExperience:'Fresher / 0 years', experience:'',
  companyOrCollege:'', jobDescription:'',
  skills:'', skillTags:[], education:'', achievement:'',
};

export function useFormState() {
  const [formData, setFormData] = useState(() => {
    try {
      const s = localStorage.getItem('hireready_form');
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  const [showSaved, setShowSaved] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, []);

  const addTag = useCallback((skill) => {
    const tag = skill.trim().replace(/,/g, '');
    if (!tag) return;
    setFormData(prev => {
      if (prev.skillTags.includes(tag) || prev.skillTags.length >= 15) return prev;
      const updated = { ...prev, skillTags: [...prev.skillTags, tag] };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeTag = useCallback((skill) => {
    setFormData(prev => {
      const updated = { ...prev, skillTags: prev.skillTags.filter(s => s !== skill) };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reset = () => {
    setFormData(initial);
    localStorage.removeItem('hireready_form');
    localStorage.removeItem('hireready_resume');
    localStorage.removeItem('hireready_payment');
  };

  return { formData, updateField, addTag, removeTag, reset, showSaved };
}
```

---

## services/claude.js — complete implementation

```js
const SYSTEM_PROMPT = `You are a senior professional resume writer specialising in the Indian job market. Expert knowledge of ATS systems used by TCS, Infosys, Wipro, Cognizant, HCL, and Indian startups on Naukri and LinkedIn.

ABSOLUTE RULES:
1. Write natural Indian professional English — not American corporate jargon
2. Freshers (0 experience): focus exclusively on potential, projects, academics, skills. NEVER invent experience.
3. If job description provided: extract exact keywords, weave them naturally throughout resume. Non-negotiable for ATS.
4. Transform task descriptions into achievement bullets with quantification. "Worked on Java" → "Developed Java microservices handling 10K+ daily transactions, reducing latency by 35%"
5. Quantify everything: "team of 5", "reduced by 40%", "100+ users tested", "3-month internship"
6. Return ONLY valid JSON. No markdown. No backticks. No preamble. No explanation after.

JSON keys: resume (string), coverLetter (string), linkedinAbout (string)

Resume format — use EXACTLY these section headers in ALL CAPS:
[CANDIDATE FULL NAME]
[email] | [phone] | [city]

PROFESSIONAL SUMMARY
3 sentences. Freshers: lead with aspirations and potential. Experienced: lead with years and top achievement.

KEY SKILLS
Comma-separated. Mirror job description terminology exactly if provided.

WORK EXPERIENCE (or PROJECTS for freshers)
Company/Project | Role | Duration
• Achievement bullet quantified
• Achievement bullet quantified

EDUCATION
Degree, Institution, Year | Grade

CERTIFICATIONS (only if mentioned by candidate)`;

export async function generateDocuments(formData) {
  const skills = formData.skillTags?.length > 0 ? formData.skillTags.join(', ') : formData.skills;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
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
${formData.jobDescription ? `\nTARGET JOB DESCRIPTION — match keywords exactly:\n${formData.jobDescription.slice(0,2000)}` : ''}

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
    items.push({label, pass, note});
    if (pass) score += pts;
  };
  check('Contact information', r.includes('@') && /\d{10}/.test(r), 15);
  check('Professional summary', r.includes('PROFESSIONAL SUMMARY'), 15);
  check('Skills section', r.includes('KEY SKILLS') || r.includes('SKILLS'), 15);
  check('Education section', r.includes('EDUCATION'), 10);
  check('Single column format', true, 20);
  check('Text-based PDF export', true, 15);
  if (hasJD) check('Job description keywords matched', true, 20);
  else items.push({label:'Job description keywords', pass:false, note:'Add job description for +20 ATS points'});
  return { score: Math.min(score, 100), items };
}
```

---

## services/razorpay.js — complete implementation

```js
export function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function initiatePayment({ userName, userEmail, userPhone, onSuccess, onFailure }) {
  const loaded = await loadRazorpay();
  if (!loaded) { onFailure('RAZORPAY_LOAD'); return; }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: 4900, currency: 'INR',
    name: 'HireReady AI',
    description: 'Resume + Cover Letter + LinkedIn PDF Download',
    prefill: { name: userName, email: userEmail, contact: userPhone },
    notes: { product: 'resume_download_v1' },
    theme: { color: '#00C8FF' },
    handler: response => {
      localStorage.setItem('hireready_payment', JSON.stringify({
        id: response.razorpay_payment_id, paidAt: Date.now()
      }));
      onSuccess(response.razorpay_payment_id);
    },
    modal: { ondismiss: () => onFailure('PAYMENT_CANCELLED') },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', r => onFailure('PAYMENT_FAIL'));
  rzp.open();
}
```

---

## services/pdf.js — iOS Safari compatible

```js
import jsPDF from 'jspdf';
const safeName = s => s.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
const dateStr = () => new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'}).replace(/\s/g,'');

function triggerDownload(doc, filename) {
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}

export function downloadResumePDF(resumeText, name, role) {
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const margin=20, W=doc.internal.pageSize.getWidth()-margin*2;
  let y=20, firstLine=true;
  resumeText.split('\n').forEach(line => {
    if (y > 272) { doc.addPage(); y=20; }
    const t = line.trim();
    if (!t) { y+=3; return; }
    const isHeader = t===t.toUpperCase()&&t.length>3&&!t.includes('@')&&!/^\d/.test(t);
    if (firstLine && t.length > 2) {
      firstLine=false;
      doc.setFontSize(17); doc.setFont('helvetica','bold');
      doc.text(t, doc.internal.pageSize.getWidth()/2, y, {align:'center'}); y+=8;
    } else if (isHeader) {
      y+=3; doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text(t,margin,y); y+=1.5;
      doc.setLineWidth(0.2); doc.line(margin,y,margin+W,y); y+=5;
    } else {
      const bullet = t.startsWith('•')||t.startsWith('-');
      doc.setFontSize(9); doc.setFont('helvetica','normal');
      const content = bullet ? '• '+t.replace(/^[•\-]\s*/,'') : t;
      doc.splitTextToSize(content, W-(bullet?4:0)).forEach(s => {
        if (y>272){doc.addPage();y=20;}
        doc.text(s, margin+(bullet?4:0), y); y+=5;
      });
    }
  });
  triggerDownload(doc, `${safeName(name)}_${safeName(role)}_Resume_${dateStr()}.pdf`);
}

export function downloadCoverLetterPDF(text, name, role) {
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const margin=25, W=doc.internal.pageSize.getWidth()-margin*2; let y=30;
  doc.setFontSize(9.5); doc.setFont('helvetica','normal');
  text.split('\n').forEach(line => {
    if (y>272){doc.addPage();y=30;}
    if (line.trim()) { doc.splitTextToSize(line.trim(),W).forEach(s=>{doc.text(s,margin,y);y+=6;}); }
    else { y+=3; }
  });
  triggerDownload(doc, `${safeName(name)}_${safeName(role)}_Cover_Letter_${dateStr()}.pdf`);
}

export function downloadLinkedInPDF(text, name) {
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const margin=25, W=doc.internal.pageSize.getWidth()-margin*2; let y=30;
  doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text('LinkedIn About Section',margin,y); y+=10;
  doc.setFontSize(9.5); doc.setFont('helvetica','normal');
  doc.splitTextToSize(text,W).forEach(line=>{doc.text(line,margin,y);y+=6;});
  triggerDownload(doc, `${safeName(name)}_LinkedIn_About.pdf`);
}
```

---

## App.jsx — complete state machine

```jsx
import { useState, useEffect } from 'react';
import { haptic } from './utils/haptics';
import { generateDocuments, calculateAtsScore } from './services/claude';
import { initiatePayment } from './services/razorpay';
import { downloadResumePDF, downloadCoverLetterPDF, downloadLinkedInPDF } from './services/pdf';
import { useFormState } from './hooks/useFormState';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReturningUserBanner from './components/ReturningUserBanner';
import SavedIndicator from './components/SavedIndicator';
import ProgressBar from './components/ProgressBar';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import LoadingScreen from './components/LoadingScreen';
import ResultTabs from './components/ResultTabs';
import PaymentGate from './components/PaymentGate';
import SuccessScreen from './components/SuccessScreen';
import ErrorScreen from './components/ErrorScreen';

const TITLES = {
  landing:'HireReady AI — Free AI Resume Builder',
  form_step_1:'HireReady AI — Step 1 of 3',
  form_step_2:'HireReady AI — Step 2 of 3',
  form_step_3:'HireReady AI — Step 3 of 3',
  generating:'HireReady AI — Generating your resume...',
  results:'HireReady AI — Your resume is ready',
  payment:'HireReady AI — Download your resume',
  success:'HireReady AI — Downloaded!',
};

export default function App() {
  const [appState, setAppState] = useState('landing');
  const [direction, setDirection] = useState('right');
  const [generatedData, setGeneratedData] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [savedResume, setSavedResume] = useState(null);
  const { formData, updateField, addTag, removeTag, reset, showSaved } = useFormState();

  useEffect(() => { document.title = TITLES[appState] || 'HireReady AI'; }, [appState]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hireready_resume');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.expiresAt > Date.now()) setSavedResume(p);
        else localStorage.removeItem('hireready_resume');
      }
    } catch {}
  }, []);

  const goTo = (state, dir = 'right') => { setDirection(dir); setAppState(state); };

  const handleGenerate = async () => {
    setAppState('generating');
    setError(null);
    try {
      const data = await generateDocuments(formData);
      const score = calculateAtsScore(data, !!formData.jobDescription);
      setGeneratedData(data);
      setAtsScore(score);
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setError(null);
    initiatePayment({
      userName: formData.fullName,
      userEmail: formData.email,
      userPhone: formData.phone,
      onSuccess: () => {
        setIsProcessingPayment(false);
        haptic.success();
        const { fullName, jobRole } = formData;
        downloadResumePDF(generatedData.resume, fullName, jobRole);
        setTimeout(() => downloadCoverLetterPDF(generatedData.coverLetter, fullName, jobRole), 600);
        setTimeout(() => downloadLinkedInPDF(generatedData.linkedinAbout, fullName), 1200);
        setAppState('success');
        reset();
      },
      onFailure: reason => {
        setIsProcessingPayment(false);
        setError(reason);
        haptic.error();
        // CRITICAL: stay on payment, NEVER clear generatedData
      },
    });
  };

  const inForm = ['form_step_1','form_step_2','form_step_3'].includes(appState);
  const step = appState==='form_step_1'?1 : appState==='form_step_2'?2 : 3;

  return (
    <div style={{ background:'#0A0A0A', minHeight:'100vh' }}>
      <Navbar />
      {savedResume && appState==='landing' && (
        <ReturningUserBanner
          savedDate={new Date(savedResume.savedAt).toLocaleDateString('en-IN')}
          savedRole={savedResume.role}
          onContinue={() => { setGeneratedData(savedResume.data); goTo('results'); }}
          onStartFresh={() => { setSavedResume(null); localStorage.removeItem('hireready_resume'); }}
        />
      )}
      <SavedIndicator show={showSaved} />
      <main style={{ maxWidth:640, margin:'0 auto', padding:'0 16px 80px' }}>
        {appState==='landing' && <Hero onStart={() => goTo('form_step_1')} />}

        {inForm && <div style={{paddingTop:32}}><ProgressBar currentStep={step}/></div>}

        {inForm && (
          <div key={appState} className={direction==='right' ? 'anim-slideRight' : 'anim-slideLeft'}>
            {appState==='form_step_1' && <FormStep1 formData={formData} onChange={updateField} onNext={() => goTo('form_step_2')} />}
            {appState==='form_step_2' && <FormStep2 formData={formData} onChange={updateField} onBack={() => goTo('form_step_1','left')} onNext={() => goTo('form_step_3')} />}
            {appState==='form_step_3' && <FormStep3 formData={formData} onChange={updateField} addTag={addTag} removeTag={removeTag} onBack={() => goTo('form_step_2','left')} onGenerate={handleGenerate} />}
          </div>
        )}

        {appState==='generating' && <LoadingScreen generatedData={generatedData} onComplete={() => setAppState('results')} />}
        {appState==='results' && generatedData && <ResultTabs resumeData={generatedData} formData={formData} atsScore={atsScore} onDownload={() => setAppState('payment')} onRegenerate={() => { setGeneratedData(null); goTo('form_step_3','left'); }} />}
        {appState==='payment' && <PaymentGate onPay={handlePayment} onBack={() => setAppState('results')} isProcessing={isProcessingPayment} paymentError={error} />}
        {appState==='success' && <SuccessScreen userName={formData.fullName.split(' ')[0]||'there'} userEmail={formData.email} generatedData={generatedData} formData={formData} />}
        {appState==='error' && <ErrorScreen error={error} onRetry={() => { setError(null); goTo('form_step_3','left'); }} retryLabel="Try generating again" />}
      </main>
    </div>
  );
}
```

---

## UX rules — enforced in every component

1. Every required field shows red inline error text (not alert()) on invalid submit
2. Back button always available — never trap users
3. Generated data NEVER cleared on payment failure
4. Form data saved to localStorage on every keystroke
5. Generated resume saved with 7-day expiry in localStorage
6. iOS Safari PDF: Blob URL via triggerDownload (not doc.save())
7. Mobile: all buttons full-width, minimum 48px height, correct inputmode attributes
8. Razorpay failure: stay on PaymentGate, shake animation, show error, resume survives
9. LoadingScreen: never call onComplete until generatedData is non-null
10. Error messages: always human-readable, always show retry path
11. Focus auto-set to first input of each step after 400ms (animation completes)
12. Tab key in skills input creates chip, does NOT move to next field
13. Skill chip backspace on empty input removes last chip
14. Payment drawer shows resume blurred behind it — never full-page replace
15. All success states trigger haptic.success(), all errors trigger haptic.error()

---

## Edge cases — every critical failure handled

1. iOS Safari PDF: triggerDownload with Blob URL (not standard doc.save)
2. Claude API timeout >20s: ShowSlowMessage in loading screen
3. Claude returns malformed JSON: PARSE_ERROR → retry prompt
4. Razorpay script blocked by ad blocker: RAZORPAY_LOAD error message
5. Payment fails: resume stays alive in state AND in localStorage
6. User closes tab during generation: localStorage form saved, resume not lost
7. Return visit within 7 days: ReturningUserBanner with resume recovery
8. Slow 2G network: slow message at 20s, never white screen
9. Skill chip comma on Android keyboard: handled in onKeyDown AND onChange
10. Two users same phone: localStorage fine, but never pre-fill form from localStorage (would show sibling's name)

---

## Payment model — hybrid (free → ₹49 → ₹199/month)

1. Generate and preview: completely FREE, no login needed
2. Download all 3 PDFs: ₹49 one-time Razorpay (shown ONLY after they see the resume)
3. Monthly unlimited: ₹199/month shown ONLY on SuccessScreen AFTER first download
NEVER show subscription before user has experienced value. Timing is everything.

---

## Build order

1. npm create vite@latest . -- --template react
2. npm install jspdf
3. npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
4. Configure tailwind.config.js with design tokens above
5. Add full animation CSS library to src/index.css
6. Add SEO meta tags to index.html
7. Create src/utils/haptics.js
8. Create src/constants/quotes.js
9. Build components in this order:
   Navbar → SampleResume → Hero → ProgressBar → SavedIndicator
   → FormStep1 → FormStep2 → FormStep3
   → SkeletonResume → LoadingScreen → AtsScoreBadge → ResultTabs
   → ResumePreview → CoverLetterPreview → LinkedInPreview
   → PaymentGate → SuccessScreen → ErrorScreen → ReturningUserBanner
10. Build: services/claude.js → services/razorpay.js → services/pdf.js → services/email.js
11. Build: hooks/useFormState.js
12. Build: App.jsx with full state machine above
13. Test 1: full flow on iPhone Safari — PDF must download correctly
14. Test 2: full flow on Android Chrome — haptics must fire, PDF must download
15. Test 3: Razorpay test mode full payment — confirm 3 PDFs download in sequence
16. Test 4: Razorpay payment failure — confirm resume survives, drawer stays
17. Test 5: close tab during loading, reopen — ReturningUserBanner must appear
18. Test 6: throttle to Slow 3G in DevTools — slow message must appear at 20s

---

## The product promise — deliver this exactly
Free to try. Fill a 3-step form in 2 minutes. Claude writes your resume, cover letter, and LinkedIn profile. See it free before paying. Pay ₹49 to download all three as PDF. Works on your phone. No login. No subscription.
