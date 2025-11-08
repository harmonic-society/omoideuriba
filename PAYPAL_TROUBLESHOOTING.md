# PayPal統合のトラブルシューティングガイド

このドキュメントは、PayPalボタンが機能しない場合の診断と解決方法をまとめたものです。

## 修正された問題

### 1. CartItem の id vs productId の不一致

**問題**:
- `app/checkout/confirm/page.tsx`で`item.id`を`productId`として送信していた
- これにより、バックエンドで商品が見つからず、PayPal注文作成が失敗していた

**修正**:
```typescript
// 修正前
items: checkoutItems.map(item => ({
  productId: item.id,  // ❌ 間違い
  quantity: item.quantity,
  price: item.price,
}))

// 修正後
items: checkoutItems.map(item => ({
  productId: item.productId,  // ✅ 正しい
  quantity: item.quantity,
  price: item.price,
}))
```

**影響したファイル**:
- `app/checkout/confirm/page.tsx` (handleCreateOrder と handleApprove)
- `app/checkout/page.tsx` (在庫確認)

### 2. エラーログの不足

**問題**:
- PayPalボタンがクリックされても、何が失敗しているのかわからなかった
- ユーザーには一般的なエラーメッセージしか表示されなかった

**修正**:
- すべての重要なポイントで詳細なconsole.logを追加
- PayPal SDK初期化状態の確認useEffectを追加
- より詳細なエラーメッセージをユーザーに表示

```typescript
// 追加されたログ
console.log('=== Creating PayPal Order ===')
console.log('Shipping Address:', shippingAddress)
console.log('Checkout Items:', checkoutItems)
console.log('Total:', total)

// PayPal SDK状態の確認
useEffect(() => {
  console.log('PayPal Client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'Set' : 'Not set')
  console.log('Agreed to terms:', agreedToTerms)
  console.log('Processing:', processing)
}, [agreedToTerms, processing])
```

### 3. PayPalボタンの再レンダリング

**問題**:
- 状態変更時にPayPalボタンが適切に更新されない可能性があった

**修正**:
- `forceReRender`プロップを追加して、重要な状態変更時に強制的に再レンダリング

```typescript
<PayPalButtons
  // ... other props
  forceReRender={[agreedToTerms, processing, total]}
/>
```

## デバッグ方法

### 1. ブラウザの開発者ツールを開く

1. ページをリロード
2. F12またはCmd+Option+I (Mac) で開発者ツールを開く
3. Consoleタブを確認

### 2. 確認すべきログ

#### ページ読み込み時:
```
PayPal Client ID: Set
Agreed to terms: false
Processing: false
Checkout items count: X
```

#### PayPalボタンをクリック時:
```
=== Creating PayPal Order ===
Shipping Address: {...}
Checkout Items: [{...}]
Total: XXXX
PayPal order created successfully: ORDER-ID-HERE
```

#### 支払い承認時:
```
=== Approving PayPal Payment ===
PayPal Order ID: ORDER-ID-HERE
Order captured successfully: {...}
```

### 3. よくあるエラーと対処法

#### エラー: "商品が見つかりません"
**原因**: CartItemの`id`と`productId`の混同
**確認方法**:
```javascript
// ブラウザコンソールで実行
console.log(JSON.parse(sessionStorage.getItem('checkoutItems')))
```
各アイテムに`productId`フィールドが存在するか確認

#### エラー: "金額が一致しません"
**原因**:
- カート内の価格が古い
- サーバー側の商品価格が変更された

**対処法**:
1. ページをリロード
2. カートを空にして商品を再度追加
3. 価格に不整合がないか商品ページで確認

#### エラー: "在庫不足の商品があります"
**原因**: 他のユーザーが先に購入した、または在庫設定が誤っている

**対処法**:
1. 商品ページで在庫状況を確認
2. 数量を減らして再試行
3. 管理者に連絡して在庫を確認

#### エラー: "PayPal注文の作成に失敗しました"
**原因**:
- PayPal APIの認証エラー
- 環境変数の設定ミス
- PayPalアカウントの問題

**確認方法**:
```bash
# .envファイルを確認
grep PAYPAL .env

# 必要な変数:
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
# PAYPAL_CLIENT_SECRET=...
# PAYPAL_MODE=sandbox または live
```

**対処法**:
1. PayPal Developer Dashboardで認証情報を確認
2. サーバーログでPayPal APIのレスポンスを確認
3. モードがsandboxの場合、Sandboxアカウントでログインしているか確認

#### PayPalボタンが表示されない
**原因**:
- 利用規約に同意していない
- PayPal Client IDが設定されていない
- PayPal SDKの読み込みエラー

**確認方法**:
1. 利用規約のチェックボックスをオンにする
2. コンソールで`PayPal Client ID: Not set`が表示されていないか確認
3. Networkタブで`https://www.paypal.com/sdk/js`の読み込みを確認

## 環境変数の設定

### 開発環境 (Sandbox)

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
PAYPAL_MODE=sandbox
```

### 本番環境 (Live)

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-live-client-id
PAYPAL_CLIENT_SECRET=your-live-secret
PAYPAL_MODE=live
```

**重要**:
- `NEXT_PUBLIC_`プレフィックスが付いた変数のみブラウザからアクセス可能
- `PAYPAL_CLIENT_SECRET`は**絶対に**ブラウザに露出してはいけない
- 本番環境に移行する前に、必ずsandbox環境で十分にテストする

## テストフロー

### 1. Sandbox環境でのテスト

1. PayPal Developer Dashboardで[Sandbox accounts](https://developer.paypal.com/dashboard/accounts)を開く
2. Personal SandboxアカウントとBusiness Sandboxアカウントを作成
3. `.env`を sandbox モードに設定
4. Personal Sandboxアカウントで商品を購入
5. Business Sandboxアカウントで支払いを確認

### 2. 本番環境への移行

1. すべてのSandboxテストをパス
2. PayPal Business accountを本番モードに切り替え
3. 本番APIキーを取得
4. `.env`を live モードに更新
5. 少額の実テストを実施
6. ユーザー受け入れテストを実施

## 関連ファイル

- `app/checkout/confirm/page.tsx` - PayPalボタンとメインロジック
- `app/checkout/page.tsx` - 配送先入力と在庫確認
- `app/api/paypal/create-order/route.ts` - PayPal注文作成API
- `app/api/paypal/capture-order/route.ts` - PayPal支払いキャプチャAPI
- `lib/paypal.ts` - PayPal SDK設定とヘルパー関数
- `lib/inventory.ts` - 在庫管理関数
- `lib/validations/checkout.ts` - バリデーションスキーマ

## サポートとヘルプ

問題が解決しない場合:

1. 上記のログをすべて収集
2. ブラウザコンソールのスクリーンショットを撮影
3. サーバーログ (`npm run dev`の出力) を確認
4. PayPal Developer Dashboardのwebhookログを確認
5. 開発チームまたはPayPalサポートに連絡

## 更新履歴

- 2025-01-XX: 初版作成 - CartItem id/productId 不一致の修正とデバッグ強化
