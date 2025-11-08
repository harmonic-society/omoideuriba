import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <h2 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
        新しい商品を追加
      </h2>

      <ProductForm categories={categories} />
    </div>
  )
}
