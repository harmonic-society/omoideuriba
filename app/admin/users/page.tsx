'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  _count: {
    orders: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('ユーザー取得に失敗しました')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    if (!confirm(`このユーザーのロールを${newRole === 'ADMIN' ? '管理者' : '一般ユーザー'}に変更しますか？`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新に失敗しました')
    }
  }

  if (loading) {
    return <div className="text-center py-12">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-vintage-brown font-pixel">
          ユーザー管理
        </h2>
      </div>

      <div className="card-retro">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-vintage-brown">
                <th className="text-left p-4 font-bold text-vintage-brown">名前</th>
                <th className="text-left p-4 font-bold text-vintage-brown">メールアドレス</th>
                <th className="text-left p-4 font-bold text-vintage-brown">ロール</th>
                <th className="text-left p-4 font-bold text-vintage-brown">注文数</th>
                <th className="text-left p-4 font-bold text-vintage-brown">登録日</th>
                <th className="text-left p-4 font-bold text-vintage-brown">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-vintage-brown/20 hover:bg-retro-purple/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-retro-purple text-white flex items-center justify-center font-bold border-2 border-vintage-brown">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <span className="font-bold text-vintage-brown">
                        {user.name || '未設定'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-vintage-brown">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        user.role === 'ADMIN'
                          ? 'bg-retro-pink text-white'
                          : 'bg-retro-blue text-white'
                      }`}
                    >
                      {user.role === 'ADMIN' ? '管理者' : '一般'}
                    </span>
                  </td>
                  <td className="p-4 text-vintage-brown">{user._count.orders}件</td>
                  <td className="p-4 text-vintage-brown">
                    {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
                      className="input-retro text-sm"
                    >
                      <option value="USER">一般ユーザー</option>
                      <option value="ADMIN">管理者</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-vintage-brown text-lg">ユーザーがいません</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro">
        <h3 className="font-bold text-vintage-brown mb-2">📝 注意事項</h3>
        <ul className="text-sm text-vintage-brown space-y-1 list-disc list-inside">
          <li>管理者は管理画面にアクセスできます</li>
          <li>一般ユーザーは商品の購入のみ可能です</li>
          <li>自分自身のロールを変更する際は注意してください</li>
        </ul>
      </div>
    </div>
  )
}
