'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { Decimal } from '@prisma/client/runtime/library'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number | Decimal
    stock: number
    imageUrl?: string | null
    category: {
      name: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  // Decimal型をnumberに変換
  const price = typeof product.price === 'number'
    ? product.price
    : Number(product.price.toString())

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl || undefined,
    })

    // フィードバックを表示（シンプルなalert、後でトーストに変更可能）
    alert(`${product.name} をカートに追加しました！`)
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card-retro h-full flex flex-col hover:shadow-retro-hover transition-all hover:-translate-y-1">
        {/* 商品画像 */}
        <div className="relative w-full h-40 md:h-48 bg-retro-purple/10 rounded-lg mb-3 md:mb-4 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
              📦
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                売り切れ
              </span>
            </div>
          )}
        </div>

        {/* カテゴリタグ */}
        <div className="mb-2">
          <span className="tag-retro bg-retro-blue text-white text-xs md:text-sm">
            {product.category.name}
          </span>
        </div>

        {/* 商品名 */}
        <h3 className="text-base md:text-xl font-bold text-vintage-brown mb-2 line-clamp-2 min-h-[3rem] md:min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* 商品説明 */}
        <p className="text-xs md:text-sm text-vintage-brown/70 mb-3 md:mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* 価格と在庫 */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span className="text-xl md:text-2xl font-bold text-retro-pink">
            ¥{price.toLocaleString()}
          </span>
          <span className="text-xs md:text-sm text-vintage-brown">
            在庫: {product.stock}
          </span>
        </div>

        {/* カートに追加ボタン */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 md:py-2.5 rounded-retro font-bold transition-all text-sm md:text-base ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-retro-yellow text-vintage-brown hover:shadow-retro active:scale-95'
          }`}
        >
          {product.stock === 0 ? '在庫切れ' : <><span className="hidden sm:inline">カートに入れる </span>🛒</>}
        </button>
      </div>
    </Link>
  )
}
