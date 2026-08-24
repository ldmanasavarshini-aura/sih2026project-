import React from 'react';
import { X, QrCode, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  qrValue: string;
  details?: { label: string; value: string }[];
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  qrValue,
  details = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Subtitle */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center shadow-xs">
            <QrCode className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>

        {/* QR Code Graphical Box */}
        <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block shadow-inner">
          <div className="w-44 h-44 bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center justify-center relative mx-auto">
            {/* SVG Simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <rect x="0" y="0" width="30" height="30" rx="3" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />
              
              <rect x="70" y="0" width="30" height="30" rx="3" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />
              
              <rect x="0" y="70" width="30" height="30" rx="3" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />

              {/* Data Blocks */}
              <rect x="35" y="5" width="10" height="10" />
              <rect x="50" y="5" width="10" height="10" />
              <rect x="35" y="20" width="15" height="15" />
              <rect x="55" y="20" width="10" height="10" />
              
              <rect x="5" y="35" width="10" height="10" />
              <rect x="20" y="40" width="15" height="15" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="65" y="35" width="10" height="10" />
              <rect x="80" y="40" width="15" height="15" />
              
              <rect x="35" y="70" width="15" height="15" />
              <rect x="55" y="75" width="10" height="10" />
              <rect x="70" y="70" width="10" height="10" />
              <rect x="85" y="85" width="10" height="10" />
            </svg>
            <div className="absolute bottom-1 bg-teal-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
              SWASTHYA-SETU
            </div>
          </div>
          <p className="mt-2 text-[11px] font-mono font-bold text-slate-700 break-all">{qrValue}</p>
        </div>

        {/* Details list */}
        {details.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-lg text-left text-xs space-y-1.5 border border-slate-100 mb-4">
            {details.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-600">
                <span className="font-medium text-slate-500">{item.label}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-semibold mb-4 bg-emerald-50 py-1.5 px-3 rounded-md border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified Government Digital Token</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Token</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-teal-700 text-white hover:bg-teal-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
