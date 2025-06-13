'use client';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useForm } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      nome: "",
    },
  });

  function onSubmit(data: { nome: string }) {
    // Redireciona para a página de solicitação
    router.push("/solicitacao");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome:</Label>
              <Input id="nome" {...form.register("nome")} required />
            </div>
            <Button type="submit" className="w-full mt-4">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
