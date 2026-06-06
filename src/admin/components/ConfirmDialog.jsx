import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler' }) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-[#1C2340]/40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
                style={{ backdropFilter: 'blur(2px)' }}
            />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
                <div
                    className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-title"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center rounded-full bg-[#FEE2E2]"
                                style={{ width: '40px', height: '40px' }}
                            >
                                <AlertTriangle size={20} color="#EF4444" strokeWidth={1.8} />
                            </div>
                            <h3 id="confirm-title" className="font-serif text-[#1C2340]" style={{ fontSize: '20px', fontWeight: 600 }}>
                                {title}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-1" aria-label="Fermer">
                            <X size={20} color="#1C2340" strokeWidth={1.8} />
                        </button>
                    </div>

                    <p className="font-sans text-[#5A6080] mb-6" style={{ fontSize: '14px' }}>
                        {message}
                    </p>

                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 border border-[#EBB4BB] text-[#1C2340] font-sans font-semibold rounded-full hover:bg-[#FDE8EC] transition-colors"
                            style={{ height: '48px', fontSize: '14px' }}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 bg-[#E63946] text-white font-sans font-semibold rounded-full hover:bg-[#DC2626] transition-colors"
                            style={{ height: '48px', fontSize: '14px' }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
