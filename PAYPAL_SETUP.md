# PayPal決済統合ガイド

## 必要な情報・準備

### 1. PayPalビジネスアカウント

#### アカウント作成
1. **PayPal Business**: https://www.paypal.com/jp/business にアクセス
2. 「ビジネスアカウントを開設」をクリック
3. 必要情報を入力：
   - 事業者名（屋号）
   - メールアドレス
   - パスワード
   - 事業の種類
   - 事業内容

#### 本人確認
- 事業者情報の登録
- 銀行口座の登録
- 本人確認書類の提出（運転免許証、マイナンバーカードなど）

### 2. PayPal Developer アカウント

#### 開発者ダッシュボード
1. https://developer.paypal.com/ にアクセス
2. PayPalアカウントでログイン
3. 「Dashboard」にアクセス

#### Sandboxアカウント（テスト用）
開発者ダッシュボードで自動的に以下が作成されます：
- テスト用のビジネスアカウント
- テスト用の購入者アカウント
- これらを使って本番前にテスト可能

### 3. API認証情報の取得

#### REST API認証情報

**本番環境（Live）:**
1. Developer Dashboard → My Apps & Credentials
2. 「Live」タブを選択
3. 「Create App」をクリック
4. アプリ名を入力（例: "Omoideuriba Production"）
5. App Type: "Merchant" を選択
6. 作成後、以下の情報を取得：
   - **Client ID**: `AXXXxxx...`（公開可能）
   - **Secret**: `EXXXxxx...`（秘密情報）

**テスト環境（Sandbox）:**
1. 「Sandbox」タブを選択
2. 同様にアプリを作成
3. テスト用のClient IDとSecretを取得

### 4. 環境変数設定

`.env`ファイルに追加：

```env
# PayPal設定
# Sandbox（開発環境）
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_MODE=sandbox

# Live（本番環境）
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
# PAYPAL_CLIENT_SECRET=your_live_client_secret
# PAYPAL_MODE=live
```

**重要**:
- `NEXT_PUBLIC_`プレフィックスはブラウザに公開される
- Client IDは公開されても問題ない
- Secretは絶対に公開しない（サーバーサイドのみで使用）

### 5. Webhook設定（オプションだが推奨）

#### Webhookとは
PayPalから注文ステータスの変更（支払い完了、返金など）を通知してもらう仕組み

#### 設定手順
1. Developer Dashboard → My Apps & Credentials
2. 作成したアプリを選択
3. 「Add Webhook」をクリック
4. Webhook URL: `https://your-domain.com/api/webhooks/paypal`
5. イベントを選択：
   - `PAYMENT.CAPTURE.COMPLETED` - 支払い完了
   - `PAYMENT.CAPTURE.DENIED` - 支払い拒否
   - `PAYMENT.CAPTURE.REFUNDED` - 返金

6. Webhook IDとSecretを取得

`.env`に追加：
```env
PAYPAL_WEBHOOK_ID=your_webhook_id
PAYPAL_WEBHOOK_SECRET=your_webhook_secret
```

---

## PayPal統合の実装方法

### オプション1: PayPal JavaScript SDK（推奨・簡単）

#### メリット
- 実装が簡単
- PayPalボタンを自動レンダリング
- セキュアな決済フロー
- モバイル対応
- 日本語対応

#### インストール
```bash
npm install @paypal/react-paypal-js
```

#### 基本的な使い方
```typescript
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "JPY",
  intent: "capture",
  locale: "ja_JP", // 日本語表示
};

export default function CheckoutPage() {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={async () => {
          // サーバーサイドで注文を作成
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            body: JSON.stringify({ cartItems }),
          });
          const data = await res.json();
          return data.orderId; // PayPal Order ID
        }}
        onApprove={async (data) => {
          // 支払い完了後の処理
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            body: JSON.stringify({ orderId: data.orderID }),
          });
          // 注文完了ページへリダイレクト
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          // エラー処理
        }}
      />
    </PayPalScriptProvider>
  );
}
```

### オプション2: REST API直接利用（高度）

サーバーサイドで完全に制御したい場合

```bash
npm install @paypal/checkout-server-sdk
```

---

## 決済フロー

### 1. 注文作成（Create Order）
```
ユーザーが「PayPalで支払う」ボタンをクリック
  ↓
サーバーAPI (/api/paypal/create-order)
  ↓
PayPal APIに注文情報を送信
  - 商品情報
  - 金額
  - 配送先
  ↓
PayPal Order IDを取得
  ↓
フロントエンドにOrder IDを返す
```

### 2. PayPal決済画面
```
PayPal SDKがポップアップを表示
  ↓
ユーザーがPayPalにログイン
  ↓
支払い方法を選択
  - PayPal残高
  - クレジットカード
  - 銀行口座
  ↓
支払いを承認
```

