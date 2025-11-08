'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrderStatusFormProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'PENDING', label: '保留中', color: 'bg-yellow-500' },
  { value: 'PROCESSING', label: '処理中', color: 'bg-blue-500' },
  { value: 'SHIPPED', label: '発送済み', color: 'bg-purple-500' },
  { value: 'DELIVERED', label: '配達完了', color: 'bg-green-500' },
  { value: 'CANCELLED', label: 'キャンセル', color: 'bg-red-500' },
]

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === currentStatus) {
      setError('ステータスが変更されていません')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'ステータス更新に失敗しました')
      }

      setSuccess('ステータスを更新しました')
      router.refresh()
    } catch (err) {
      console.error('Status update error:', err)
      setError(err instanceof Error ? err.message : 'ステータス更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-3 py-2 rounded-retro text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-2 border-green-500 text-green-700 px-3 py-2 rounded-retro text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-vintage-brown font-bold mb-2">
          ステータス
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
          className="input-retro w-full"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="btn-retro-blue w-full disabled:opacity-50"
      >
        {loading ? '更新中...' : 'ステータスを更新'}
      </button>

      {/* ステータスガイド */}
      <div className="mt-4 p-3 bg-vintage-cream rounded-retro border-2 border-vintage-brown/20">
        <p className="text-xs font-bold text-vintage-brown mb-2">
          ステータスガイド
        </p>
        <div className="space-y-1 text-xs text-vintage-brown/70">
          <p>• <strong>保留中</strong>: 支払い確認待ち</p>
          <p>• <strong>処理中</strong>: 商品準備中</p>
          <p>• <strong>発送済み</strong>: 配送業者に引き渡し済み</p>
          <p>• <strong>配達完了</strong>: 顧客に配達済み</p>
          <p>• <strong>キャンセル</strong>: 注文キャンセル</p>
        </div>
      </div>
    </form>
  )
}
