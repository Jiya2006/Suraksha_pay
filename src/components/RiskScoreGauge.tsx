import React from 'react';
import { RiskAssessment } from '../types';
import { ShieldCheck, AlertCircle, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

interface RiskScoreGaugeProps {
  assessment: RiskAssessment;
  lang: 'hi' | 'en';
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  assessment,
  lang
}) => {
  const { riskScore, riskLevel, ruleViolations, featureContributions, mlConfidence, primaryThreatType, primaryThreatTypeHi } = assessment;

  // Visual Theme Mappings
  const getTheme = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-white',
          ringColor: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.25)'
        };
      case 'HIGH':
        return {
          gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          badge: 'bg-orange-500 text-white',
          ringColor: '#f97316',
          glow: 'rgba(249, 115, 22, 0.25)'
        };
      case 'MEDIUM':
        return {
          gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-400 text-slate-950',
          ringColor: '#fbbf24',
          glow: 'rgba(251, 191, 36, 0.25)'
        };
      case 'LOW':
        return {
          gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          badge: 'bg-blue-400 text-slate-950',
          ringColor: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.25)'
        };
      default:
        return {
          gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-400 text-slate-950',
          ringColor: '#10b981',
          glow: 'rgba(16, 185, 129, 0.25)'
        };
    }
  };

  const theme = getTheme(riskLevel);

  // SVG Circular Gauge Calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] shadow-xl flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {lang === 'hi' ? 'M3: हाइब्रिड रिस्क स्कोर (Rules + ML)' : 'M3: Hybrid Risk Engine'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'hi' ? 'नियम + मशीन लर्निंग मॉडल का संयुक्त स्कोर' : 'Deterministic Rules & ML Classifier'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
            Confidence: {Math.round(mlConfidence * 100)}%
          </span>
        </div>

        {/* Main Score Hero Card */}
        <div className={`p-4 rounded-2xl border bg-gradient-to-r ${theme.gradient} ${theme.border} mb-4 relative overflow-hidden transition-all duration-300 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              {/* Radial SVG Circular Ring Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={theme.ringColor}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${theme.text}`}>
                    {riskScore}
                  </span>
                  <span className="text-[9px] text-slate-500 -mt-1 font-bold">/100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${theme.badge}`}>
                    {riskLevel} RISK
                  </span>
                  {riskLevel === 'CRITICAL' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {lang === 'hi' ? primaryThreatTypeHi : primaryThreatType}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {riskScore >= 65 
                    ? (lang === 'hi' ? 'उच्च जोखिम: लाइव चेतावनी व कोचिंग शुरू होगी' : 'High Risk: Live Coaching Triggered')
                    : (lang === 'hi' ? 'कम जोखिम: सामान्य प्रवाह' : 'Safe to proceed')}
                </span>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Rule Triggers</span>
              <span className="text-lg font-black text-slate-200 font-mono">
                {ruleViolations.length}
              </span>
            </div>
          </div>
        </div>

        {/* Triggered Deterministic Safety Rules */}
        {ruleViolations.length > 0 && (
          <div className="mb-4">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'सक्रिय नियम चेतावनियां (Triggered Rules)' : 'Triggered Deterministic Rules'}</span>
            </h5>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {ruleViolations.map((rule) => (
                <div 
                  key={rule.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                    rule.severity === 'CRITICAL' 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">{lang === 'hi' ? rule.titleHi : rule.title}</span>
                    <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">{lang === 'hi' ? rule.descriptionHi : rule.description}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/40 text-slate-300 shrink-0">
                    +{rule.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explainable AI (XAI) / SHAP Feature Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'hi' ? 'फीचर प्रभाव (Explainable AI)' : 'Feature Impact (Explainable AI)'}</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono">SHAP Attribution</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {featureContributions.map((fc, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  {fc.direction === 'RISK' ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-slate-200 font-medium truncate">{fc.featureLabel}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">({String(fc.value)})</span>
                </div>

                <span className={`font-mono text-xs font-bold shrink-0 ml-2 ${
                  fc.direction === 'RISK' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {fc.impactScore > 0 ? `+${fc.impactScore}` : fc.impactScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Bottom Summary Banner */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] flex items-center justify-between text-slate-400">
        <span>{lang === 'hi' ? 'सिफारिश:' : 'Recommendation:'}</span>
        <span className={`font-bold ${
          riskScore >= 65 ? 'text-rose-400' : riskScore >= 45 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {riskScore >= 65 
            ? (lang === 'hi' ? '🛡️ लाइव कोचिंग अलर्ट दिखाएं' : '🛡️ Show In-The-Moment Coaching') 
            : riskScore >= 45 
            ? (lang === 'hi' ? '⚠️ सावधानी सलाह दिखाएं' : '⚠️ Show Advisory Warning') 
            : (lang === 'hi' ? '✓ सुरक्षित - सीधे आगे बढ़ें' : '✓ Safe - Direct PIN Entry')}
        </span>
      </div>
    </div>
  );
};
