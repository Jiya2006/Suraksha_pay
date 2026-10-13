import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Share2, Download } from 'lucide-react';
import { TransactionInput } from '../types';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  tx: TransactionInput;
  onClose: () => void;
  lang: 'hi' | 'en';
}

export const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({
  isOpen,
  tx,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const txnId = 'UPI' + Math.floor(100000000000 + Math.random() * 900000000000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
          {lang === 'hi' ? 'भुगतान सफल' : 'Payment Successful'}
        </span>
        <div className="text-3xl font-black text-slate-100 my-2">
          ₹{tx.amount.toLocaleString()}
        </div>
        <p className="text-xs text-slate-400">
          {lang === 'hi' ? 'भुगतान प्राप्तकर्ता:' : 'Paid to:'} <span className="font-semibold text-slate-200">{tx.payeeName}</span>
        </p>
        <span className="text-[11px] font-mono text-slate-500">{tx.payeeVpa}</span>

        {/* Transaction Details Box */}
        <div className="bg-slate-950/70 rounded-xl p-3 my-4 border border-slate-800/80 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">UPI Ref ID:</span>
            <span className="font-mono text-slate-200">{txnId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Timestamp:</span>
            <span className="text-slate-200">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Note:</span>
            <span className="text-slate-200">{tx.note || 'None'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 justify-center text-xs text-emerald-400/90 mb-5">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सुरक्षा जांच पूर्ण' : 'SurakshaPay Verified & Logged'}</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
        >
          {lang === 'hi' ? 'नया भुगतान सिमुलेट करें' : 'Simulate Another Transaction'}
        </button>
      </div>
    </div>
  );
};
