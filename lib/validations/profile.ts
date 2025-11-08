import { z } from 'zod'

// 日本の郵便番号形式（XXX-XXXX or XXXXXXX）
const postalCodeRegex = /^\d{3}-?\d{4}$/

// 日本の電話番号形式（ハイフンあり・なし両対応）
const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{4}$/

// パスワードの強度チェック（8文字以上、英数字含む）
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

// プロフィール更新用スキーマ
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(1, '名前を入力してください')
    .min(2, '名前は2文字以上で入力してください')
    .max(50, '名前は50文字以内で入力してください'),

  email: z.string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
    .toLowerCase(),

  phoneNumber: z.string()
    .regex(phoneRegex, '有効な電話番号を入力してください（例: 090-1234-5678）')
    .optional()
    .or(z.literal('')),

  postalCode: z.string()
    .regex(postalCodeRegex, '有効な郵便番号を入力してください（例: 123-4567）')
    .optional()
    .or(z.literal('')),

  prefecture: z.string()
    .optional()
    .or(z.literal('')),

  city: z.string()
    .max(100, '市区町村は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  address: z.string()
    .max(200, '番地は200文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  building: z.string()
    .max(200, '建物名は200文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  image: z.string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
})

// パスワード変更用スキーマ
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, '現在のパスワードを入力してください'),

  newPassword: z.string()
    .min(1, '新しいパスワードを入力してください')
    .min(8, '新しいパスワードは8文字以上で入力してください')
    .regex(passwordRegex, '新しいパスワードは英字と数字を含む8文字以上で入力してください'),

  confirmPassword: z.string()
    .min(1, 'パスワード（確認）を入力してください'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '新しいパスワードが一致しません',
  path: ['confirmPassword'],
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

// 都道府県リスト
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
  '沖縄県'
] as const
