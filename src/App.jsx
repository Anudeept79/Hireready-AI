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
import ResumeHistory from './components/ResumeHistory';
import HelpScreen from './components/HelpScreen';

const TITLES = {
  landing: 'MyResumeAI — Free AI Resume Builder',
  form_step_1: 'MyResumeAI — Step 1 of 3',
  form_step_2: 'MyResumeAI — Step 2 of 3',
  form_step_3: 'MyResumeAI — Step 3 of 3',
  generating: 'MyResumeAI — Generating your resume...',
  results: 'MyResumeAI — Your resume is ready',
  payment: 'MyResumeAI — Download your resume',
  success: 'MyResumeAI — Downloaded!',
  help: 'MyResumeAI — Help',
};

function saveToHistory(data, formData, score) {
  try {
    const history = JSON.parse(localStorage.getItem('hireready_history') || '[]');
    const newEntry = {
      id: Date.now(),
      role: formData.jobRole,
      name: formData.fullName,
      data,
      score: score.score,
      createdAt: Date.now(),
      paid: false,
    };
    const updated = [newEntry, ...history].slice(0, 3);
    localStorage.setItem('hireready_history', JSON.stringify(updated));
    return updated;
  } catch { return []; }
}

function markHistoryPaid(resumeId) {
  try {
    const history = JSON.parse(localStorage.getItem('hireready_history') || '[]');
    const updated = history.map(item =>
      item.id === resumeId ? { ...item, paid: true } : item
    );
    localStorage.setItem('hireready_history', JSON.stringify(updated));
    return updated;
  } catch { return []; }
}

