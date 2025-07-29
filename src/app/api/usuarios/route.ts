import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const usuarios = await db.user_profiles.findMany();

        if (!usuarios || usuarios.length === 0) {
            console.log('Usuários não encontrados!');
            return NextResponse.json([], { status: 404 }); // Retorne um array vazio em vez de um objeto
        }

        console.log('Usuários encontrados!\n Quantidade de Usuários:', usuarios.length);
        return NextResponse.json(usuarios); // Retorne diretamente o array de Usuários
    } catch (error) {
        console.error('Erro ao buscar Usuários:', error);
        return NextResponse.json({ error: 'Erro ao buscar Usuários' }, { status: 500 });
    }
}
