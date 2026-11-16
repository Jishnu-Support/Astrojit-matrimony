import React from 'react';
import MatrimonyPortal from './MatrimonyPortal';

export default function MatrimonyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-rose-200 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        <MatrimonyPortal isModal={true} onClose={onClose} />
      </div>
    </div>
  );
}
