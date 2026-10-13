import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Tv, 
  Smartphone, 
  Cpu, 
  ShieldAlert, 
  MessageSquare,
  AlertTriangle,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface ArchitectureDiagramProps {
  lang: 'hi' | 'en';
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-black text-slate-100 tracking-tight">
          {lang === 'hi' 
            ? 'सिस्टम आर्किटेक्चर: पोस्ट-फैक्ट SMS बनाम रियल-टाइम लाइव कोचिंग' 
            : 'Architecture: Broken Post-Fact SMS vs Real-Time In-The-Moment Coaching'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          {lang === 'hi'
            ? 'बैंक वर्तमान में सिर्फ पैसे कटने के बाद SMS भेजते हैं। सुरक्षापे (SurakshaPay) लेनदेन से ठीक पहले लाइव डिवाइस सिग्नल्स को पकड़कर बुजुर्गों व नए यूजर्स को ऑडियो-विजुअल कोचिंग प्रदान करता है।'
            : 'Traditional fraud detection is post-fact (notifying victims after money is gone). Our system intervenes pre-PIN via telemetry fusion, rules, ML scoring, and empathetic plain-language voice coaching.'}
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* The Broken Old Paradigm (POST-FACT) */}
        <div className="bg-red-950/20 border-2 border-red-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-red-500/30 mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-black text-red-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'मौजूदा स्थिति: पोस्ट-फैक्ट (बहुत देर हो चुकी)' : 'Current Paradigm: Post-Fact (Too Late)'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                MONEY LOST
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-red-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <span className="font-bold text-slate-200">Social Engineering / Panic Call</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Scammer calls victim claiming electricity cut or KYC freeze, asks them to open UPI app.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-red-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <span className="font-bold text-slate-200">No In-The-Moment Warning</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">UPI app opens normally. No check on whether user is on a phone call or sharing screen.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-red-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <span className="font-bold text-slate-200">Victim Enters Secret UPI PIN</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Transaction successfully executes. Bank account balance wiped out immediately.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shrink-0">4</span>
                <div>
                  <span className="font-bold text-red-200">Bank SMS Alert (Post-Fact)</span>
                  <p className="text-red-300 text-[11px] mt-0.5">"A/c debited by Rs 45,000". Scammer immediately cuts call and transfers money to mule accounts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-900/40 text-[11px] text-red-400 font-semibold">
            Result: 0% real-time prevention. Victim has to run between police station and bank.
          </div>
        </div>

        {/* The New SurakshaPay Paradigm (IN-THE-MOMENT COACHING) */}
        <div className="bg-emerald-950/20 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'सुरक्षापे: इन-द-मोमेंट कोचिंग (पैसे सुरक्षित)' : 'SurakshaPay: In-The-Moment Coaching'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                FRAUD INTERCEPTED
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <span className="font-bold text-slate-200">M1 & M2: Real-Time Signal Interception</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Detects concurrent voice call, AnyDesk screen mirroring, newly created VPA, urgency keywords.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <span className="font-bold text-slate-200">M3: Hybrid Risk Engine (Rules + ML)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Deterministic fatal safety lockouts + ML classification score generated in &lt;15 milliseconds.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <span className="font-bold text-slate-200">M4: Live Warning & Plain-Language Audio Coach</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Bilingual popup with audio coach: "⚠️ RUKIYE! Yeh number verified nahi hai, call turant kaatein!"</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">4</span>
                <div>
                  <span className="font-bold text-emerald-300">M5: Interception & Feedback Telemetry</span>
                  <p className="text-emerald-400 text-[11px] mt-0.5">User clicks "Cut Call & Cancel". 100% money saved before PIN entry. Telemetry logged to improve model.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/40 text-[11px] text-emerald-400 font-semibold">
            Result: 100% loss prevented before payment executes. Empowers vulnerable users & seniors.
          </div>
        </div>

      </div>

      {/* End-to-End Pipeline Technical Flow */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
          End-to-End Processing Pipeline (Pre-PIN Latency: ~12ms)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 1</span>
            <strong className="text-slate-200 block">User Tap</strong>
            <span className="text-[10px] text-slate-500">Initiates Pay or Collect</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 2</span>
            <strong className="text-slate-200 block">Signal Extraction</strong>
            <span className="text-[10px] text-slate-500">Call / Screen / VPA Age</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 3</span>
            <strong className="text-slate-200 block">Hybrid Risk Score</strong>
            <span className="text-[10px] text-slate-500">Safety Rules + ML Model</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 4</span>
            <strong className="text-slate-200 block">In-The-Moment UI</strong>
            <span className="text-[10px] text-slate-500">Plain Hindi/Eng Voice</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 5</span>
            <strong className="text-slate-200 block">M5 Telemetry</strong>
            <span className="text-[10px] text-slate-500">Feedback Loop & Retrain</span>
          </div>
        </div>
      </div>
    </div>
  );
};
