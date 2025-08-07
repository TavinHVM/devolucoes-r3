import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 bottom-6 right-6 min-w-[280px] max-w-sm px-4 py-3 rounded-lg shadow-2xl text-white font-medium transition-all duration-300 animate-in slide-in-from-bottom-2 ${
        type === "success"
          ? "bg-gradient-to-r from-green-600 to-green-700 border border-green-500/50"
          : "bg-gradient-to-r from-red-600 to-red-700 border border-red-500/50"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-200" />
        ) : (
          <XCircle className="h-5 w-5 text-red-200" />
        )}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-lg leading-none hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
}
