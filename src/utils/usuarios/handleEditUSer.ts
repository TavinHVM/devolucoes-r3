import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function handleEditUser(id: number, dados: {
    first_name?: string
    last_name?: string
    password?: string
    role?: string
    user_level?: string
    email?: string
}) {
    try {
        const updatedData = { ...dados }

        // Se senha foi enviada, criptografa
        if (dados.password) {
            updatedData.password = await bcrypt.hash(dados.password, 10)
        }

        // Atualiza o campo updated_at automaticamente
        const updatedUser = await prisma.user_profiles.update({
            where: { id },
            data: {
                ...updatedData,
                updated_at: new Date()
            }
        })

        return updatedUser
    } catch (error) {
        console.error('Erro ao editar usuário:', error)
        throw new Error('Erro ao editar usuário')
    }
}
