/**
 * ProductテーブルにisFeaturedフィールドを追加するスクリプト
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Adding isFeatured field to Product table ===\n')

  try {
    console.log('Step 1: Adding isFeatured column...')

    await prisma.$executeRaw`
      ALTER TABLE products
      ADD COLUMN isFeatured BOOLEAN NOT NULL DEFAULT false
    `

    console.log('✅ isFeatured column added\n')

    console.log('Step 2: Adding index on isFeatured...')

    await prisma.$executeRaw`
      CREATE INDEX products_isFeatured_idx ON products(isFeatured)
    `

    console.log('✅ Index added\n')

    console.log('=== Migration completed successfully ===\n')

    const productCount = await prisma.product.count()
    console.log(`✅ Total products: ${productCount}`)

  } catch (error) {
    console.error('\n❌ Error occurred:', error)

    if (error instanceof Error) {
      if (error.message.includes('Duplicate column')) {
        console.log('\n⚠️  Column already exists. Migration may have already run.')
      } else if (error.message.includes('Duplicate key')) {
        console.log('\n⚠️  Index already exists. Migration may have already run.')
      }
    }

    throw error
  }
}

main()
  .then(() => {
    console.log('\n=== Script finished ===')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
