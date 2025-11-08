import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Contact Table Migration ===')

  try {
    // Create Contact table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        subject VARCHAR(191) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('UNREAD', 'READ', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'UNREAD',
        adminNote TEXT,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX contacts_status_idx(status),
        INDEX contacts_createdAt_idx(createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `
    console.log('✅ Contact table created')

    // Verify table
    const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM contacts
    `
    console.log('✅ Table verification successful')
    console.log(`   Total contacts: ${result[0].count}`)

    console.log('\n=== Migration completed successfully ===')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
