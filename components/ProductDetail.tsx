'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock: number
    imageUrl?: string | null
    images?: string | null
    category: {
      id: string
      name: string
      slug: string
    }
  }
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      imageUrl: product.imageUrl || undefined,
    })

    alert(`${product.name} を${quantity}個カートに追加しました！`)
    setQuantity(1)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-retro-blue hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="text-retro-blue hover:underline">
          商品一覧
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${product.category.slug}`} className="text-retro-blue hover:underline">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-vintage-brown">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 商品画像 */}
        <div className="card-retro">
          <div className="relative w-full h-96 bg-retro-purple/10 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* 商品情報 */}
        <div className="card-retro">
          {/* カテゴリ */}
          <Link href={`/categories/${product.category.slug}`}>
            <span className="tag-retro bg-retro-blue text-white hover:bg-retro-pink transition-colors">
              {product.category.name}
            </span>
          </Link>

          {/* 商品名 */}
          <h1 className="text-4xl font-bold text-vintage-brown mt-4 mb-4 font-pixel">
            {product.name}
          </h1>

          {/* 価格 */}
          <div className="text-5xl font-bold text-retro-pink mb-6">
            ¥{product.price.toLocaleString()}
          </div>

          {/* 在庫 */}
          <div className="mb-6">
            <span className="text-lg text-vintage-brown">
              在庫: <span className="font-bold">{product.stock}</span>個
            </span>
          </div>

          {/* 数量選択 */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-vintage-brown mb-2">
              数量:
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-retro-purple text-white px-4 py-2 rounded-retro font-bold hover:bg-retro-pink transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold text-vintage-brown min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="bg-retro-purple text-white px-4 py-2 rounded-retro font-bold hover:bg-retro-pink transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* カートに追加ボタン */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-retro font-bold text-lg mb-4 transition-all ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-retro-yellow text-vintage-brown shadow-retro hover:shadow-retro-hover hover:-translate-y-1'
            }`}
          >
            {product.stock === 0 ? '在庫切れ' : 'カートに入れる 🛒'}
          </button>

          {/* 商品説明 */}
          <div className="border-t-2 border-vintage-brown pt-6">
            <h2 className="text-2xl font-bold text-vintage-brown mb-3">
              商品説明
            </h2>
            <p className="text-vintage-brown whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
