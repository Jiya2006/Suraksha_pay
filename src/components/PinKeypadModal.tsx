import React, { useState } from 'react';
import { Lock, X, Delete } from 'lucide-react';

interface PinKeypadModalProps {
  isOpen: boolean;
  amount: number;
  payeeName: string;
  onClose: () => void;
  onSubmitPin: (pin: string) => void;
  isScreenSharingActive: boolean;
  lang: 'hi' | 'en';
}

export const PinKeypadModal: React.FC<PinKeypadModalProps> = ({
  isOpen,
  amount,
  payeeName,
  onClose,
  onSubmitPin,
  isScreenSharingActive,
  lang
}) => {
  const [pin, setPin] = useState<string>('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 6 || next.length === 4) {
        // Auto submit if 4 or 6 digits
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length >= 4) {
      onSubmitPin(pin);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
        
        {/* Screen sharing banner alert if active */}
        {isScreenSharingActive && (
          <div className="absolute top-2 left-4 right-4 bg-red-600 text-white text-[11px] font-bold py-1 px-3 rounded-lg text-center animate-bounce">
            ⚠️ SCREEN SHARING ACTIVE! YOUR PIN IS VISIBLE TO STRANGER!
          </div>
        )}

        <div className="flex items-center justify-between mt-3 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
              {lang === 'hi' ? 'सुरक्षित UPI PIN दर्ज करें' : 'ENTER 6-DIGIT UPI PIN'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Payee Summary */}
        <div className="text-center py-3 border-y border-slate-800 my-2">
          <span className="text-xs text-slate-400 block">{lang === 'hi' ? 'भुगतान कर रहे हैं:' : 'Paying to:'}</span>
          <span className="font-bold text-slate-200 text-base">{payeeName}</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{amount.toLocaleString()}</div>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 my-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                i < pin.length
                  ? 'bg-emerald-400 border-emerald-400 scale-110'
                  : 'border-slate-700 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            0
          </button>
          <button
            disabled={pin.length < 4}
            onClick={handleConfirm}
            className={`h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
              pin.length >= 4
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            ✓ {lang === 'hi' ? 'पुष्टि' : 'Pay'}
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-500 mt-4">
          {lang === 'hi' ? 'सुरक्षा सिमुलेशन - कभी भी किसी के साथ UPI PIN शेयर न करें' : 'Simulation - UPI PIN is never stored or transmitted'}
        </p>
      </div>
    </div>
  );
};
