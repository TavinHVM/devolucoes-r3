import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function handleCreateUser(data: {
    first_name: string
    last_name: string
    password: string
    role: string
    user_level: string
    email: string
}) {
    try {
        const encryptedPassword = await bcrypt.hash(data.password, 10)

        const newUser = await prisma.user_profiles.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                password: encryptedPassword,
                role: data.role,
                user_level: data.user_level,
                email: data.email
                // created_at e updated_at preenchidos automaticamente
            }
        })

        return newUser
    } catch (error) {
        console.error('Erro ao criar usuário:', error)
        throw new Error('Erro ao criar usuário')
    }
}