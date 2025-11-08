'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Decimal } from '@prisma/client/runtime/library'
import ImageUpload from './ImageUpload'

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name: string
  slug: string
  description: string
  price: number | Decimal
  stock: number
  imageUrl?: string | null
  categoryId: string
  isActive: boolean
  isFeatured: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // カテゴリが存在しない場合の警告
  const noCategoriesError = categories.length === 0

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product ? (typeof product.price === 'number' ? product.price : Number(product.price.toString())) : 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
    categoryId: product?.categoryId || categories[0]?.id || '',
    isActive: product?.isActive !== undefined ? product.isActive : true,
    isFeatured: product?.isFeatured || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '保存に失敗しました')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-retro max-w-3xl">
      {noCategoriesError && (
        <div className="bg-yellow-100 border-2 border-yellow-600 text-yellow-800 px-4 py-3 rounded-retro mb-6">
          <p className="font-bold mb-2">⚠️ カテゴリが存在しません</p>
          <p className="text-sm mb-3">商品を作成するには、まずカテゴリを作成する必要があります。</p>
          <Link
            href="/admin/categories"
            className="inline-block px-4 py-2 bg-retro-blue text-white rounded-retro font-bold hover:bg-retro-purple transition-colors"
          >
            カテゴリ管理ページへ
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 商品名 */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block font-bold text-vintage-brown mb-2">
            商品名 <span className="text-retro-pink">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={!product ? generateSlug : undefined}
            className="input-retro"
            required
          />
        </div>

        {/* スラッグ */}
        <div className="md:col-span-2">
          <label htmlFor="slug" className="block font-bold text-vintage-brown mb-2">
            スラッグ（URL用） <span className="text-retro-pink">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="input-retro flex-1"
              required
              pattern="[a-z0-9-]+"
              title="小文字英数字とハイフンのみ使用できます"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 bg-retro-blue text-white rounded-retro font-bold hover:bg-retro-purple transition-colors"
            >
              自動生成
            </button>
          </div>
        </div>

        {/* 価格 */}
        <div>
          <label htmlFor="price" className="block font-bold text-vintage-brown mb-2">
            価格（円） <span className="text-retro-pink">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-retro"
            min="0"
            step="1"
            required
          />
        </div>

        {/* 在庫 */}
        <div>
          <label htmlFor="stock" className="block font-bold text-vintage-brown mb-2">
            在庫数
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input-retro"
            min="0"
            step="1"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label htmlFor="categoryId" className="block font-bold text-vintage-brown mb-2">
            カテゴリ <span className="text-retro-pink">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="input-retro"
            required
            disabled={noCategoriesError}
          >
            {categories.length === 0 ? (
              <option value="">カテゴリがありません</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          {noCategoriesError && (
            <p className="text-sm text-red-600 mt-1">
              先にカテゴリを作成してください
            </p>
          )}
        </div>

        {/* 公開状態 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 rounded border-2 border-vintage-brown"
          />
          <label htmlFor="isActive" className="font-bold text-vintage-brown">
            公開する
          </label>
        </div>

        {/* おすすめ商品 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-5 h-5 rounded border-2 border-vintage-brown"
          />
          <label htmlFor="isFeatured" className="font-bold text-vintage-brown">
            ⭐ おすすめ商品として表示
          </label>
        </div>

        {/* 画像アップロード */}
        <div className="md:col-span-2">
          <label className="block font-bold text-vintage-brown mb-4">
            商品画像
          </label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
          />
        </div>

        {/* 商品説明 */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block font-bold text-vintage-brown mb-2">
            商品説明 <span className="text-retro-pink">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-retro min-h-[200px]"
            required
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={loading || noCategoriesError}
          className="btn-retro-pink flex-1 disabled:opacity-50"
        >
          {loading ? '保存中...' : (product ? '更新する' : '作成する')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-retro-blue"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
