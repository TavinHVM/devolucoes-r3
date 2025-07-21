import { Suspense } from "react";
import ResetPasswordInner from "./(functions)/ResetPasswordInner";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>
        <div className="mt-4">Carregando...</div>
      </div>
    }>
      <ResetPasswordInner />
    </Suspense>
  );
}
