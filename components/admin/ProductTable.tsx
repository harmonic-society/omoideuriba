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
    <div className="card-retro overflow-x-auto">
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
  )
}
