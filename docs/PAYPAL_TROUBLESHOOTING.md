# PayPal支払いトラブルシューティング

## クレジットカード追加エラー

### エラーメッセージ
「申し訳ございませんが、このカードを追加できませんでした。しばらくしてから再度実行するか、別のカードを追加してください。」

### 考えられる原因と対処法

#### 1. PayPalアカウント設定の問題

**原因:**
- 本番環境（Live Mode）で使用している場合、PayPalビジネスアカウントの認証が完了していない
- アカウントの支払い受取設定が有効になっていない

**対処法:**
1. PayPalビジネスアカウントにログイン
2. アカウント設定 → ビジネス情報を確認
3. 必要な認証手続きを完了する（本人確認、銀行口座連携など）
4. 支払い受取設定を有効化

#### 2. サンドボックス vs 本番環境の不一致

**原因:**
- サンドボックス用のClient IDで本番カードを使用している
- または本番用のClient IDでテストカードを使用している

**対処法:**
```env
# テスト環境の場合
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<サンドボックス用ClientID>
PAYPAL_CLIENT_SECRET=<サンドボックス用Secret>

# 本番環境の場合
PAYPAL_MODE=live
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<本番用ClientID>
PAYPAL_CLIENT_SECRET=<本番用Secret>
```

#### 3. 地域・通貨の制限

**原因:**
- PayPalアカウントで日本円（JPY）の取引が有効になっていない
- 特定のカードブランドが有効になっていない

**対処法:**
1. PayPalアカウント設定で通貨設定を確認
2. 複数通貨の取引を有効化
3. 受け入れるカードブランド（VISA、Mastercard、JCBなど）を設定

#### 4. PayPal SDK設定の問題

**原因:**
- SDKで`enableFunding`オプションが正しく設定されていない
- カード支払いが無効化されている

**確認すべき設定:**

**lib/paypal.ts:**
```typescript
export const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'JPY',
  intent: 'capture',
  locale: 'ja_JP',
  components: 'buttons',
  enableFunding: 'card,paypal',  // カードとPayPalを有効化
  disableFunding: '',
}
```

**app/checkout/confirm/page.tsx:**
```typescript
<PayPalScriptProvider
  options={{
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'JPY',
    intent: 'capture',
    locale: 'ja_JP',
    components: 'buttons',
    enableFunding: 'card,paypal',
    disableFunding: '',
  }}
>
```

#### 5. カード自体の問題

**原因:**
- カードの有効期限切れ
- 利用限度額超過
- 国際取引が無効
- 3Dセキュア認証の失敗

**対処法:**
- カード発行会社に連絡して国際取引を有効化
- 別のクレジットカードを試す
- デビットカードの場合は残高を確認

## 推奨されるテストフロー

### 1. サンドボックス環境でのテスト

```bash
# 環境変数を設定
PAYPAL_MODE=sandbox
```

**テスト用カード情報:**
- カード番号: PayPalサンドボックスの個人アカウントで提供されるテストカード
- PayPalテストアカウント: https://developer.paypal.com/dashboard/accounts

### 2. 本番環境への移行前チェックリスト

- [ ] PayPalビジネスアカウントの認証完了
- [ ] 本人確認完了
- [ ] 銀行口座の連携完了
- [ ] 支払い受取設定が有効
- [ ] 日本円（JPY）の取引が有効
- [ ] 受け入れるカードブランドが設定済み
- [ ] 環境変数が本番用に設定済み
- [ ] SSLが有効（HTTPS）

### 3. ログの確認

ブラウザのコンソールとサーバーログで以下を確認：

```javascript
// ブラウザコンソール
=== PayPal Error ===
Error details: ...
Error message: ...

// サーバーログ
=== PayPal Access Token Request ===
API Base: ...
Mode: sandbox/live
Client ID exists: true/false
```

## よくある質問

### Q: サンドボックスでは動くが本番で動かない
A: PayPalビジネスアカウントの認証が完了していない可能性があります。アカウントのステータスを確認してください。

### Q: PayPal残高では支払えるがカードで支払えない
A: PayPalアカウントでカード支払いの受け取りが有効になっていない可能性があります。アカウント設定を確認してください。

### Q: 特定のカードブランドだけエラーになる
A: PayPalアカウント設定で、そのカードブランドが有効になっていない可能性があります。

### Q: 海外発行のカードが使えない
A: PayPalアカウント設定で国際取引が有効になっているか確認してください。

## サポート連絡先

PayPal技術サポート：
- 日本: https://www.paypal.com/jp/smarthelp/contact-us
- Developer Support: https://developer.paypal.com/support/

## 参考資料

- [PayPal Checkout Integration Guide](https://developer.paypal.com/docs/checkout/)
- [PayPal SDK Configuration](https://developer.paypal.com/sdk/js/configuration/)
- [PayPal Funding Sources](https://developer.paypal.com/docs/checkout/funding-sources/)
- [PayPal Error Codes](https://developer.paypal.com/api/rest/reference/orders/v2/errors/)
