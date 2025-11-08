# デプロイメントチェックリスト

このドキュメントは、現在のサイトを正常に動作させるために必要な手順をまとめています。

## ⚠️ 緊急: データベースマイグレーション（必須）

**現在のエラー**: `The column omoideuriba-db.orders.totalAmount does not exist in the current database.`

このエラーにより、注文管理機能が動作していません。

### 実行方法

詳細な手順は `DATABASE_MIGRATION_GUIDE.md` を参照してください。

#### 推奨: Renderのシェルから実行

1. Renderダッシュボードにログイン
2. サービスを選択
3. "Shell"タブを開く
4. 以下のコマンドを実行:

```bash
npx prisma migrate deploy
```

これで自動的にマイグレーションが実行されます。

## 🔧 PayPal環境変数の確認（推奨）

**現在のエラー**: `Client Authentication failed (401)`

PayPalの認証情報が正しく設定されていない可能性があります。

### 実行方法

詳細な手順は `PAYPAL_RENDER_FIX.md` を参照してください。

1. [PayPal Developer Dashboard](https://developer.paypal.com/) で認証情報を確認
2. Renderダッシュボード → Environment → Environment Variables
3. 以下の変数を確認・更新:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE` (sandboxまたはlive)
4. **重要**: 値の前後に空白がないか確認
5. 変更後、サービスを再起動

## 🏷️ カテゴリSlugの更新（任意）

カテゴリのURLをより分かりやすくします:
- おもちゃ → `/categories/toy`
- ゲーム → `/categories/game`
- CD・レコード → `/categories/cd-record`
- フィギュア → `/categories/figure`

### 実行方法（最も簡単）

詳細な手順は `UPDATE_CATEGORY_SLUGS.md` を参照してください。

1. 管理者アカウントでログイン
2. ブラウザの開発者ツールを開く (F12 または Cmd+Option+I)
3. Consoleタブを選択
4. 以下のコードを実行:

```javascript
fetch('/api/admin/categories/update-slugs', {
  method: 'POST',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('結果:', data))
```

## 実行優先順位

1. **最優先**: データベースマイグレーション（注文機能が動作しません）
2. **推奨**: PayPal環境変数の確認（決済が動作しません）
3. **任意**: カテゴリSlugの更新（SEO改善）

## 確認方法

### データベースマイグレーション完了の確認

1. Renderでサービスを再起動
2. https://omoideuriba.com/admin/orders にアクセス
3. エラーが出ずに注文一覧が表示されればOK

### PayPal設定完了の確認

1. テスト商品をカートに追加
2. チェックアウトページに進む
3. PayPalボタンをクリック
4. エラーなくPayPalのログイン画面が表示されればOK

### カテゴリSlug更新完了の確認

以下のURLにアクセスして正しくページが表示されるか確認:
- https://omoideuriba.com/categories/toy
- https://omoideuriba.com/categories/game
- https://omoideuriba.com/categories/cd-record
- https://omoideuriba.com/categories/figure

## サポートドキュメント

- `DATABASE_MIGRATION_GUIDE.md` - データベースマイグレーション詳細ガイド
- `PAYPAL_RENDER_FIX.md` - PayPal設定修正ガイド
- `PAYPAL_TROUBLESHOOTING.md` - PayPalトラブルシューティング
- `UPDATE_CATEGORY_SLUGS.md` - カテゴリSlug更新ガイド

## 問題が発生した場合

1. エラーメッセージ全体をコピー
2. Renderのログを確認
3. 上記のサポートドキュメントを参照
4. 必要に応じて開発チームに連絡
