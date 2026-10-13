import React, { useState } from 'react';
import { TransactionInput, RiskAssessment, DemoScenario } from '../types';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { 
  Send, 
  QrCode, 
  Receipt, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Smartphone,
  Edit3,
  RotateCcw,
  MessageSquareText,
  FileSearch,
  CheckCircle2,
  Wifi,
  BatteryCharging,
  Signal,
  User,
  IndianRupee,
  Check,
  ChevronDown
} from 'lucide-react';

interface UpiSimulatorProps {
  tx: TransactionInput;
  setTx: React.Dispatch<React.SetStateAction<TransactionInput>>;
  assessment: RiskAssessment;
  onInitiatePayment: () => void;
  lang: 'hi' | 'en';
}

export const UpiSimulator: React.FC<UpiSimulatorProps> = ({
  tx,
  setTx,
  assessment,
  onInitiatePayment,
  lang
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scam-electricity');
  const [smsInput, setSmsInput] = useState<string>('');
  const [smsParsedSuccess, setSmsParsedSuccess] = useState<boolean>(false);
  const [showSmsScanner, setShowSmsScanner] = useState<boolean>(false);

  const handleSelectScenario = (scenario: DemoScenario) => {
    setSelectedScenarioId(scenario.id);
    setTx({
      payeeVpa: scenario.data.payeeVpa,
      payeeName: scenario.data.payeeName,
      amount: scenario.data.amount,
      note: scenario.data.note,
      transactionType: scenario.data.transactionType,
      signals: { ...scenario.data.signals }
    });
  };

  const handleSelectCustomMode = () => {
    setSelectedScenarioId('custom');
  };

  const handleResetToBlank = () => {
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
    setSmsParsedSuccess(false);
  };

  const handleSetQuickAmount = (val: number) => {
    setSelectedScenarioId('custom');
    setTx(prev => ({
      ...prev,
      amount: val,
      signals: {
        ...prev.signals,
        amountSurgeRatio: Number((val / 2000).toFixed(1))
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

    let extractedVpa = 'discom.helpdesk@paytm';
    let extractedName = 'Support Officer';

    if (vpaMatch && vpaMatch[1]) {
      extractedVpa = vpaMatch[1];
    } else if (phoneMatch && phoneMatch[1]) {
      extractedVpa = `${phoneMatch[1]}@paytm`;
      extractedName = `Helpdesk ${phoneMatch[1]}`;
    }

    if (detected.includes('electricity') || detected.includes('bijli') || detected.includes('discom')) {
      extractedName = 'Bijli Discom Bill Desk';
    } else if (detected.includes('kyc') || detected.includes('block') || detected.includes('freeze')) {
      extractedName = 'Bank KYC Verification Executive';
    } else if (detected.includes('refund') || detected.includes('prize')) {
      extractedName = 'Order Refund Officer';
    }

    const hasScreenShareWord = lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('screenshare') || lower.includes('quicksupport');
    const hasCallWord = lower.includes('call') || lower.includes('talk') || lower.includes('phone') || !!phoneMatch;

    setSelectedScenarioId('custom');
    setTx(prev => ({
      ...prev,
      payeeVpa: extractedVpa,
      payeeName: extractedName,
      amount: extractedAmount,
      note: text.slice(0, 40),
      signals: {
        ...prev.signals,
        isScreenSharingActive: hasScreenShareWord,
        isOnActiveCall: hasCallWord,
        callDurationMinutes: hasCallWord ? 8 : 0,
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

  const currentScenario = DEMO_SCENARIOS.find(s => s.id === selectedScenarioId);

  return (
    <div className="space-y-5">
      
      {/* Top Scenario & Custom Mode Bar */}
      <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {lang === 'hi' ? 'डेमो परिदृश्य या खुद का इनपुट' : 'Scenarios & Custom Entry'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmsScanner(!showSmsScanner)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                showSmsScanner 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm' 
                  : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'hi' ? 'SMS स्कैनर' : 'SMS Parser'}</span>
            </button>

            <button
              onClick={handleResetToBlank}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/[0.05] transition-all cursor-pointer"
              title="Reset fields to blank"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'hi' ? 'साफ करें' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Clean Pill Carousel for Scenarios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          
          {/* Custom / Khudka Input Card */}
          <button
            onClick={handleSelectCustomMode}
            className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
              selectedScenarioId === 'custom'
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.12]'
            }`}
          >
            <div>
              <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1.5 bg-cyan-400 text-slate-950">
                ✨ {lang === 'hi' ? 'कस्टम' : 'CUSTOM'}
              </span>
              <p className="text-xs font-bold leading-tight truncate">
                {lang === 'hi' ? 'खुद का इनपुट' : 'My Own Input'}
              </p>
            </div>
            <span className="text-[10px] text-cyan-300/80 mt-2 block font-medium">
              {lang === 'hi' ? 'फ्री टाइप' : 'Type freely'}
            </span>
          </button>

          {/* Preset Fraud & Safe Scenarios */}
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                selectedScenarioId === sc.id
                  ? sc.category === 'SCAM'
                    ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
                    : 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.12]'
              }`}
            >
              <div>
                <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1.5 ${
                  sc.category === 'SCAM' 
                    ? 'bg-rose-500/90 text-white' 
                    : 'bg-emerald-500/90 text-slate-950 font-bold'
                }`}>
                  {sc.category}
                </span>
                <p className="text-xs font-bold leading-tight line-clamp-1">
                  {lang === 'hi' ? sc.nameHi : sc.name}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-mono font-semibold">
                ₹{sc.data.amount.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {/* SMS Scanner Tool */}
        {showSmsScanner && (
          <div className="mt-3.5 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'hi' ? 'संदिग्ध SMS या व्हाट्सएप टेक्स्ट पेस्ट करें:' : 'Paste Suspicious SMS / WhatsApp Message:'}</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-md">
                NLP Signal Parser
              </span>
            </div>

            <textarea
              rows={2}
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="e.g. Dear customer your electricity power will disconnect at 9:30 PM due to unpaid bill. Pay Rs 11 now to officer call 9876543210..."
              className="w-full bg-[#0a0f1d] border border-white/[0.08] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-500"
            />

            {/* Quick SMS templates */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500">{lang === 'hi' ? 'उदाहरण:' : 'Sample templates:'}</span>
              <button
                onClick={() => {
                  const sample = "Urgent: Electricity power disconnect tonight 9:30 PM. Pay Rs 11 token now to avoid cutoff. Call officer: 9876543210";
                  setSmsInput(sample);
                  handleParseSms(sample);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-amber-300/90 hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
              >
                ⚡ Electricity Bill Cutoff
              </button>
              <button
                onClick={() => {
                  const sample = "Bank Alert: Your SBI YONO account blocked due to KYC. Pay Rs 10 verification fee immediately to 9876543210@paytm";
                  setSmsInput(sample);
                  handleParseSms(sample);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] text-rose-300/90 hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
              >
                🏦 Bank KYC Freeze
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                {lang === 'hi' ? 'हम राशि, VPA, और खतरे के शब्द स्वतः फॉर्म में भर देंगे' : 'Auto-extracts amount, VPA, and threat signals'}
              </span>
              <button
                onClick={() => handleParseSms()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सिग्नल्स निकालें' : 'Extract & Populate'}</span>
              </button>
            </div>

            {smsParsedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'hi' ? 'संदेश से सिग्नल्स सफलतापूर्वक निकाले गए और फॉर्म में भर दिए गए!' : 'SMS analyzed! Threat signals & fields populated in simulator.'}</span>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Context Hint Banner */}
        {selectedScenarioId === 'custom' ? (
          <div className="mt-3 p-3 rounded-xl bg-cyan-500/[0.07] border border-cyan-500/20 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300">
                {lang === 'hi' 
                  ? 'कस्टम मोड: नीचे मोबाइल फॉर्म में कोई भी नाम, UPI ID, या रकम टाइप करें।' 
                  : 'Custom Mode: Type any Payee Name, UPI ID or Amount freely below.'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20 shrink-0">
              Manual Free Input
            </span>
          </div>
        ) : currentScenario ? (
          <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs flex items-start gap-2.5">
            <span className="p-1 rounded-md bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-bold text-slate-200">
                {lang === 'hi' ? 'परिदृश्य विवरण:' : 'Scenario Context:'}
              </span>{' '}
              <span className="text-slate-300 leading-relaxed">
                {lang === 'hi' ? currentScenario.scamStoryHi : currentScenario.scamStory}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modern High-End Smartphone Mockup Frame */}
      <div className="max-w-[410px] mx-auto">
        <div className="relative rounded-[42px] bg-gradient-to-b from-[#162032] via-[#0d1422] to-[#080c14] p-3.5 phone-mockup-frame border border-white/[0.12]">
          
          {/* Outer Phone Bezel Polish */}
          <div className="relative rounded-[32px] bg-[#070b12] border border-white/[0.08] overflow-hidden text-slate-100 flex flex-col justify-between shadow-inner">
            
            {/* Phone Top Status Bar & Dynamic Island */}
            <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>9:41</span>
              
              {/* Dynamic Island / Notch */}
              <div className="w-20 h-4 bg-black rounded-full border border-white/[0.08] flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-white/[0.1]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 text-slate-400" />
                <Wifi className="w-3 h-3 text-slate-400" />
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* In-App App Bar */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/20">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight text-white">BHARAT UPI</h4>
                  <span className="text-[10px] text-slate-400">Fast & Secure Pay</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                UPI 2.0
              </span>
            </div>

            {/* Phone Body Form Content */}
            <div className="p-5 space-y-4">
              
              {/* Segmented Mode Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06] text-xs">
                <button
                  onClick={() => setTx(prev => ({ ...prev, transactionType: 'UPI_PAY' }))}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    tx.transactionType === 'UPI_PAY' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>

                <button
                  onClick={() => setTx(prev => ({ ...prev, transactionType: 'COLLECT_REQUEST' }))}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    tx.transactionType === 'COLLECT_REQUEST' 
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Collect</span>
                </button>

                <button
                  onClick={() => setTx(prev => ({ ...prev, transactionType: 'QR_SCAN' }))}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    tx.transactionType === 'QR_SCAN' 
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR</span>
                </button>
              </div>

              {/* Big Prominent Amount Card */}
              <div className="rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-4 text-center relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {lang === 'hi' ? 'भुगतान राशि' : 'Transfer Amount'}
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={tx.amount === 0 ? '' : tx.amount}
                    onChange={(e) => {
                      setSelectedScenarioId('custom');
                      const val = Number(e.target.value) || 0;
                      setTx(prev => ({ 
                        ...prev, 
                        amount: val,
                        signals: {
                          ...prev.signals,
                          amountSurgeRatio: Number((val / 2000).toFixed(1))
                        }
                      }));
                    }}
                    placeholder="0"
                    className="w-48 text-3xl font-black text-center bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                  />
                </div>

                {/* Quick Amount Suggestion Chips */}
                <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-white/[0.05]">
                  {[11, 500, 2000, 15000, 45000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSetQuickAmount(amt)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        tx.amount === amt 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                          : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details Inputs */}
              <div className="space-y-3">
                {/* Payee Display Name */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {lang === 'hi' ? 'प्राप्तकर्ता का नाम' : 'Payee Display Name'}
                    </label>
                    <span className="text-[9px] text-cyan-400/90 font-medium">Khudka Input</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={tx.payeeName}
                      onChange={(e) => {
                        setSelectedScenarioId('custom');
                        setTx(prev => ({ ...prev, payeeName: e.target.value }));
                      }}
                      placeholder="e.g. Bijli Bill Office / Friend Name"
                      className="w-full bg-[#0a0f1d] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-medium"
                    />
                    {tx.signals.isPayeeVerifiedMerchant && (
                      <span className="absolute right-2.5 top-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Payee UPI ID or Mobile */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {lang === 'hi' ? 'UPI ID या मोबाइल' : 'Payee UPI ID / Mobile'}
                    </label>
                    <span className="text-[9px] text-slate-500 font-mono">@upi, @paytm, @okaxis</span>
                  </div>
                  <input
                    type="text"
                    value={tx.payeeVpa}
                    onChange={(e) => {
                      setSelectedScenarioId('custom');
                      setTx(prev => ({ ...prev, payeeVpa: e.target.value }));
                    }}
                    placeholder="e.g. 9876543210@paytm or desk@ybl"
                    className="w-full bg-[#0a0f1d] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
                  />
                </div>

                {/* Note / Memo with Auto Keyword Detection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? 'नोट / कारण (Note)' : 'Add Note / Memo'}
                  </label>
                  <input
                    type="text"
                    value={tx.note}
                    onChange={(e) => {
                      setSelectedScenarioId('custom');
                      const noteVal = e.target.value;
                      const matches = ['urgent', 'electricity', 'bijli', 'power', 'kyc', 'bill', 'refund', 'claim', 'cut', 'freeze', 'prize', 'winner', 'discom']
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
                    placeholder="e.g. Electricity Bill, Urgent KYC, Rent, Food"
                    className="w-full bg-[#0a0f1d] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
                  />
                </div>
              </div>

              {/* Real-Time Risk Indicator Ribbon */}
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                assessment.riskScore >= 65 
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' 
                  : assessment.riskScore >= 45 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-ping bg-current"></span>
                  <span className="font-bold">
                    Risk: {assessment.riskScore}/100 ({assessment.riskLevel})
                  </span>
                </div>
                <span className="text-[10px] font-bold underline cursor-pointer">
                  {assessment.riskScore >= 45 
                    ? (lang === 'hi' ? 'सुरक्षा कोच एक्टिव होगा' : 'Coaching Active') 
                    : (lang === 'hi' ? 'सीधे PIN दर्ज करें' : 'Direct PIN')}
                </span>
              </div>

              {/* Glowing Primary Action Button */}
              <button
                onClick={onInitiatePayment}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 cursor-pointer transform active:scale-98 ${
                  tx.transactionType === 'COLLECT_REQUEST'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-amber-400/25'
                    : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-emerald-400/30'
                }`}
              >
                <span>
                  {tx.transactionType === 'COLLECT_REQUEST'
                    ? (lang === 'hi' ? `अप्रूव कलेक्ट रिक्वेस्ट ₹${tx.amount.toLocaleString()}` : `Approve Collect ₹${tx.amount.toLocaleString()}`)
                    : (lang === 'hi' ? `भुगतान करें ₹${tx.amount.toLocaleString()}` : `Proceed to Pay ₹${tx.amount.toLocaleString()}`)}
                </span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
                <span>Pre-PIN in-the-moment coaching verification</span>
              </div>

            </div>

            {/* Phone Bottom Home Bar */}
            <div className="py-2 flex justify-center">
              <div className="w-28 h-1 bg-white/20 rounded-full"></div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
