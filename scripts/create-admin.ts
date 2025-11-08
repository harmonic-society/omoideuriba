import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // 既存ユーザーを確認
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    console.log('既存ユーザー:')
    console.table(users)

    if (users.length === 0) {
      console.log('\nユーザーが存在しません。')
      console.log('先にアプリケーションからサインアップしてください。')
      return
    }

    // 最初のユーザーを管理者に昇格
    const firstUser = users[0]

    if (firstUser.role === 'ADMIN') {
      console.log(`\n${firstUser.email} は既に管理者です。`)
      return
    }

    const updated = await prisma.user.update({
      where: { id: firstUser.id },
      data: { role: 'ADMIN' },
    })

    console.log(`\n✅ ${updated.email} を管理者に昇格しました！`)
    console.log(`これで https://your-domain.com/admin にアクセスできます。`)
  } catch (error) {
    console.error('エラー:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
