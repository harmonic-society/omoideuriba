import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    throw new Error('管理者権限が必要です')
  }
  return user
}

export function isAdmin(role?: string) {
  return role === 'ADMIN'
}
