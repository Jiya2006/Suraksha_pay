import React from 'react';
import { DeviceSignals } from '../types';
import { 
  Tv, 
  PhoneCall, 
  UserX, 
  BadgeCheck, 
  Clock, 
  AlertTriangle, 
  Radio,
  Sliders,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface LiveSignalTogglesProps {
  signals: DeviceSignals;
  setSignals: React.Dispatch<React.SetStateAction<DeviceSignals>>;
  lang: 'hi' | 'en';
}

export const LiveSignalToggles: React.FC<LiveSignalTogglesProps> = ({
  signals,
  setSignals,
  lang
}) => {
  const updateSignal = <K extends keyof DeviceSignals>(key: K, value: DeviceSignals[K]) => {
    setSignals(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="relative p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            <Radio className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {lang === 'hi' ? 'M2: डिवाइस सिग्नल्स व सेंसर टेलीमेट्री' : 'M2: Device Sensors & Telemetry'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi' ? 'सिग्नल बदलकर लाइव मॉडल रिस्क टेस्ट करें' : 'Interactive switches for live risk simulation'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          OS Sensor Bus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Signal 1: Screen Mirroring (FATAL RISK) */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-200 ${
          signals.isScreenSharingActive 
            ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-900/20 ring-1 ring-rose-500/40' 
            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${signals.isScreenSharingActive ? 'bg-rose-500/25 text-rose-300' : 'bg-white/[0.04] text-slate-400'}`}>
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {lang === 'hi' ? 'स्क्रीन शेयरिंग' : 'Screen Share'}
                  </span>
                  {signals.isScreenSharingActive && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                      FATAL
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'AnyDesk / TeamViewer एक्टिव' : 'AnyDesk / Screen mirror active'}
                </p>
              </div>
            </div>

            {/* iOS Style Glowing Switch */}
            <button
              onClick={() => updateSignal('isScreenSharingActive', !signals.isScreenSharingActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                signals.isScreenSharingActive ? 'bg-rose-500 shadow-md shadow-rose-500/40' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  signals.isScreenSharingActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Signal 2: Active Ongoing Phone Call */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-200 ${
          signals.isOnActiveCall 
            ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-900/20 ring-1 ring-amber-500/40' 
            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${signals.isOnActiveCall ? 'bg-amber-500/25 text-amber-300' : 'bg-white/[0.04] text-slate-400'}`}>
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {lang === 'hi' ? 'कॉल पर हैं (Active Call)' : 'Ongoing Call'}
                  </span>
                  {signals.isOnActiveCall && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' 
                    ? `कॉल पर बात चालू (${signals.callDurationMinutes}m)` 
                    : `Active call in background (${signals.callDurationMinutes}m)`}
                </p>
              </div>
            </div>

            <button
              onClick={() => updateSignal('isOnActiveCall', !signals.isOnActiveCall)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                signals.isOnActiveCall ? 'bg-amber-400 shadow-md shadow-amber-400/40' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                  signals.isOnActiveCall ? 'translate-x-5 bg-white' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Call duration slider */}
          {signals.isOnActiveCall && (
            <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">{lang === 'hi' ? 'कॉल अवधि:' : 'Duration:'}</span>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={signals.callDurationMinutes}
                  onChange={(e) => updateSignal('callDurationMinutes', Number(e.target.value))}
                  className="w-20 accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="font-mono font-bold text-amber-300 min-w-8">{signals.callDurationMinutes} mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Signal 3: Contact List Status */}
        <div className="p-3.5 rounded-2xl border bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${signals.isPayeeInContacts ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {signals.isPayeeInContacts ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'कॉन्टैक्ट लिस्ट में सेव' : 'Saved in Contacts'}
                </span>
                <p className="text-[10px] text-slate-400">
                  {signals.isPayeeInContacts 
                    ? (lang === 'hi' ? 'फोन में सेव (विश्वसनीय)' : 'Saved in address book') 
                    : (lang === 'hi' ? 'अनजान व्यक्ति (Stranger)' : 'Unknown recipient')}
                </p>
              </div>
            </div>

            <button
              onClick={() => updateSignal('isPayeeInContacts', !signals.isPayeeInContacts)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                signals.isPayeeInContacts ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  signals.isPayeeInContacts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Signal 4: Verified Merchant Check */}
        <div className="p-3.5 rounded-2xl border bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${signals.isPayeeVerifiedMerchant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-slate-400'}`}>
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'NPCI वेरिफाइड स्टोर' : 'Verified Merchant'}
                </span>
                <p className="text-[10px] text-slate-400">
                  {signals.isPayeeVerifiedMerchant 
                    ? (lang === 'hi' ? 'प्रमाणित मर्चेंट खाता' : 'Official merchant account') 
                    : (lang === 'hi' ? 'निजी P2P खाता' : 'Individual P2P handle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => updateSignal('isPayeeVerifiedMerchant', !signals.isPayeeVerifiedMerchant)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                signals.isPayeeVerifiedMerchant ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  signals.isPayeeVerifiedMerchant ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Signal 5: Urgency Keywords Detection */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          signals.urgencyKeywordFound 
            ? 'bg-amber-500/10 border-amber-500/40' 
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${signals.urgencyKeywordFound ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-slate-400'}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'दबाव/धमकी वाले शब्द' : 'Urgency Keywords'}
                </span>
                <p className="text-[10px] text-slate-400">
                  {signals.urgencyKeywordFound 
                    ? (signals.detectedKeywords.join(', ') || 'Urgency detected') 
                    : (lang === 'hi' ? 'कोई आपातकालीन भाषा नहीं' : 'No threat keywords found')}
                </p>
              </div>
            </div>

            <button
              onClick={() => updateSignal('urgencyKeywordFound', !signals.urgencyKeywordFound)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                signals.urgencyKeywordFound ? 'bg-amber-400' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  signals.urgencyKeywordFound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Signal 6: Late Night Hour & VPA Age Slider */}
        <div className="p-3.5 rounded-2xl border bg-white/[0.02] border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-white">
                {lang === 'hi' ? 'समय व खाते की आयु' : 'Time & VPA Age'}
              </span>
            </div>
            <button
              onClick={() => updateSignal('unusualHour', !signals.unusualHour)}
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                signals.unusualHour 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-white/[0.05] text-slate-400 hover:text-white'
              }`}
            >
              {signals.unusualHour ? 'Late Night (11 PM)' : 'Daytime'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>{lang === 'hi' ? 'UPI ID उम्र:' : 'VPA Account Age:'}</span>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="1" 
                max="365" 
                value={signals.payeeAccountAgeDays}
                onChange={(e) => updateSignal('payeeAccountAgeDays', Number(e.target.value))}
                className="w-24 accent-emerald-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className={`font-mono font-bold ${signals.payeeAccountAgeDays <= 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {signals.payeeAccountAgeDays}d
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
