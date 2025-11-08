import { z } from 'zod'

// 日本の郵便番号形式（例: 123-4567 または 1234567）
const postalCodeRegex = /^\d{3}-?\d{4}$/

// 日本の電話番号形式（例: 03-1234-5678, 090-1234-5678）
const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{4}$/

// 配送先住所のバリデーション
export const shippingAddressSchema = z.object({
  name: z.string()
    .min(1, '名前を入力してください')
    .max(100, '名前は100文字以内で入力してください'),

  postalCode: z.string()
    .regex(postalCodeRegex, '郵便番号は123-4567の形式で入力してください'),

  prefecture: z.string()
    .min(2, '都道府県を入力してください')
    .max(10, '都道府県は10文字以内で入力してください'),

  city: z.string()
    .min(1, '市区町村を入力してください')
    .max(50, '市区町村は50文字以内で入力してください'),

  addressLine1: z.string()
    .min(1, '町名・番地を入力してください')
    .max(100, '町名・番地は100文字以内で入力してください'),

  addressLine2: z.string()
    .max(100, '建物名・部屋番号は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  phoneNumber: z.string()
    .regex(phoneRegex, '電話番号は03-1234-5678または090-1234-5678の形式で入力してください'),
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

// チェックアウト全体のバリデーション
export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  agreeToTerms: z.boolean()
    .refine(val => val === true, {
      message: '利用規約に同意してください',
    }),
})

export type CheckoutData = z.infer<typeof checkoutSchema>

// 注文アイテムのバリデーション
export const orderItemSchema = z.object({
  productId: z.string().min(1, '商品IDが必要です'),
  quantity: z.number()
    .int('数量は整数である必要があります')
    .min(1, '数量は1以上である必要があります')
    .max(99, '数量は99以下である必要があります'),
  price: z.number()
    .min(0, '価格は0以上である必要があります'),
})

// 注文作成のバリデーション
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'カートに商品が入っていません'),
  shippingAddress: shippingAddressSchema,
  shippingFee: z.number()
    .min(0, '配送料は0以上である必要があります'),
  totalAmount: z.number()
    .min(1, '合計金額は1円以上である必要があります'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

// PayPal注文確定のバリデーション
export const capturePayPalOrderSchema = z.object({
  paypalOrderId: z.string().min(1, 'PayPal注文IDが必要です'),
  orderData: createOrderSchema,
})

export type CapturePayPalOrderInput = z.infer<typeof capturePayPalOrderSchema>
