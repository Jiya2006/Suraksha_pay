import React, { useState, useEffect } from 'react';
import { RiskAssessment, TransactionInput } from '../types';
import { voiceCoach } from '../services/voiceCoach';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Tv, 
  PhoneForwarded, 
  HelpCircle, 
  ShieldAlert, 
  Flag,
  Sparkles
} from 'lucide-react';

interface LiveWarningModalProps {
  isOpen: boolean;
  tx: TransactionInput;
  assessment: RiskAssessment;
  lang: 'hi' | 'en';
  onAbort: (reason: string) => void;
  onProceedAnyway: () => void;
  onReportFalseAlarm: () => void;
}

export const LiveWarningModal: React.FC<LiveWarningModalProps> = ({
  isOpen,
  tx,
  assessment,
  lang,
  onAbort,
  onProceedAnyway,
  onReportFalseAlarm
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [showWhyDangerous, setShowWhyDangerous] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanProceed(false);
      voiceCoach.stop();
      setIsPlayingAudio(false);
      return;
    }

    setCountdown(5);
    setCanProceed(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanProceed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const { plainLanguageSummary, plainLanguageSummaryHi, coachingRecommendations, primaryThreatType, primaryThreatTypeHi } = assessment;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      voiceCoach.stop();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak = lang === 'hi' 
        ? `${plainLanguageSummaryHi}. ${coachingRecommendations.hinglish.join('. ')}`
        : `${plainLanguageSummary}. ${coachingRecommendations.english.join('. ')}`;
      
      setIsPlayingAudio(true);
      voiceCoach.speak(textToSpeak, lang === 'hi' ? 'hi-IN' : 'en-IN', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0b101c] border-2 border-rose-500/80 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl shadow-rose-950/60 animate-in zoom-in-95 duration-200">
        
        {/* Urgent Alert Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-rose-200 block">
                  {lang === 'hi' ? 'सुरक्षा चेतावनी (LIVE SCAM ALERT)' : 'M4: LIVE SCAM ALERT'}
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {lang === 'hi' ? '⚠️ रुकिए! यह साइबर ठगी हो सकती है' : '⚠️ HOLD ON! High Scam Risk'}
                </h2>
              </div>
            </div>

            {/* Voice Audio Coach Button with Animated Waves */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-slate-950 scale-105' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Listen aloud (बुजुर्गों के लिए ऑडियो)"
            >
              {isPlayingAudio ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-slate-950 rounded wave-bar"></span>
                  <span className="w-1 bg-slate-950 rounded wave-bar"></span>
                  <span className="w-1 bg-slate-950 rounded wave-bar"></span>
                  <span className="w-1 bg-slate-950 rounded wave-bar"></span>
                </div>
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>{isPlayingAudio ? 'रुकें' : (lang === 'hi' ? '🔊 सुनिए' : '🔊 Listen')}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-slate-100">
          
          {/* Plain-Language Coaching Message for Elderly & First-Time Users */}
          <div className="p-4 rounded-2xl bg-rose-500/[0.08] border border-rose-500/30">
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-rose-100">
              {lang === 'hi' ? plainLanguageSummaryHi : plainLanguageSummary}
            </p>
          </div>

          {/* Quick Context Summary Box */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-white/[0.02] p-3 rounded-2xl border border-white/[0.06]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'hi' ? 'प्राप्तकर्ता / Payee:' : 'Payee:'}</span>
              <span className="font-bold text-white truncate block text-xs">{tx.payeeName}</span>
              <span className="font-mono text-[10px] text-slate-400 truncate block">{tx.payeeVpa}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'hi' ? 'रकम / Amount:' : 'Amount:'}</span>
              <span className="font-mono font-black text-rose-400 text-lg">₹{tx.amount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium">{tx.transactionType.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Step-by-Step Safe Actions */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '👉 तुरंत क्या करें (Safe Coaching Actions):' : '👉 Safe Actions to Take Now:'}
            </h4>
            <div className="space-y-1.5">
              {(lang === 'hi' ? coachingRecommendations.hinglish : coachingRecommendations.english).map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06]">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why is this dangerous? Accordion */}
          <div className="border-t border-white/[0.06] pt-3">
            <button
              onClick={() => setShowWhyDangerous(!showWhyDangerous)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'यह खतरनाक क्यों है? (RBI Fraud Pattern)' : 'Why is this dangerous? (RBI Pattern)'}</span>
            </button>

            {showWhyDangerous && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-slate-300 space-y-1.5 animate-in slide-in-from-top-1">
                <p>
                  <strong className="text-white">{lang === 'hi' ? 'पैटर्न:' : 'Pattern:'}</strong> {lang === 'hi' ? primaryThreatTypeHi : primaryThreatType}
                </p>
                <p className="text-slate-400 leading-relaxed">
                  {lang === 'hi' 
                    ? 'धोखेबाज़ अक्सर कॉल पर रहकर या रिमोट स्क्रीन चालू करवाकर तुरंत PIN डालने का दबाव बनाते हैं। बैंक या बिजली विभाग कभी भी फोन पर UPI भुगतान का निर्देश नहीं देते।'
                    : 'Fraudsters keep victims on active calls to cause panic. Genuine bank or government entities never ask customers to share phone screens or transfer money to private VPAs.'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: Safety First! */}
          <div className="space-y-2.5 pt-1">
            
            {/* Primary Action 1: Cut Call & Cancel Transaction */}
            <button
              onClick={() => onAbort('User followed coaching to cut call and cancel transaction')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/30 transition-all cursor-pointer transform active:scale-98"
            >
              <PhoneOff className="w-5 h-5" />
              <span>
                {lang === 'hi' ? '🛑 कॉल काटें और पेमेंट तुरंत रोकें' : '🛑 Cut Call & Cancel Payment'}
              </span>
            </button>

            {/* Primary Action 2 (if screen share active): Stop Screen Sharing */}
            {tx.signals.isScreenSharingActive && (
              <button
                onClick={() => onAbort('User immediately terminated remote screen sharing')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4" />
                <span>
                  {lang === 'hi' ? 'स्क्रीन शेयरिंग बंद करें (Stop AnyDesk)' : 'Stop Screen Sharing Session'}
                </span>
              </button>
            )}

            {/* Secondary Action 3: Helpline 1930 & False Alarm */}
            <div className="flex items-center justify-between pt-1">
              <a 
                href="tel:1930"
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                title="Call 1930 Cyber Fraud Helpline"
              >
                <PhoneForwarded className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? 'साइबर हेल्पलाइन 1930' : 'Cyber Helpline 1930'}</span>
              </a>

              <button
                onClick={onReportFalseAlarm}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'गलत चेतावनी रिपोर्ट करें' : 'Report False Alarm'}</span>
              </button>
            </div>

            {/* Overridden Proceed Option with Deliberate 5-Second Friction */}
            <div className="pt-2 text-center border-t border-white/[0.04]">
              <button
                disabled={!canProceed}
                onClick={onProceedAnyway}
                className={`text-xs font-medium transition-all ${
                  canProceed 
                    ? 'text-slate-400 hover:text-rose-400 underline cursor-pointer' 
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                {canProceed 
                  ? (lang === 'hi' ? 'मैं जोखिम समझता हूँ, फिर भी आगे बढ़ें' : 'I understand the risks, proceed anyway') 
                  : (lang === 'hi' ? `सुरक्षा प्रतीक्षा (${countdown} सेकंड)...` : `Deliberate Safety Friction (${countdown}s)...`)}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
