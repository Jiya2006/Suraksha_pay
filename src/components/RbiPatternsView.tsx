import React from 'react';
import { RBI_FRAUD_ADVISORIES } from '../data/rbiAdvisories';
import { ShieldAlert, BookOpen, AlertOctagon, CheckCircle2, ExternalLink } from 'lucide-react';

interface RbiPatternsViewProps {
  lang: 'hi' | 'en';
}

export const RbiPatternsView: React.FC<RbiPatternsViewProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 tracking-tight">
              {lang === 'hi' 
                ? 'RBI व नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल (1930) फ्रॉड पैटर्न' 
                : 'RBI & Cyber Helpline (1930) Public Fraud Pattern Advisories'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'भारतीय रिज़र्व बैंक (BE-AWARE बुकलेट) और NPCI द्वारा जारी मुख्य धोखाधड़ी के तरीके और निवारक उपाय'
                : 'Key fraud typologies catalogued from RBI "BE(A)WARE" directives and NPCI safety bulletins'}
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RBI_FRAUD_ADVISORIES.map((advisory) => (
          <div 
            key={advisory.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Category Tag & Source */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {advisory.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {advisory.source}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-slate-100 mb-2">
                {lang === 'hi' ? advisory.titleHi : advisory.title}
              </h3>

              {/* Modus Operandi */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100 block mb-1">
                  {lang === 'hi' ? 'ठगी का तरीका (Modus Operandi):' : 'Modus Operandi:'}
                </strong>
                {lang === 'hi' ? advisory.modUsOperandiHi : advisory.modUsOperandi}
              </div>

              {/* Red Flags */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'पहचान के मुख्य संकेत (Red Flags):' : 'Key Red Flags:'}</span>
                </span>
                <ul className="space-y-1">
                  {advisory.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safe Action */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-0.5">
                    {lang === 'hi' ? 'सुरक्षा नियम (Safe Rule):' : 'Golden Rule:'}
                  </strong>
                  <span>{advisory.safeAction}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
