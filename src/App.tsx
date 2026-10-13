import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UpiSimulator } from './components/UpiSimulator';
import { LiveSignalToggles } from './components/LiveSignalToggles';
import { RiskScoreGauge } from './components/RiskScoreGauge';
import { LiveWarningModal } from './components/LiveWarningModal';
import { PinKeypadModal } from './components/PinKeypadModal';
import { TransactionSuccessModal } from './components/TransactionSuccessModal';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { ModelEvaluationView } from './components/ModelEvaluationView';
import { RbiPatternsView } from './components/RbiPatternsView';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { MobileAppView } from './components/MobileAppView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TransactionInput, DeviceSignals } from './types';
import { DEMO_SCENARIOS } from './data/scenarios';
import { computeRiskAssessment } from './services/mlScorer';
import { logTransactionDecision } from './services/telemetryStore';
import { ShieldCheck, Smartphone, Monitor, ChevronLeft, ArrowLeft } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'telemetry' | 'evaluation' | 'advisories' | 'architecture' | 'signals' | 'risk'>('simulator');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  
  // Auto-detect mobile device or let user toggle
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'mobile' : 'desktop');
    }
  }, []);

  // Initial scenario default: Electricity Disconnection Scam
  const defaultScenario = DEMO_SCENARIOS[0];
  const [tx, setTx] = useState<TransactionInput>({
    payeeVpa: defaultScenario.data.payeeVpa,
    payeeName: defaultScenario.data.payeeName,
    amount: defaultScenario.data.amount,
    note: defaultScenario.data.note,
    transactionType: defaultScenario.data.transactionType,
    signals: { ...defaultScenario.data.signals }
  });

  // Modals state
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false);
  const [safetyBannerMessage, setSafetyBannerMessage] = useState<string | null>(null);

  // Recompute Hybrid Risk Assessment in real-time
  const assessment = useMemo(() => {
    return computeRiskAssessment(tx);
  }, [tx]);

  // Handler for signals update
  const handleSignalsChange: React.Dispatch<React.SetStateAction<DeviceSignals>> = (action) => {
    setTx(prev => {
      const nextSignals = typeof action === 'function' ? action(prev.signals) : action;
      return {
        ...prev,
        signals: nextSignals
      };
    });
  };

  // Step 1: User clicks "Proceed to Pay"
  const handleInitiatePayment = () => {
    if (assessment.riskScore >= 45 || assessment.ruleViolations.some(r => r.severity === 'CRITICAL')) {
      setIsWarningModalOpen(true);
    } else {
      setIsPinModalOpen(true);
    }
  };

  // Step 2A: User follows warning and aborts scam
  const handleAbortScam = (reason: string) => {
    setIsWarningModalOpen(false);
    logTransactionDecision(tx, assessment, 'ABORTED_SAFE', reason);
    
    setSafetyBannerMessage(
      lang === 'hi'
        ? `🛡️ ठगी रोकी गई! आपने कॉल काटकर ₹${tx.amount.toLocaleString()} बचाए। यह डेटा M5 फीडबैक लूप में दर्ज हो गया है।`
        : `🛡️ Scam Intercepted! You aborted the payment and saved ₹${tx.amount.toLocaleString()}. Logged to M5 telemetry.`
    );

    setTimeout(() => {
      setSafetyBannerMessage(null);
    }, 6000);
  };

  // Step 2B: User overrides warning after 5s friction
  const handleProceedAnyway = () => {
    setIsWarningModalOpen(false);
    logTransactionDecision(tx, assessment, 'OVERRIDDEN_PROCEEDED', 'User confirmed awareness and overrode high risk alert');
    setIsPinModalOpen(true);
  };

  // Step 2C: User reports false alarm
  const handleReportFalseAlarm = () => {
    setIsWarningModalOpen(false);
    logTransactionDecision(tx, assessment, 'REPORTED_FALSE_ALARM', 'User reported false alarm on legitimate contact');
    alert(lang === 'hi' ? 'धन्यवाद! आपकी रिपोर्ट दर्ज कर ली गई है ताकि ML मॉडल को बेहतर बनाया जा सके।' : 'Feedback received! Recorded for model recalibration.');
  };

  // Step 3: PIN entry completed
  const handleSubmitPin = () => {
    setIsPinModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[140px] animate-soft-glow" />
        <div className="absolute top-80 -right-20 w-[450px] h-[450px] bg-cyan-500/[0.05] rounded-full blur-[150px]" />
      </div>

      {/* Top Bar Switcher between Mobile App View & Desktop Studio */}
      <div className="sticky top-0 z-50 bg-[#070b13]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-extrabold text-white tracking-tight">SurakshaPay</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">• Live Scam & OTP Coaching</span>
        </div>

        {/* View Mode Toggle: Mobile App vs Desktop Studio */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => {
                setViewMode('mobile');
                setActiveTab('simulator');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मोबाइल ऐप' : 'Mobile App'}</span>
            </button>

            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'डेस्कटॉप स्टूडियो' : 'Desktop Studio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notification Banner */}
      {safetyBannerMessage && (
        <div className="relative z-30 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 text-center text-xs sm:text-sm font-bold shadow-xl animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2 border-b border-emerald-400/30">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-200" />
          <span>{safetyBannerMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. NATIVE MOBILE APP MODE (Optimized for Phones / Mobile) */}
      {/* ========================================================= */}
      {viewMode === 'mobile' ? (
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          
          {/* Active Tab Screen inside Mobile View */}
          {activeTab === 'simulator' && (
            <MobileAppView
              tx={tx}
              setTx={setTx}
              assessment={assessment}
              onInitiatePayment={handleInitiatePayment}
              lang={lang}
              setLang={setLang}
              onOpenRiskModal={() => setActiveTab('risk')}
            />
          )}

          {activeTab === 'risk' && (
            <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <button 
                  onClick={() => setActiveTab('simulator')} 
                  className="flex items-center gap-1 text-xs text-cyan-400 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Payment
                </button>
                <span className="text-xs font-bold uppercase text-slate-400">Risk Radar</span>
              </div>
              <RiskScoreGauge assessment={assessment} lang={lang} />
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <button 
                  onClick={() => setActiveTab('simulator')} 
                  className="flex items-center gap-1 text-xs text-amber-400 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Payment
                </button>
                <span className="text-xs font-bold uppercase text-slate-400">Sensor Bus</span>
              </div>
              <LiveSignalToggles signals={tx.signals} setSignals={handleSignalsChange} lang={lang} />
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <button 
                  onClick={() => setActiveTab('simulator')} 
                  className="flex items-center gap-1 text-xs text-emerald-400 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Payment
                </button>
                <span className="text-xs font-bold uppercase text-slate-400">M5 Feedback</span>
              </div>
              <TelemetryDashboard lang={lang} />
            </div>
          )}

          {activeTab === 'advisories' && (
            <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <button 
                  onClick={() => setActiveTab('simulator')} 
                  className="flex items-center gap-1 text-xs text-purple-400 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Payment
                </button>
                <span className="text-xs font-bold uppercase text-slate-400">RBI Patterns</span>
              </div>
              <RbiPatternsView lang={lang} />
            </div>
          )}

          {/* Native Mobile Bottom Navigation Bar */}
          <MobileBottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            lang={lang} 
          />
        </div>
      ) : (
        /* ========================================================= */
        /* 2. DESKTOP STUDIO MODE (Split view with Phone Mockup)    */
        /* ========================================================= */
        <>
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            lang={lang} 
            setLang={setLang} 
          />

          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Phone Simulator (M1) */}
                  <div className="lg:col-span-6">
                    <UpiSimulator
                      tx={tx}
                      setTx={setTx}
                      assessment={assessment}
                      onInitiatePayment={handleInitiatePayment}
                      lang={lang}
                    />
                  </div>

                  {/* Right Column: Live Risk Gauges (M3) & Signals (M2) */}
                  <div className="lg:col-span-6 space-y-6">
                    <RiskScoreGauge 
                      assessment={assessment} 
                      lang={lang} 
                    />
                    <LiveSignalToggles 
                      signals={tx.signals} 
                      setSignals={handleSignalsChange} 
                      lang={lang} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'telemetry' && <TelemetryDashboard lang={lang} />}
            {activeTab === 'evaluation' && <ModelEvaluationView lang={lang} />}
            {activeTab === 'advisories' && <RbiPatternsView lang={lang} />}
            {activeTab === 'architecture' && <ArchitectureDiagram lang={lang} />}
          </main>
        </>
      )}

      {/* Shared Security Modals */}
      
      {/* M4: Live Warning UI Modal */}
      <LiveWarningModal
        isOpen={isWarningModalOpen}
        tx={tx}
        assessment={assessment}
        lang={lang}
        onAbort={handleAbortScam}
        onProceedAnyway={handleProceedAnyway}
        onReportFalseAlarm={handleReportFalseAlarm}
      />

      {/* UPI PIN Keypad Modal */}
      <PinKeypadModal
        isOpen={isPinModalOpen}
        amount={tx.amount}
        payeeName={tx.payeeName}
        isScreenSharingActive={tx.signals.isScreenSharingActive}
        onClose={() => setIsPinModalOpen(false)}
        onSubmitPin={handleSubmitPin}
        lang={lang}
      />

      {/* Payment Success Receipt Modal */}
      <TransactionSuccessModal
        isOpen={isSuccessModalOpen}
        tx={tx}
        onClose={() => setIsSuccessModalOpen(false)}
        lang={lang}
      />

      {/* Footer in Desktop Mode */}
      {viewMode === 'desktop' && (
        <footer className="relative z-10 border-t border-white/[0.06] bg-[#070a10]/80 backdrop-blur-md py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-slate-400">SurakshaPay — Real-Time Scam & OTP Coaching</span>
            <span className="text-[11px] text-slate-500">
              Simulation environment • No real banking data • Aligned with RBI & 1930 Guidelines
            </span>
          </div>
        </footer>
      )}

    </div>
  );
}

export default App;
