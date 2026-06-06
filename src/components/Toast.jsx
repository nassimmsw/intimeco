import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none"
      style={{ width: 'calc(100% - 32px)', maxWidth: '360px' }}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) ref.current.classList.remove('toast-enter');
      if (ref.current) ref.current.classList.add('toast-exit');
      setTimeout(() => onDismiss(toast.id), 300);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      ref={ref}
      role="status"
      className="toast-enter pointer-events-auto w-full flex items-center justify-between gap-3 bg-white px-4 rounded-2xl"
      style={{
        boxShadow: '0 8px 32px rgba(28,35,64,0.16)',
        height: '52px',
        borderLeft: '4px solid #1C2340',
      }}
    >
      <p
        className="font-sans text-[#1C2340] font-medium flex-1"
        style={{ fontSize: '14px', letterSpacing: '-0.01em' }}
      >
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
        className="flex items-center justify-center flex-none"
        style={{ width: '28px', height: '28px' }}
      >
        <X size={16} color="#9CA3AF" strokeWidth={1.8} />
      </button>
    </div>
  );
}
