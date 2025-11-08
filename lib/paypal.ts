/**
 * PayPal SDK初期化オプション
 */
export const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'JPY',
  intent: 'capture',
  locale: 'ja_JP',
}

/**
 * PayPal環境設定
 */
export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  mode: (process.env.PAYPAL_MODE || 'sandbox') as 'sandbox' | 'live',
  apiBase:
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com',
}

/**
 * PayPal APIの認証トークンを取得
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${paypalConfig.clientId}:${paypalConfig.clientSecret}`
  ).toString('base64')

  const response = await fetch(`${paypalConfig.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('PayPalアクセストークンの取得に失敗しました')
  }

  const data = await response.json()
  return data.access_token
}

/**
 * PayPal注文を作成
 */
export async function createPayPalOrder(orderData: {
  amount: number
  items: Array<{
    name: string
    quantity: number
    unit_amount: number
  }>
  shippingFee: number
}) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${paypalConfig.apiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'JPY',
            value: orderData.amount.toString(),
            breakdown: {
              item_total: {
                currency_code: 'JPY',
                value: (orderData.amount - orderData.shippingFee).toString(),
              },
              shipping: {
                currency_code: 'JPY',
                value: orderData.shippingFee.toString(),
              },
            },
          },
          items: orderData.items.map((item) => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: 'JPY',
              value: item.unit_amount.toString(),
            },
          })),
        },
      ],
      application_context: {
        brand_name: '思い出売場',
        locale: 'ja-JP',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('PayPal order creation error:', error)
    throw new Error('PayPal注文の作成に失敗しました')
  }

  const data = await response.json()
  return data
}

/**
 * PayPal注文を確定（支払いをキャプチャ）
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(
    `${paypalConfig.apiBase}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    console.error('PayPal capture error:', error)
    throw new Error('PayPal支払いの確定に失敗しました')
  }

  const data = await response.json()
  return data
}

/**
 * PayPal注文の詳細を取得
 */
export async function getPayPalOrderDetails(orderId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(
    `${paypalConfig.apiBase}/v2/checkout/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('PayPal注文詳細の取得に失敗しました')
  }

  const data = await response.json()
  return data
}
