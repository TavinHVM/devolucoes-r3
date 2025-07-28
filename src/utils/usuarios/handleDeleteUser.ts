import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function handleDeleteUser(id: number) {
    try {
        const deletedUser = await prisma.user_profiles.delete({
            where: { id }
        })

        return deletedUser
    } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        throw new Error('Usuário não encontrado ou erro ao excluir')
    }
}
