'use client'

import { useState } from 'react'
import { ShippingAddress, shippingAddressSchema } from '@/lib/validations/checkout'
import { ZodError } from 'zod'

interface ShippingFormProps {
  initialData?: Partial<ShippingAddress>
  onSubmit: (data: ShippingAddress) => void
  loading?: boolean
}

export default function ShippingForm({ initialData, onSubmit, loading }: ShippingFormProps) {
  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    name: initialData?.name || '',
    postalCode: initialData?.postalCode || '',
    prefecture: initialData?.prefecture || '',
    city: initialData?.city || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    phoneNumber: initialData?.phoneNumber || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // フィールドごとのリアルタイムバリデーション
    try {
      const fieldSchema = shippingAddressSchema.shape[name as keyof ShippingAddress]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(prev => ({ ...prev, [name]: err.issues[0]?.message || '' }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = shippingAddressSchema.parse(formData)
      setErrors({})
      onSubmit(validatedData)
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        err.issues.forEach((error: any) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* お名前 */}
      <div>
        <label htmlFor="name" className="block font-bold text-vintage-brown mb-2">
          お名前 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-retro ${errors.name ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* 郵便番号 */}
      <div>
        <label htmlFor="postalCode" className="block font-bold text-vintage-brown mb-2">
          郵便番号 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="123-4567"
          className={`input-retro ${errors.postalCode ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.postalCode && (
          <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
        )}
        <p className="text-xs text-vintage-brown/60 mt-1">
          ハイフンありでもなしでも入力可能です
        </p>
      </div>

      {/* 都道府県 */}
      <div>
        <label htmlFor="prefecture" className="block font-bold text-vintage-brown mb-2">
          都道府県 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          id="prefecture"
          name="prefecture"
          value={formData.prefecture}
          onChange={handleChange}
          placeholder="東京都"
          className={`input-retro ${errors.prefecture ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.prefecture && (
          <p className="text-red-600 text-sm mt-1">{errors.prefecture}</p>
        )}
      </div>

      {/* 市区町村 */}
      <div>
        <label htmlFor="city" className="block font-bold text-vintage-brown mb-2">
          市区町村 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="渋谷区"
          className={`input-retro ${errors.city ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.city && (
          <p className="text-red-600 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* 町名・番地 */}
      <div>
        <label htmlFor="addressLine1" className="block font-bold text-vintage-brown mb-2">
          町名・番地 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="神南1-2-3"
          className={`input-retro ${errors.addressLine1 ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.addressLine1 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* 建物名・部屋番号 */}
      <div>
        <label htmlFor="addressLine2" className="block font-bold text-vintage-brown mb-2">
          建物名・部屋番号（任意）
        </label>
        <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          placeholder="○○マンション 101号室"
          className={`input-retro ${errors.addressLine2 ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.addressLine2 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine2}</p>
        )}
      </div>

      {/* 電話番号 */}
      <div>
        <label htmlFor="phoneNumber" className="block font-bold text-vintage-brown mb-2">
          電話番号 <span className="text-retro-pink">*</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="03-1234-5678 または 090-1234-5678"
          className={`input-retro ${errors.phoneNumber ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {errors.phoneNumber && (
          <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={loading}
        className="btn-retro-pink w-full disabled:opacity-50"
      >
        {loading ? '確認中...' : '注文内容を確認'}
      </button>
    </form>
  )
}
