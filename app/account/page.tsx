'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { profileUpdateSchema, passwordChangeSchema, PREFECTURES, type ProfileUpdateInput, type PasswordChangeInput } from '@/lib/validations/profile'
import { ZodError } from 'zod'

interface UserProfile {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  postalCode: string | null
  prefecture: string | null
  city: string | null
  address: string | null
  building: string | null
  image: string | null
  role: string
  createdAt: string
}

export default function AccountPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // プロフィールフォーム
  const [profileData, setProfileData] = useState<Partial<ProfileUpdateInput>>({
    name: '',
    email: '',
    phoneNumber: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    image: '',
  })
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')

  // パスワードフォーム
  const [passwordData, setPasswordData] = useState<Partial<PasswordChangeInput>>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // 認証チェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // プロフィール読み込み
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) throw new Error('プロフィール取得に失敗しました')

      const data = await res.json()
      setProfile(data)
      setProfileData({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        postalCode: data.postalCode || '',
        prefecture: data.prefecture || '',
        city: data.city || '',
        address: data.address || '',
        building: data.building || '',
        image: data.image || '',
      })
    } catch (err) {
      setProfileErrors({ general: 'プロフィール取得に失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    setProfileSuccess('')
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileErrors({})
    setProfileSuccess('')

    try {
      const validatedData = profileUpdateSchema.parse(profileData)
      setProfileSaving(true)

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.field) {
          setProfileErrors({ [data.field]: data.error })
        } else {
          setProfileErrors({ general: data.error || '更新に失敗しました' })
        }
        return
      }

      setProfileSuccess('プロフィールを更新しました')
      fetchProfile()
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setProfileErrors(fieldErrors)
      } else {
        setProfileErrors({ general: '更新に失敗しました' })
      }
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    setPasswordSuccess('')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})
    setPasswordSuccess('')

    try {
      const validatedData = passwordChangeSchema.parse(passwordData)
      setPasswordSaving(true)

      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.field) {
          setPasswordErrors({ [data.field]: data.error })
        } else {
          setPasswordErrors({ general: data.error || 'パスワード変更に失敗しました' })
        }
        return
      }

      setPasswordSuccess('パスワードを変更しました')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setPasswordErrors(fieldErrors)
      } else {
        setPasswordErrors({ general: 'パスワード変更に失敗しました' })
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">読み込み中...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
              アカウント設定
            </h1>

            {/* プロフィール情報 */}
            <div className="card-retro mb-8">
              <h2 className="text-2xl font-bold text-vintage-brown mb-6">基本情報</h2>

              {profileSuccess && (
                <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-retro mb-4">
                  {profileSuccess}
                </div>
              )}

              {profileErrors.general && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
                  {profileErrors.general}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block font-bold text-vintage-brown mb-2">
                      お名前 <span className="text-retro-pink">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={`input-retro ${profileErrors.name ? 'border-red-500' : ''}`}
                      required
                    />
                    {profileErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block font-bold text-vintage-brown mb-2">
                      メールアドレス <span className="text-retro-pink">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`input-retro ${profileErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phoneNumber" className="block font-bold text-vintage-brown mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className={`input-retro ${profileErrors.phoneNumber ? 'border-red-500' : ''}`}
                      placeholder="090-1234-5678"
                    />
                    {profileErrors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="border-t-2 border-vintage-brown pt-6">
                  <h3 className="text-xl font-bold text-vintage-brown mb-4">配送先住所</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="postalCode" className="block font-bold text-vintage-brown mb-2">
                          郵便番号
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={profileData.postalCode}
                          onChange={handleProfileChange}
                          className={`input-retro ${profileErrors.postalCode ? 'border-red-500' : ''}`}
                          placeholder="123-4567"
                        />
                        {profileErrors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{profileErrors.postalCode}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="prefecture" className="block font-bold text-vintage-brown mb-2">
                          都道府県
                        </label>
                        <select
                          id="prefecture"
                          name="prefecture"
                          value={profileData.prefecture}
                          onChange={handleProfileChange}
                          className={`input-retro ${profileErrors.prefecture ? 'border-red-500' : ''}`}
                        >
                          <option value="">選択してください</option>
                          {PREFECTURES.map((pref) => (
                            <option key={pref} value={pref}>
                              {pref}
                            </option>
                          ))}
                        </select>
                        {profileErrors.prefecture && (
                          <p className="text-red-500 text-sm mt-1">{profileErrors.prefecture}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block font-bold text-vintage-brown mb-2">
                        市区町村
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className={`input-retro ${profileErrors.city ? 'border-red-500' : ''}`}
                        placeholder="渋谷区"
                      />
                      {profileErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{profileErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block font-bold text-vintage-brown mb-2">
                        番地
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className={`input-retro ${profileErrors.address ? 'border-red-500' : ''}`}
                        placeholder="神南1-2-3"
                      />
                      {profileErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{profileErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="building" className="block font-bold text-vintage-brown mb-2">
                        建物名・部屋番号
                      </label>
                      <input
                        type="text"
                        id="building"
                        name="building"
                        value={profileData.building}
                        onChange={handleProfileChange}
                        className={`input-retro ${profileErrors.building ? 'border-red-500' : ''}`}
                        placeholder="レトロマンション101"
                      />
                      {profileErrors.building && (
                        <p className="text-red-500 text-sm mt-1">{profileErrors.building}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="w-full btn-retro-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? '保存中...' : 'プロフィールを保存'}
                </button>
              </form>
            </div>

            {/* パスワード変更 */}
            <div className="card-retro">
              <h2 className="text-2xl font-bold text-vintage-brown mb-6">パスワード変更</h2>

              {passwordSuccess && (
                <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-retro mb-4">
                  {passwordSuccess}
                </div>
              )}

              {passwordErrors.general && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
                  {passwordErrors.general}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block font-bold text-vintage-brown mb-2">
                    現在のパスワード <span className="text-retro-pink">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`input-retro ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block font-bold text-vintage-brown mb-2">
                    新しいパスワード <span className="text-retro-pink">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`input-retro ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    placeholder="英字と数字を含む8文字以上"
                    required
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-bold text-vintage-brown mb-2">
                    新しいパスワード（確認） <span className="text-retro-pink">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`input-retro ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full btn-retro-pink disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? '変更中...' : 'パスワードを変更'}
                </button>
              </form>

              <div className="mt-4 p-4 bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro">
                <p className="text-sm text-vintage-brown">
                  <strong>⚠️ セキュリティのヒント:</strong><br />
                  パスワードは定期的に変更し、他のサービスとは異なるものを使用してください。
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
