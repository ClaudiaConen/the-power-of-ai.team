import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastItem {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="sf-toast-container">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastMessage({ toast, onRemove }: { toast: ToastItem; onRemove: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`sf-toast sf-toast--${toast.type}${visible ? ' sf-toast--visible' : ''}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{toast.message}</span>
      <button className="sf-toast-close" onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}>
        <X size={14} />
      </button>
    </div>
  );
}
