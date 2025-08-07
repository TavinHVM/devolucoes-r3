import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("Tentativa de login para:", data.email);

    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await prisma.user_profiles.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    // Gerar token JWT com expiração maior
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        user_level: user.user_level,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" } // 7 dias ao invés de 24h
    );

    // Retornar dados do usuário (sem a senha) e o token
    const userResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      user_level: user.user_level,
      created_at: user.created_at,
    };

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: userResponse,
      token,
    });

    // Definir cookie com o token (7 dias)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
