'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock: number
    imageUrl?: string | null
    category: {
      name: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl || undefined,
    })

    // フィードバックを表示（シンプルなalert、後でトーストに変更可能）
    alert(`${product.name} をカートに追加しました！`)
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card-retro h-full flex flex-col">
        {/* 商品画像 */}
        <div className="relative w-full h-48 bg-retro-purple/10 rounded-lg mb-4 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              📦
            </div>
          )}
        </div>

        {/* カテゴリタグ */}
        <div className="mb-2">
          <span className="tag-retro bg-retro-blue text-white">
            {product.category.name}
          </span>
        </div>

        {/* 商品名 */}
        <h3 className="text-xl font-bold text-vintage-brown mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* 商品説明 */}
        <p className="text-sm text-vintage-brown/70 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* 価格と在庫 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-retro-pink">
            ¥{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-vintage-brown">
            在庫: {product.stock}
          </span>
        </div>

        {/* カートに追加ボタン */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-retro font-bold transition-all ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-retro-yellow text-vintage-brown hover:shadow-retro hover:-translate-y-1'
          }`}
        >
          {product.stock === 0 ? '在庫切れ' : 'カートに入れる 🛒'}
        </button>
      </div>
    </Link>
  )
}
