interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div 
      className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
      role="alert"
    >
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg leading-none">×</button>
      </div>
    </div>
  );
}
