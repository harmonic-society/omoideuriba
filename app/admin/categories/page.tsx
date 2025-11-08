'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
    setError('')

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setFormData({ name: '', slug: '', description: '' })
      setShowForm(false)
      setEditingId(null)
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  const cancelEdit = () => {
    setFormData({ name: '', slug: '', description: '' })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-vintage-brown font-pixel">
          カテゴリ管理
        </h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-retro-pink">
            ➕ 新しいカテゴリを追加
          </button>
        )}
      </div>

      {showForm && (
        <div className="card-retro mb-8">
          <h3 className="text-2xl font-bold text-vintage-brown mb-6">
            {editingId ? 'カテゴリを編集' : '新しいカテゴリ'}
          </h3>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-vintage-brown mb-2">
                カテゴリ名 <span className="text-retro-pink">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                onBlur={!editingId ? generateSlug : undefined}
                className="input-retro"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-vintage-brown mb-2">
                スラッグ <span className="text-retro-pink">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-retro flex-1"
                  pattern="[a-z0-9-]+"
                  required
                />
                <button type="button" onClick={generateSlug} className="btn-retro-blue">
                  自動生成
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-vintage-brown mb-2">
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-retro min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-retro-pink flex-1">
                {editingId ? '更新' : '作成'}
              </button>
              <button type="button" onClick={cancelEdit} className="btn-retro-blue">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-retro">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-vintage-brown text-lg">カテゴリがありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border-2 border-vintage-brown rounded-retro p-4 hover:bg-retro-purple/10 transition-colors">
                <h3 className="text-xl font-bold text-vintage-brown mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-vintage-brown/70 mb-2">
                  /{category.slug}
                </p>
                {category.description && (
                  <p className="text-sm text-vintage-brown mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vintage-brown">
                    商品数: {category._count.products}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 bg-retro-blue text-white rounded-retro font-bold hover:bg-retro-purple transition-colors text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="px-3 py-1 bg-red-500 text-white rounded-retro font-bold hover:bg-red-600 transition-colors text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
