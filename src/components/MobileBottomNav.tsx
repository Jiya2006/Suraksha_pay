import React from 'react';
import { Smartphone, ShieldAlert, Radio, Activity, BookOpen, Cpu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'simulator' | 'telemetry' | 'evaluation' | 'advisories' | 'architecture' | 'signals' | 'risk';
  setActiveTab: (tab: any) => void;
  lang: 'hi' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  lang
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a12]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around shadow-2xl max-w-md mx-auto">
      
      {/* 1. Pay */}
      <button
        onClick={() => setActiveTab('simulator')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'simulator'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Smartphone className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{lang === 'hi' ? 'पेमेंट' : 'Pay'}</span>
      </button>

      {/* 2. Risk Radar */}
      <button
        onClick={() => setActiveTab('risk')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'risk'
            ? 'text-cyan-400 font-bold scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Cpu className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{lang === 'hi' ? 'रिस्क' : 'Risk'}</span>
      </button>

      {/* 3. Sensors / Signals */}
      <button
        onClick={() => setActiveTab('signals')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'signals'
            ? 'text-amber-400 font-bold scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Radio className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{lang === 'hi' ? 'सेंसर' : 'Sensors'}</span>
      </button>

      {/* 4. M5 Feedback */}
      <button
        onClick={() => setActiveTab('telemetry')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'telemetry'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Activity className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{lang === 'hi' ? 'फीडबैक' : 'M5 Logs'}</span>
      </button>

      {/* 5. RBI Tips */}
      <button
        onClick={() => setActiveTab('advisories')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'advisories'
            ? 'text-purple-400 font-bold scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <BookOpen className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{lang === 'hi' ? 'RBI टिप्स' : 'RBI Tips'}</span>
      </button>

    </div>
  );
};
