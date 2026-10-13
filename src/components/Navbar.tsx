import React from 'react';
import { ShieldCheck, Activity, Cpu, FileText, Smartphone, GitMerge, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'simulator' | 'telemetry' | 'evaluation' | 'advisories' | 'architecture' | 'signals' | 'risk';
  setActiveTab: (tab: any) => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('simulator')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  SurakshaPay
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wide">
                  AI SCAM COACH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'hi' ? 'लेनदेन पूर्व लाइव धोखाधड़ी सुरक्षा' : 'Real-Time In-The-Moment Fraud Prevention'}
              </p>
            </div>
          </div>

          {/* Clean Pill Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06] shadow-inner">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'UPI सिमुलेटर' : 'UPI Simulator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'M5 फीडबैक' : 'M5 Feedback'}</span>
            </button>

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'evaluation'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'ML मॉडल (85%+ Recall)' : 'ML Evaluation (85%+)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('advisories')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'advisories'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'RBI पैटर्न' : 'RBI Advisories'}</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'आर्किटेक्चर' : 'Architecture'}</span>
            </button>
          </nav>

          {/* Right Controls: Simulation Pill & Language */}
          <div className="flex items-center gap-3">
            {/* Live simulation indicator */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold text-emerald-400/90 bg-emerald-500/[0.08] border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>NPCI Sandbox Live</span>
            </div>

            {/* Language toggle: Hindi vs English */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs">
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium ${activeTab === 'simulator' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium ${activeTab === 'telemetry' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium ${activeTab === 'evaluation' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            ML Evaluation
          </button>
          <button
            onClick={() => setActiveTab('advisories')}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium ${activeTab === 'advisories' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            RBI Advisories
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium ${activeTab === 'architecture' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Architecture
          </button>
        </div>
      </div>
    </header>
  );
};
