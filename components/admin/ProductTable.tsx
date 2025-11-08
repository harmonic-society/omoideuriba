'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Decimal } from '@prisma/client/runtime/library'

interface Product {
  id: string
  name: string
  slug: string
  price: number | Decimal
  stock: number
  isActive: boolean
  category: {
    name: string
  }
}

export default function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) {
      return
    }

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('削除に失敗しました')
      }

      router.refresh()
    } catch (error) {
      alert('商品の削除に失敗しました')
      console.error(error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      {/* デスクトップ: テーブル表示 */}
      <div className="hidden md:block card-retro overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-vintage-brown">
              <th className="text-left p-4 font-bold text-vintage-brown">商品名</th>
              <th className="text-left p-4 font-bold text-vintage-brown">カテゴリ</th>
              <th className="text-right p-4 font-bold text-vintage-brown">価格</th>
              <th className="text-right p-4 font-bold text-vintage-brown">在庫</th>
              <th className="text-center p-4 font-bold text-vintage-brown">状態</th>
              <th className="text-center p-4 font-bold text-vintage-brown">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const price = typeof product.price === 'number'
                ? product.price
                : Number(product.price.toString())

              return (
                <tr key={product.id} className="border-b border-vintage-brown/20 hover:bg-retro-purple/10">
                  <td className="p-4">
                    <div className="font-bold text-vintage-brown">{product.name}</div>
                    <div className="text-sm text-vintage-brown/70">{product.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="tag-retro bg-retro-blue text-white">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-retro-pink">
                    ¥{price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-vintage-brown">
                    {product.stock}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`tag-retro ${
                      product.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {product.isActive ? '公開中' : '非公開'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="px-3 py-1 bg-retro-blue text-white rounded-retro font-bold hover:bg-retro-purple transition-colors text-sm"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="px-3 py-1 bg-red-500 text-white rounded-retro font-bold hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                      >
                        {deleting === product.id ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* モバイル: カード表示 */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const price = typeof product.price === 'number'
            ? product.price
            : Number(product.price.toString())

          return (
            <div key={product.id} className="card-retro p-4">
              {/* ヘッダー: 商品名 + 状態 */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-vintage-brown text-lg mb-1 break-words">
                    {product.name}
                  </h3>
                  <p className="text-sm text-vintage-brown/70 truncate">
                    {product.slug}
                  </p>
                </div>
                <span className={`tag-retro flex-shrink-0 ${
                  product.isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {product.isActive ? '公開' : '非公開'}
                </span>
              </div>

              {/* 詳細情報 */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <span className="text-vintage-brown/70 block mb-1">カテゴリ</span>
                  <span className="tag-retro bg-retro-blue text-white inline-block">
                    {product.category.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-vintage-brown/70 block mb-1">在庫</span>
                  <span className="text-vintage-brown font-bold">{product.stock}個</span>
                </div>
              </div>

              {/* 価格 */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-retro-pink">
                  ¥{price.toLocaleString()}
                </span>
              </div>

              {/* アクション */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 text-center px-4 py-3 bg-retro-blue text-white rounded-retro font-bold hover:bg-retro-purple active:bg-retro-purple/80 transition-colors min-h-[44px] flex items-center justify-center"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleting === product.id}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-retro font-bold hover:bg-red-600 active:bg-red-600/80 transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  {deleting === product.id ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
