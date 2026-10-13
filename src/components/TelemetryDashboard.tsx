import React, { useState } from 'react';
import { TelemetryLog } from '../types';
import { getTelemetryLogs, getTelemetrySummary, clearTelemetryLogs } from '../services/telemetryStore';
import { 
  ShieldCheck, 
  IndianRupee, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Download, 
  Filter, 
  RefreshCw,
  PhoneOff,
  CornerDownRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface TelemetryDashboardProps {
  lang: 'hi' | 'en';
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ lang }) => {
  const [logs, setLogs] = useState<TelemetryLog[]>(getTelemetryLogs());
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccess, setRetrainSuccess] = useState<boolean>(false);

  const summary = getTelemetrySummary();

  const handleRefresh = () => {
    setLogs(getTelemetryLogs());
  };

  const handleClear = () => {
    if (window.confirm('Clear all telemetry logs?')) {
      clearTelemetryLogs();
      setLogs([]);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `surakshapaye_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSimulateRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 4000);
    }, 1500);
  };

  const filteredLogs = logs.filter(l => {
    if (filterDecision === 'ALL') return true;
    return l.userDecision === filterDecision;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-100 tracking-tight">
                {lang === 'hi' ? 'M5: पोस्ट-चेतावनी फीडबैक और टेलीमेट्री लूप' : 'M5: Post-Warning Feedback & Telemetry Logging Loop'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {lang === 'hi' 
                ? 'चेतावनी के बाद उपयोगकर्ता के निर्णय (कॉल काटना, रद्द करना या जारी रखना) को मॉडल सुधारने और साइबर अपराध रोकने के लिए रियल-टाइम में दर्ज किया जाता है।' 
                : 'Tracks user decisions following live warnings (aborted vs proceeded), quantifying rupees protected and closing the active learning loop.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateRetrain}
              disabled={isRetraining}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{isRetraining ? 'Retraining Weights...' : 'Retrain on Feedback'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
              title="Export JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition-colors cursor-pointer"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {retrainSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'hi' 
                ? 'सफलता: मॉडल के भार को नए फीडबैक के आधार पर री-ट्रेन व फाइन-ट्यून किया गया।' 
                : 'Success: Active learning loop closed! Gradient weights adjusted using recent user overrides.'}
            </span>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'रोकी गई ठगी (Scams Intercepted)' : 'Scams Intercepted'}
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {summary.abortedScamsCount}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {lang === 'hi' ? 'कॉल काटकर बचाए गए पीड़ित' : 'Victims saved in real-time'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'बचाई गई राशि (Rupees Protected)' : 'Rupees Protected'}
            </span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              ₹{summary.rupeesSaved.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {lang === 'hi' ? 'ठगी से बचाई गई कुल रकम' : 'Direct fraud loss prevented'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'रोकथाम सफलता दर' : 'Intervention Rate'}
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {summary.interventionSuccessRate}%
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {lang === 'hi' ? 'हाई रिस्क चेतावनियों पर एक्शन' : 'Followed coach guidance'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'गलत अलार्म रिपोर्ट' : 'Reported False Alarms'}
            </span>
            <div className="text-2xl font-black text-slate-300 mt-1">
              {summary.falseAlarms}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {lang === 'hi' ? 'मॉडल सुधार के लिए फीडबैक' : 'Used for model recalibration'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Table of Post-Warning Logs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'hi' ? 'हालिया लेनदेन व उपयोगकर्ता विकल्प' : 'Recent Telemetry & Decision Log'}
            </h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterDecision('ALL')}
              className={`px-2.5 py-1 rounded font-medium ${filterDecision === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilterDecision('ABORTED_SAFE')}
              className={`px-2.5 py-1 rounded font-medium ${filterDecision === 'ABORTED_SAFE' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Aborted / Saved
            </button>
            <button
              onClick={() => setFilterDecision('OVERRIDDEN_PROCEEDED')}
              className={`px-2.5 py-1 rounded font-medium ${filterDecision === 'OVERRIDDEN_PROCEEDED' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              Proceeded
            </button>
            <button
              onClick={() => setFilterDecision('REPORTED_FALSE_ALARM')}
              className={`px-2.5 py-1 rounded font-medium ${filterDecision === 'REPORTED_FALSE_ALARM' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              False Alarm
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">ID & Time</th>
                <th className="pb-3 font-semibold">Payee & VPA</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Risk & Threat</th>
                <th className="pb-3 font-semibold">Signals Detected</th>
                <th className="pb-3 font-semibold text-right">User Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-mono text-[11px] text-slate-400">
                    <div>{log.id}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="font-semibold text-slate-200">{log.payeeName}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.payeeVpa}</div>
                  </td>

                  <td className="py-3 font-mono font-bold text-slate-100">
                    ₹{log.amount.toLocaleString()}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                        log.riskLevel === 'CRITICAL' ? 'bg-red-500 text-white' :
                        log.riskLevel === 'HIGH' ? 'bg-orange-500 text-white' :
                        log.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-slate-950' :
                        'bg-emerald-500 text-slate-950'
                      }`}>
                        {log.riskScore}
                      </span>
                      <span className="text-slate-300 font-medium truncate max-w-[140px] block">
                        {log.primaryThreat}
                      </span>
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {log.signals.isScreenSharingActive && (
                        <span className="text-[9px] px-1 rounded bg-red-950 text-red-300 border border-red-800">
                          ScreenShare
                        </span>
                      )}
                      {log.signals.isOnActiveCall && (
                        <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          Call ({log.signals.callDurationMinutes}m)
                        </span>
                      )}
                      {!log.signals.isPayeeInContacts && (
                        <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">
                          Stranger
                        </span>
                      )}
                      {log.signals.urgencyKeywordFound && (
                        <span className="text-[9px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          Urgent
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      log.userDecision === 'ABORTED_SAFE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : log.userDecision === 'OVERRIDDEN_PROCEEDED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {log.userDecision === 'ABORTED_SAFE' 
                        ? '🛑 Aborted (Saved)' 
                        : log.userDecision === 'OVERRIDDEN_PROCEEDED'
                        ? '⚠️ Overridden'
                        : '🚩 False Alarm'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No telemetry logs matching this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
