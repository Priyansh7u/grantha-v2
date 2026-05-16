import { useState, useCallback } from 'react';

let id = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'info', ms = 3400) => {
    const tid = ++id;
    setToasts(p => [...p, { id: tid, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== tid)), ms);
  }, []);
  return { toasts, toast };
}

const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
export function Toasts({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ fontWeight: 700, fontSize: '.9rem' }}>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
