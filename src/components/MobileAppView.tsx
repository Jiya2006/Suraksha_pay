import React, { useState } from 'react';
import { TransactionInput, RiskAssessment, DeviceSignals } from '../types';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { 
  Send, 
  QrCode, 
  Receipt, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tv, 
  PhoneCall, 
  UserX, 
  UserCheck, 
  RotateCcw, 
  MessageSquareText, 
  FileSearch, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Volume2,
  Check,
  Edit3
} from 'lucide-react';

interface MobileAppViewProps {
  tx: TransactionInput;
  setTx: React.Dispatch<React.SetStateAction<TransactionInput>>;
  assessment: RiskAssessment;
  onInitiatePayment: () => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  onOpenRiskModal: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  tx,
  setTx,
  assessment,
  onInitiatePayment,
  lang,
  setLang,
  onOpenRiskModal
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scam-electricity');
  const [showSmsScanner, setShowSmsScanner] = useState<boolean>(false);
  const [smsInput, setSmsInput] = useState<string>('');
  const [smsParsedSuccess, setSmsParsedSuccess] = useState<boolean>(false);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setTx({
        payeeVpa: scenario.data.payeeVpa,
        payeeName: scenario.data.payeeName,
        amount: scenario.data.amount,
        note: scenario.data.note,
        transactionType: scenario.data.transactionType,
        signals: { ...scenario.data.signals }
      });
    }
  };

  const handleReset = () => {
    setSelectedScenarioId('custom');
    setTx({
      payeeVpa: '',
      payeeName: '',
      amount: 500,
      note: '',
      transactionType: 'UPI_PAY',
      signals: {
        isScreenSharingActive: false,
        isOnActiveCall: false,
        callDurationMinutes: 0,
        isPayeeInContacts: false,
        isPayeeVerifiedMerchant: false,
        payeeAccountAgeDays: 30,
        unusualHour: false,
        amountSurgeRatio: 1.0,
        urgencyKeywordFound: false,
        detectedKeywords: []
      }
    });
    setSmsInput('');
  };

  const toggleScreenShare = () => {
    setTx(prev => ({
      ...prev,
      signals: {
        ...prev.signals,
        isScreenSharingActive: !prev.signals.isScreenSharingActive
      }
    }));
  };

  const toggleCall = () => {
    setTx(prev => ({
      ...prev,
      signals: {
        ...prev.signals,
        isOnActiveCall: !prev.signals.isOnActiveCall,
        callDurationMinutes: !prev.signals.isOnActiveCall ? 8 : 0
      }
    }));
  };

  const toggleContacts = () => {
    setTx(prev => ({
      ...prev,
      signals: {
        ...prev.signals,
        isPayeeInContacts: !prev.signals.isPayeeInContacts
      }
    }));
  };

  const handleParseSms = (overrideText?: string) => {
    const text = overrideText || smsInput;
    if (!text.trim()) return;

    const lower = text.toLowerCase();
    const keywords = ['electricity', 'bijli', 'power', 'discom', 'cut', 'bill', 'kyc', 'pan', 'block', 'freeze', 'refund', 'prize', 'lottery', 'urgent', 'anydesk', 'teamviewer', 'call'];
    const detected = keywords.filter(kw => lower.includes(kw));

    const amountMatch = text.match(/(?:rs\.?|inr|₹)\s*([0-9,]+)/i) || text.match(/\b([0-9]{2,6})\s*(?:rupees|rs|\/-)/i);
    let extractedAmount = tx.amount;
    if (amountMatch && amountMatch[1]) {
      const cleanNum = Number(amountMatch[1].replace(/,/g, ''));
      if (!isNaN(cleanNum) && cleanNum > 0) extractedAmount = cleanNum;
    }

    const vpaMatch = text.match(/([a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{3,})/);
    const phoneMatch = text.match(/(?:call|helpline|number|no\.?|contact)?\s*[:\-]?\s*([6-9][0-9]{9})/i);

    let extractedVpa = 'discom.bill99@paytm';
    let extractedName = 'Support Officer';

    if (vpaMatch && vpaMatch[1]) extractedVpa = vpaMatch[1];
    else if (phoneMatch && phoneMatch[1]) extractedVpa = `${phoneMatch[1]}@paytm`;

    if (detected.includes('electricity') || detected.includes('bijli') || detected.includes('discom')) {
      extractedName = 'Electricity Bill Desk';
    } else if (detected.includes('kyc') || detected.includes('block') || detected.includes('freeze')) {
      extractedName = 'Bank KYC Verification';
    } else if (detected.includes('refund') || detected.includes('prize')) {
      extractedName = 'Flipkart Refund Agent';
    }

    const hasScreenShare = lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('screenshare');
    const hasCall = lower.includes('call') || lower.includes('phone') || !!phoneMatch;

    setSelectedScenarioId('custom');
    setTx(prev => ({
      ...prev,
      payeeVpa: extractedVpa,
      payeeName: extractedName,
      amount: extractedAmount,
      note: text.slice(0, 40),
      signals: {
        ...prev.signals,
        isScreenSharingActive: hasScreenShare,
        isOnActiveCall: hasCall,
        callDurationMinutes: hasCall ? 8 : 0,
        urgencyKeywordFound: detected.length > 0,
        detectedKeywords: detected,
        isPayeeInContacts: false,
        isPayeeVerifiedMerchant: false,
        payeeAccountAgeDays: 2
      }
    }));

    setSmsParsedSuccess(true);
    setTimeout(() => setSmsParsedSuccess(false), 4000);
  };

  const getRiskTheme = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50', dot: 'bg-rose-500' };
      case 'HIGH':
        return { bg: 'bg-orange-500/20 text-orange-300 border-orange-500/50', dot: 'bg-orange-500' };
      case 'MEDIUM':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50', dot: 'bg-amber-400' };
      case 'LOW':
        return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50', dot: 'bg-blue-400' };
      default:
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', dot: 'bg-emerald-400' };
    }
  };

  const riskTheme = getRiskTheme(assessment.riskLevel);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070b13] text-white flex flex-col justify-between pb-20 shadow-2xl">
      
      {/* Mobile App Native Header */}
      <div className="sticky top-0 z-30 bg-[#070b13]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* User profile & brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-md shadow-emerald-500/20">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">SurakshaPay</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {lang === 'hi' ? 'लाइव धोखाधड़ी सुरक्षा' : 'Real-time Fraud Coach'}
              </p>
            </div>
          </div>

          {/* Right Controls: Interactive Risk Pill & Language */}
          <div className="flex items-center gap-2">
            
            {/* Live Interactive Risk Meter Pill */}
            <button
              onClick={onOpenRiskModal}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border transition-all cursor-pointer ${riskTheme.bg}`}
              title="Click to view full Risk analysis"
            >
              <span className={`w-2 h-2 rounded-full ${riskTheme.dot} animate-pulse`}></span>
              <span>{assessment.riskScore}/100</span>
              <ChevronRight className="w-3 h-3 opacity-70" />
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-2 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            >
              {lang === 'hi' ? 'EN' : 'हिं'}
            </button>
          </div>

        </div>

        {/* Live Device Telemetry Strip (Quick switches on mobile) */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] overflow-x-auto gap-1.5 pb-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">
            {lang === 'hi' ? 'सिग्नल:' : 'Sensors:'}
          </span>

          {/* Screen Share Toggle Pill */}
          <button
            onClick={toggleScreenShare}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
              tx.signals.isScreenSharingActive 
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30 animate-pulse' 
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span>Screen: {tx.signals.isScreenSharingActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Active Call Toggle Pill */}
          <button
            onClick={toggleCall}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
              tx.signals.isOnActiveCall 
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30' 
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
            }`}
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call: {tx.signals.isOnActiveCall ? `${tx.signals.callDurationMinutes}m` : 'OFF'}</span>
          </button>

          {/* Contacts Status Toggle Pill */}
          <button
            onClick={toggleContacts}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
              tx.signals.isPayeeInContacts 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
            }`}
          >
            {tx.signals.isPayeeInContacts ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
            <span>{tx.signals.isPayeeInContacts ? 'Known' : 'Stranger'}</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Body */}
      <div className="p-4 space-y-4">
        
        {/* Scenarios Horizontal Swipeable Pill Row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'hi' ? 'डेमो परिदृश्य या खुद का इनपुट' : 'Quick Scenarios or Custom'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSmsScanner(!showSmsScanner)}
                className="text-[10px] text-cyan-400 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <MessageSquareText className="w-3 h-3" />
                <span>{lang === 'hi' ? 'SMS स्कैनर' : 'SMS Scan'}</span>
              </button>
              <button
                onClick={handleReset}
                className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Custom Input Pill */}
            <button
              onClick={() => setSelectedScenarioId('custom')}
              className={`px-3 py-2 rounded-xl border text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedScenarioId === 'custom'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                  : 'bg-white/[0.03] text-slate-300 border-white/[0.08]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✨ {lang === 'hi' ? 'खुद का इनपुट' : 'Custom Input'}</span>
            </button>

            {/* Presets */}
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedScenarioId === sc.id
                    ? sc.category === 'SCAM'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                      : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-300 border-white/[0.08]'
                }`}
              >
                <span>{lang === 'hi' ? sc.nameHi : sc.name}</span>
                <span className="opacity-70 text-[10px] ml-1 font-mono">₹{sc.data.amount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SMS Scanner Dropdown on Mobile */}
        {showSmsScanner && (
          <div className="p-3.5 rounded-2xl bg-[#0d1526] border border-cyan-500/40 text-xs space-y-2 animate-in slide-in-from-top-1">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <FileSearch className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'संदिग्ध SMS यहाँ पेस्ट करें:' : 'Paste Scam SMS:'}</span>
            </span>
            <textarea
              rows={2}
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="e.g. Electricity cutoff tonight 9.30 PM. Pay Rs 11 now..."
              className="w-full bg-[#070b13] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  const s = "Electricity power disconnect tonight 9.30 PM. Pay Rs 11 immediately. Call 9876543210";
                  setSmsInput(s);
                  handleParseSms(s);
                }}
                className="text-[10px] text-amber-300 underline"
              >
                Sample SMS
              </button>
              <button
                onClick={() => handleParseSms()}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                {lang === 'hi' ? 'ऑटो-भरें' : 'Auto-Fill'}
              </button>
            </div>
            {smsParsedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Form populated!
              </span>
            )}
          </div>
        )}

        {/* Payment Mode Selector */}
        <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06] text-xs">
          <button
            onClick={() => setTx(prev => ({ ...prev, transactionType: 'UPI_PAY' }))}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tx.transactionType === 'UPI_PAY' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'text-slate-400'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>

          <button
            onClick={() => setTx(prev => ({ ...prev, transactionType: 'COLLECT_REQUEST' }))}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tx.transactionType === 'COLLECT_REQUEST' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-400'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Collect</span>
          </button>

          <button
            onClick={() => setTx(prev => ({ ...prev, transactionType: 'QR_SCAN' }))}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              tx.transactionType === 'QR_SCAN' 
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20' 
                : 'text-slate-400'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>

        {/* Prominent Amount Box */}
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] p-5 text-center shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {lang === 'hi' ? 'भुगतान राशि' : 'Amount in ₹'}
          </span>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-slate-400">₹</span>
            <input
              type="number"
              value={tx.amount === 0 ? '' : tx.amount}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                const val = Number(e.target.value) || 0;
                setTx(prev => ({ ...prev, amount: val }));
              }}
              placeholder="0"
              className="w-44 text-3xl font-black text-center bg-transparent text-white focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Quick amount chips */}
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
            {[11, 500, 2000, 15000, 45000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setSelectedScenarioId('custom');
                  setTx(prev => ({ ...prev, amount: amt }));
                }}
                className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  tx.amount === amt 
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 font-bold' 
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06]'
                }`}
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Input Details */}
        <div className="space-y-3">
          {/* Payee Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'प्राप्तकर्ता का नाम' : 'Payee Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={tx.payeeName}
                onChange={(e) => {
                  setSelectedScenarioId('custom');
                  setTx(prev => ({ ...prev, payeeName: e.target.value }));
                }}
                placeholder="e.g. Bijli Bill Desk, Rahul Sharma..."
                className="w-full bg-[#0d1424] border border-white/[0.08] rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-medium"
              />
              {tx.signals.isPayeeVerifiedMerchant && (
                <span className="absolute right-2.5 top-2.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Payee UPI ID */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'UPI ID या मोबाइल' : 'Payee UPI ID / Mobile'}
            </label>
            <input
              type="text"
              value={tx.payeeVpa}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                setTx(prev => ({ ...prev, payeeVpa: e.target.value }));
              }}
              placeholder="e.g. 9876543210@paytm or desk@ybl"
              className="w-full bg-[#0d1424] border border-white/[0.08] rounded-xl px-3.5 py-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'नोट / कारण' : 'Add Note / Memo'}
            </label>
            <input
              type="text"
              value={tx.note}
              onChange={(e) => {
                setSelectedScenarioId('custom');
                const noteVal = e.target.value;
                const matches = ['urgent', 'electricity', 'bijli', 'power', 'kyc', 'bill', 'refund', 'claim', 'cut', 'freeze']
                  .filter(kw => noteVal.toLowerCase().includes(kw));
                setTx(prev => ({
                  ...prev,
                  note: noteVal,
                  signals: {
                    ...prev.signals,
                    urgencyKeywordFound: matches.length > 0,
                    detectedKeywords: matches
                  }
                }));
              }}
              placeholder="e.g. Electricity Bill, Urgent KYC, Rent"
              className="w-full bg-[#0d1424] border border-white/[0.08] rounded-xl px-3.5 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Real-time Risk Banner */}
        <div 
          onClick={onOpenRiskModal}
          className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
            assessment.riskScore >= 65 
              ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-md shadow-rose-900/20' 
              : assessment.riskScore >= 45 
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-300' 
              : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-ping bg-current"></span>
            <div>
              <span className="font-extrabold text-xs block">
                {lang === 'hi' ? 'लाइव रिस्क:' : 'Risk Score:'} {assessment.riskScore}/100 ({assessment.riskLevel})
              </span>
              <span className="text-[10px] opacity-80 truncate block max-w-[220px]">
                {lang === 'hi' ? assessment.primaryThreatTypeHi : assessment.primaryThreatType}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold underline shrink-0 flex items-center gap-0.5">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Big Pay Button on Mobile */}
        <button
          onClick={onInitiatePayment}
          className={`w-full py-4 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-200 cursor-pointer transform active:scale-98 ${
            tx.transactionType === 'COLLECT_REQUEST'
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-amber-400/30'
              : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-emerald-400/30'
          }`}
        >
          <span>
            {tx.transactionType === 'COLLECT_REQUEST'
              ? (lang === 'hi' ? `अप्रूव कलेक्ट रिक्वेस्ट ₹${tx.amount.toLocaleString()}` : `Approve Collect ₹${tx.amount.toLocaleString()}`)
              : (lang === 'hi' ? `सुरक्षित भुगतान करें ₹${tx.amount.toLocaleString()}` : `Proceed to Pay ₹${tx.amount.toLocaleString()}`)}
          </span>
          <ArrowRight className="w-4 h-4 font-bold" />
        </button>

        <p className="text-[10px] text-center text-slate-500 pt-1">
          {lang === 'hi' 
            ? 'सुरक्षापे: PIN डालने से पहले ही संदिग्ध कॉल व स्क्रीन शेयरिंग डिटेक्ट की जाती है' 
            : 'Pre-PIN coaching scan runs before any money can be deducted'}
        </p>

      </div>

    </div>
  );
};
