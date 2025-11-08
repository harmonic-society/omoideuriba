'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上にしてください')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登録に失敗しました')
        return
      }

      // 登録成功後、ログインページへリダイレクト
      router.push('/auth/signin?registered=true')
    } catch (err) {
      setError('登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="card-retro">
              <h1 className="text-4xl font-bold text-vintage-brown mb-6 font-pixel text-center">
                新規登録
              </h1>

              {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-bold text-vintage-brown mb-2">
                    お名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-retro"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-bold text-vintage-brown mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-retro"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block font-bold text-vintage-brown mb-2">
                    パスワード（6文字以上）
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-retro"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-bold text-vintage-brown mb-2">
                    パスワード（確認）
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-retro"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-retro-pink text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '登録中...' : '登録する'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-vintage-brown">
                  既にアカウントをお持ちの方は{' '}
                  <Link href="/auth/signin" className="text-retro-pink hover:underline font-bold">
                    ログイン
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
