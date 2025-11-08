/**
 * PayPal認証情報をテストするスクリプト
 * 実行方法: npx tsx scripts/test-paypal-auth.ts
 */

import 'dotenv/config'

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET
const mode = process.env.PAYPAL_MODE || 'sandbox'

console.log('=== PayPal認証情報テスト ===\n')
console.log('モード:', mode)
console.log('Client ID 存在:', !!clientId)
console.log('Client ID 長さ:', clientId?.length || 0)
console.log('Client ID 先頭10文字:', clientId?.substring(0, 10) || 'N/A')
console.log('Client Secret 存在:', !!clientSecret)
console.log('Client Secret 長さ:', clientSecret?.length || 0)
console.log('Client Secret 先頭10文字:', clientSecret?.substring(0, 10) || 'N/A')

if (!clientId || !clientSecret) {
  console.error('\n❌ エラー: Client IDまたはClient Secretが設定されていません')
  console.error('以下の環境変数を.envファイルで設定してください:')
  console.error('  NEXT_PUBLIC_PAYPAL_CLIENT_ID=...')
  console.error('  PAYPAL_CLIENT_SECRET=...')
  process.exit(1)
}

const apiBase = mode === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

console.log('\nAPI Base URL:', apiBase)
console.log('\n--- アクセストークン取得テスト ---\n')

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

async function testAuth() {
  try {
    const response = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    console.log('ステータスコード:', response.status)
    console.log('ステータステキスト:', response.statusText)

    const responseText = await response.text()

    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('\n✅ 成功! アクセストークンを取得できました')
      console.log('トークンタイプ:', data.token_type)
      console.log('有効期限:', data.expires_in, '秒')
      console.log('スコープ:', data.scope)
      console.log('アクセストークン (先頭20文字):', data.access_token.substring(0, 20) + '...')
      console.log('\n🎉 PayPal認証情報は正しく設定されています!')
    } else {
      console.error('\n❌ エラーレスポンス:')
      console.error(responseText)

      try {
        const errorData = JSON.parse(responseText)
        console.error('\n詳細:')
        console.error('  エラー:', errorData.error)
        console.error('  説明:', errorData.error_description)

        if (errorData.error === 'invalid_client') {
          console.error('\n💡 解決方法:')
          console.error('  1. PayPal Developer Dashboardで認証情報を確認')
          console.error('  2. モード (sandbox/live) が正しいか確認')
          console.error('  3. Client IDとClient Secretが対応しているか確認')
          console.error(`  4. 現在のモード「${mode}」に対応する認証情報を使用しているか確認`)
        }
      } catch {
        // JSON parsing failed
      }
    }
  } catch (error) {
    console.error('\n❌ 例外が発生しました:')
    console.error(error)
  }
}

testAuth()
