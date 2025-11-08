# Renderでデータベースマイグレーションを実行

## 🚀 実行コマンド（これだけでOK）

Renderのシェルで以下のコマンドを実行してください：

```bash
npx tsx scripts/migrate-order-schema.ts
```

## 📋 手順

1. **Renderダッシュボードにログイン**
   - https://dashboard.render.com/ にアクセス

2. **サービスを選択**
   - omoideuribaのWebサービスを選択

3. **Shellを開く**
   - 左側のメニューから「Shell」をクリック

4. **コマンドを実行**
   ```bash
   npx tsx scripts/migrate-order-schema.ts
   ```

5. **完了を確認**
   - 以下のような出力が表示されれば成功:
   ```
   === Order Schema Migration ===

   Step 1: 新しいカラムを追加中...
   ✅ 新しいカラムを追加しました

   Step 2: 既存データを移行中...
   ✅ 既存データを移行しました

   Step 3: NOT NULL制約を追加中...
   ✅ NOT NULL制約を追加しました

   === マイグレーション完了 ===
   ✅ すべて完了しました！
   ```

6. **サービスを再起動**
   - Renderダッシュボードで「Manual Deploy」→「Deploy latest commit」

## ✅ 確認方法

マイグレーション後、以下を確認してください：

1. **管理画面の注文管理ページ**
   - https://omoideuriba.com/admin/orders
   - エラーなく表示されればOK

2. **新しい注文の作成**
   - テスト商品をカートに追加
   - チェックアウトを完了
   - 注文が正しく保存されるか確認

## ⚠️ トラブルシューティング

### エラー: "Duplicate column name"

→ マイグレーションは既に実行されています。問題ありません。

### エラー: "cannot be null"

→ 既存データの移行に失敗しています。以下のコマンドで確認:

```bash
npx prisma studio
```

### その他のエラー

エラーメッセージ全体をコピーして開発チームに連絡してください。

## 📝 このスクリプトが行うこと

1. 新しいカラムを追加:
   - `totalAmount` (合計金額)
   - `shippingFee` (送料)
   - `shippingName` (配送先氏名)
   - `shippingPostalCode` (郵便番号)
   - `shippingPrefecture` (都道府県)
   - `shippingCity` (市区町村)
   - `shippingAddressLine1` (町名・番地)
   - `shippingAddressLine2` (建物名・部屋番号)
   - `shippingPhoneNumber` (電話番号)

2. 既存データを移行:
   - `total` → `totalAmount` にコピー
   - `shippingFee` にデフォルト値(500円)を設定

3. NOT NULL制約を追加

4. 古いカラム(`total`, `shippingAddress`)は安全のため残されます

## 🔒 安全性

- このスクリプトは既存データを削除しません
- 古いカラム(`total`, `shippingAddress`)は保持されます
- エラーが発生した場合、途中で停止します

## 次のステップ

マイグレーション完了後:

1. PayPal環境変数の確認 → `PAYPAL_RENDER_FIX.md`
2. カテゴリSlugの更新 → `UPDATE_CATEGORY_SLUGS.md`