### 3. 支払い確定（Capture Order）
```
PayPalから承認通知
  ↓
サーバーAPI (/api/paypal/capture-order)
  ↓
PayPal APIで支払いを確定
  ↓
データベースに注文を保存
  ↓
在庫を減算
  ↓
確認メール送信
  ↓
注文完了ページを表示
```

---

## 料金・手数料

### PayPal手数料（日本国内取引）
- **3.6% + 40円**（1件あたり）
- 月間売上30万円以上で手数料率が下がるプランあり

例：
- 商品価格: 5,000円
- PayPal手数料: 5,000 × 3.6% + 40 = 220円
- 入金額: 4,780円

### 注意点
- 手数料は販売者（あなた）が負担
- 顧客からは商品価格のみ請求
- 手数料を商品価格に含めるか、別途考慮する必要あり

---

## テスト方法

### Sandboxアカウントでテスト

1. **テストビジネスアカウント**（Developer Dashboardで確認）
   - メール: `sb-xxxxx@business.example.com`
   - パスワード: 自動生成

2. **テスト購入者アカウント**
   - メール: `sb-yyyyy@personal.example.com`
   - パスワード: 自動生成

3. **テスト手順**
   ```
   - PAYPAL_MODE=sandbox に設定
   - アプリで商品をカートに追加
   - チェックアウトでPayPalボタンをクリック
   - テスト購入者アカウントでログイン
   - 支払いを完了
   - 正しく注文が作成されるか確認
   ```

4. **テスト用クレジットカード情報**
   PayPal Sandboxでは実在のカード情報は不要
   - Developer Dashboardのテストアカウント詳細に記載

---

## セキュリティ対策

### 1. 金額検証（重要）
```typescript
// サーバーサイドで必ず金額を再計算
const calculatedTotal = cartItems.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0) + shippingFee;

// クライアントから送信された金額は信用しない
if (clientTotal !== calculatedTotal) {
  throw new Error('金額が一致しません');
}
```

### 2. Order ID検証
```typescript
// PayPalから返されたOrder IDが自分のものか確認
const order = await prisma.order.findUnique({
  where: { paypalOrderId: orderId }
});

if (!order || order.userId !== session.user.id) {
  throw new Error('不正な注文ID');
}
```

### 3. Webhook署名検証
```typescript
// Webhookが本当にPayPalから送信されたか検証
import { validateWebhookSignature } from '@paypal/checkout-server-sdk';

const isValid = validateWebhookSignature(
  webhookId,
  event,
  headers
);

if (!isValid) {
  throw new Error('無効なWebhook');
}
```

---

## 本番環境への移行

### チェックリスト

- [ ] PayPalビジネスアカウントが承認済み
- [ ] 本人確認完了
- [ ] 銀行口座登録完了
- [ ] Live環境のClient ID/Secret取得
- [ ] 環境変数を本番用に更新
- [ ] `PAYPAL_MODE=live` に変更
- [ ] Sandboxでの十分なテスト完了
- [ ] エラーハンドリング実装
- [ ] Webhook設定（本番URL）
- [ ] 返金・キャンセルフローのテスト

### 段階的移行
1. まずSandboxで完全にテスト
2. 社内テスト購入（少額）
3. ベータユーザーでテスト
4. 本番リリース

---

## トラブルシューティング

### よくあるエラー

#### 1. "INVALID_CLIENT_CREDENTIALS"
**原因**: Client IDまたはSecretが間違っている
**解決**: 環境変数を確認、Sandbox/Liveの設定確認

#### 2. "CURRENCY_NOT_SUPPORTED"
**原因**: 対応していない通貨コード
**解決**: `currency: "JPY"` を確認（日本円）

#### 3. "AMOUNT_MISMATCH"
**原因**: 注文作成時と確定時で金額が異なる
**解決**: サーバーサイドで金額を一貫して計算

#### 4. Webhookが受信されない
**原因**: URLが間違っている、HTTPSでない
**解決**: 本番環境はHTTPS必須、ngrokでローカルテスト可能

---

## 参考リンク

- **PayPal Developer**: https://developer.paypal.com/
- **React PayPal JS SDK**: https://github.com/paypal/react-paypal-js
- **API リファレンス**: https://developer.paypal.com/api/rest/
- **Sandbox テスト**: https://developer.paypal.com/dashboard/
- **日本語ガイド**: https://www.paypal.com/jp/webapps/mpp/merchant

---

## 次のステップ

1. PayPalビジネスアカウントを作成
2. Developer Dashboardでアプリを作成
3. Client IDとSecretを`.env`に設定
4. `@paypal/react-paypal-js`をインストール
5. 実装開始

必要な情報が揃ったら、実装を開始できます！