export default function App() {
  const [appState, setAppState] = useState('landing');
  const [direction, setDirection] = useState('right');
  const [generatedData, setGeneratedData] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasPaidResume, setHasPaidResume] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [prevState, setPrevState] = useState('landing');
  const [resumeHistory, setResumeHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hireready_history') || '[]'); }
    catch { return []; }
  });
  const [savedResume, setSavedResume] = useState(() => {
    try {
      const saved = localStorage.getItem('hireready_resume');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.expiresAt > Date.now()) return p;
        localStorage.removeItem('hireready_resume');
      }
    } catch {}
    return null;
  });
  const { formData, updateField, addTag, removeTag, reset } = useFormState();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    document.title = TITLES[appState] || 'MyResumeAI';
  }, [appState]);

  // Check for paid resume on mount (Use Case 3)
  useEffect(() => {
    try {
      const payment = JSON.parse(localStorage.getItem('hireready_payment') || '{}');
      const resume = JSON.parse(localStorage.getItem('hireready_resume') || '{}');
      if (payment.paymentId && payment.expiresAt > Date.now() && resume.data) {
        setHasPaidResume(true);
      }
    } catch {}
  }, []);

  const goTo = (state, dir = 'right') => {
    setDirection(dir);
    setAppState(state);
    if (['form_step_2', 'form_step_3'].includes(state)) {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const goBack = () => {
    const backMap = {
      form_step_1: 'landing',
      form_step_2: 'form_step_1',
      form_step_3: 'form_step_2',
      results: 'form_step_3',
      payment: 'results',
    };
    const target = backMap[appState];
    if (target) goTo(target, 'left');
  };

  const handleGenerate = async () => {
    setAppState('generating');
    setError(null);
    try {
      const data = await generateDocuments(formData);
      const score = calculateAtsScore(data, !!formData.jobDescription);
      setGeneratedData(data);
      setAtsScore(score);
      // Save to history (Use Case 4)
      const updated = saveToHistory(data, formData, score);
      setResumeHistory(updated);
      if (updated.length > 0) setActiveResumeId(updated[0].id);
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const triggerResumeDownload = (data, name, role, fd) => {
    downloadResumePDF(data.resume, name, role, fd);
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
        // Mark payment as downloaded (Use Case 1 & 2)
        const payment = JSON.parse(localStorage.getItem('hireready_payment') || '{}');
        localStorage.setItem('hireready_payment', JSON.stringify({
          ...payment,
          downloaded: true,
          downloadedAt: Date.now(),
        }));
        // Mark in history as paid
        if (activeResumeId) {
          const updated = markHistoryPaid(activeResumeId);
          setResumeHistory(updated);
        }
        setHasPaidResume(true);
        triggerResumeDownload(generatedData, formData.fullName, formData.jobRole, formData);
        setAppState('success');
      },
      onFailure: reason => {
        setIsProcessingPayment(false);
        setError(reason);
        haptic.error();
        // CRITICAL: stay on payment, NEVER clear generatedData
      },
    });
  };

  // Build new resume (Use Case 5)
  const handleBuildNew = () => {
    haptic.tap();
    reset();
    setGeneratedData(null);
    setAtsScore(null);
    setActiveResumeId(null);
    setAppState('landing');
  };

  // Go home (Use Case 5)
  const handleGoHome = () => {
    haptic.tap();
    setAppState('landing');
  };

  // Select from history (Use Case 4)
  const handleHistorySelect = (item) => {
    haptic.tap();
    setGeneratedData(item.data);
    setAtsScore({ score: item.score, items: [] });
    setActiveResumeId(item.id);
    if (item.paid) {
      setHasPaidResume(true);
      setAppState('success');
    } else {
      goTo('results');
    }
  };

  const handleHistoryClear = () => {
    haptic.tap();
    localStorage.removeItem('hireready_history');
    setResumeHistory([]);
  };

  const handleEnhanceWithAI = async () => {
    setAppState('generating');
    setError(null);
    try {
      const enhancedFormData = {
        ...formData,
        enhanceMode: true,
        previousScore: atsScore?.score,
        missingItems: atsScore?.items?.filter(i => !i.pass).map(i => i.label),
      };
      const data = await generateDocuments(enhancedFormData);
      const score = calculateAtsScore(data, !!formData.jobDescription);
      setGeneratedData(data);
      setAtsScore(score);
      const updated = saveToHistory(data, formData, score);
      setResumeHistory(updated);
      if (updated.length > 0) setActiveResumeId(updated[0].id);
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const handleEditManually = () => {
    goTo('form_step_1', 'left');
  };

  const inForm = ['form_step_1', 'form_step_2', 'form_step_3'].includes(appState);
  const step = appState === 'form_step_1' ? 1 : appState === 'form_step_2' ? 2 : 3;

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <Navbar
        appState={appState}
        onHome={() => goTo('landing', 'left')}
        onBack={goBack}
        onHelp={() => { setPrevState(appState); setAppState('help'); }}
      />
      {savedResume && appState === 'landing' && (
        <ReturningUserBanner
          savedDate={new Date(savedResume.savedAt).toLocaleDateString('en-IN')}
          savedRole={savedResume.role}
          hasPaid={hasPaidResume}
          onContinue={() => {
            setGeneratedData(savedResume.data);
            setAtsScore(calculateAtsScore(savedResume.data, false));
            goTo('results');
          }}
          onRedownload={() => {
            haptic.tap();
            if (savedResume?.data) {
              setGeneratedData(savedResume.data);
              setAppState('success');
            }
          }}
          onStartFresh={() => { setSavedResume(null); localStorage.removeItem('hireready_resume'); }}
        />
      )}
      <SavedIndicator show={showSaved} />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>
        {appState === 'landing' && <Hero onStart={() => goTo('form_step_1')} />}

        {/* Resume History (Use Case 4) */}
        {appState === 'landing' && resumeHistory.length > 0 && (
          <ResumeHistory
            history={resumeHistory}
            onSelect={handleHistorySelect}
            onClear={handleHistoryClear}
          />
        )}

        {inForm && <div style={{ paddingTop: 32 }}><ProgressBar currentStep={step} /></div>}

        {inForm && (
          <div key={appState} className={direction === 'right' ? 'anim-slideRight' : 'anim-slideLeft'}>
            {appState === 'form_step_1' && (
              <FormStep1 formData={formData} onChange={updateField} onNext={() => goTo('form_step_2')} onBack={() => goTo('landing', 'left')} />
            )}
            {appState === 'form_step_2' && (
              <FormStep2 formData={formData} onChange={updateField} addTag={addTag} onBack={() => goTo('form_step_1', 'left')} onNext={() => goTo('form_step_3')} />
            )}
            {appState === 'form_step_3' && (
              <FormStep3 formData={formData} onChange={updateField} addTag={addTag} removeTag={removeTag} onBack={() => goTo('form_step_2', 'left')} onGenerate={handleGenerate} />
            )}
          </div>
        )}

        {appState === 'generating' && (
          <LoadingScreen generatedData={generatedData} onComplete={() => setAppState('results')} />
        )}

        {(appState === 'results' || appState === 'payment') && generatedData && (
          <ResultTabs
            resumeData={generatedData}
            formData={formData}
            atsScore={atsScore}
            onDownload={() => setAppState('payment')}
            onEnhanceWithAI={handleEnhanceWithAI}
            onEditManually={handleEditManually}
          />
        )}

        {appState === 'payment' && (
          <PaymentGate
            onPay={handlePayment}
            onBack={() => setAppState('results')}
            isProcessing={isProcessingPayment}
            paymentError={error}
          />
        )}

        {appState === 'success' && (
          <SuccessScreen
            userName={(formData.fullName || savedResume?.name || '').split(' ')[0] || 'there'}
            userEmail={formData.email}
            generatedData={generatedData}
            formData={formData}
            savedResume={savedResume}
            onBuildNew={handleBuildNew}
            onGoHome={handleGoHome}
          />
        )}

        {appState === 'error' && (
          <ErrorScreen
            error={error}
            onRetry={() => { setError(null); goTo('form_step_3', 'left'); }}
            retryLabel="Try generating again"
          />
        )}

        {appState === 'help' && (
          <HelpScreen onBack={() => setAppState(prevState)} />
        )}
      </main>
    </div>
  );
}
