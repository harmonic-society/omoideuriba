# データベースマイグレーション実行ガイド

## 問題

現在、本番データベースのスキーマが古く、以下のエラーが発生しています:

```
The column `omoideuriba-db.orders.totalAmount` does not exist in the current database.
```

## 必要な変更

Orderテーブルに以下のカラムを追加する必要があります:

### 追加するカラム
- `totalAmount` - 合計金額
- `shippingFee` - 送料
- `shippingName` - 配送先氏名
- `shippingPostalCode` - 郵便番号
- `shippingPrefecture` - 都道府県
- `shippingCity` - 市区町村
- `shippingAddressLine1` - 町名・番地
- `shippingAddressLine2` - 建物名・部屋番号
- `shippingPhoneNumber` - 電話番号

### 削除するカラム
- `total` (→ `totalAmount`に変更)
- `shippingAddress` (→ 個別フィールドに分割)

Userテーブル:
- `address` → `addressLine1` (カラム名は変更せず、Prismaの`@map`で対応)
- `building` → `addressLine2` (カラム名は変更せず、Prismaの`@map`で対応)

## 解決方法

### オプション1: 手動でSQLを実行（推奨）

本番データベースに接続して、以下のSQLを実行してください。

#### ステップ1: Orderテーブルを更新

```sql
-- 新しいカラムを追加
ALTER TABLE `orders`
  ADD COLUMN `totalAmount` DECIMAL(10, 2) AFTER `userId`,
  ADD COLUMN `shippingFee` DECIMAL(10, 2) AFTER `totalAmount`,
  ADD COLUMN `shippingName` VARCHAR(191) AFTER `shippingFee`,
  ADD COLUMN `shippingPostalCode` VARCHAR(191) AFTER `shippingName`,
  ADD COLUMN `shippingPrefecture` VARCHAR(191) AFTER `shippingPostalCode`,
  ADD COLUMN `shippingCity` VARCHAR(191) AFTER `shippingPrefecture`,
  ADD COLUMN `shippingAddressLine1` VARCHAR(191) AFTER `shippingCity`,
  ADD COLUMN `shippingAddressLine2` VARCHAR(191) AFTER `shippingAddressLine1`,
  ADD COLUMN `shippingPhoneNumber` VARCHAR(191) AFTER `shippingAddressLine2`;

-- 既存データがあれば、totalからtotalAmountへデータをコピー
UPDATE `orders`
SET
  `totalAmount` = `total`,
  `shippingFee` = 0  -- デフォルト値
WHERE `totalAmount` IS NULL;

-- shippingAddressからデータを抽出（既存注文がある場合のみ必要）
-- 注意: これは例です。実際のJSONデータ構造に応じて調整してください
-- UPDATE `orders`
-- SET
--   `shippingName` = JSON_UNQUOTE(JSON_EXTRACT(`shippingAddress`, '$.name')),
--   `shippingPostalCode` = JSON_UNQUOTE(JSON_EXTRACT(`shippingAddress`, '$.postalCode')),
--   ...
-- WHERE `shippingName` IS NULL;

-- 古いカラムを削除（データ移行後）
-- 注意: 既存の注文データがある場合は、慎重に確認してから実行してください
-- ALTER TABLE `orders` DROP COLUMN `total`;
-- ALTER TABLE `orders` DROP COLUMN `shippingAddress`;
```

#### ステップ2: 新しいカラムにNOT NULL制約を追加（データ移行後）

```sql
-- すべての既存データが新しいカラムに移行されたことを確認した後
ALTER TABLE `orders`
  MODIFY `totalAmount` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingFee` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingName` VARCHAR(191) NOT NULL,
  MODIFY `shippingPostalCode` VARCHAR(191) NOT NULL,
  MODIFY `shippingPrefecture` VARCHAR(191) NOT NULL,
  MODIFY `shippingCity` VARCHAR(191) NOT NULL,
  MODIFY `shippingAddressLine1` VARCHAR(191) NOT NULL,
  MODIFY `shippingPhoneNumber` VARCHAR(191) NOT NULL;
```

### オプション2: Prisma Migrateを使用

**注意**: この方法は既存データがない、またはテスト環境でのみ推奨されます。

#### RDSに接続できる環境から実行

1. ローカルの`.env`ファイルを一時的に本番データベースURLに変更:

```env
DATABASE_URL="mysql://username:password@omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com:3306/omoideuriba-db"
```

2. マイグレーションを作成:

```bash
npx prisma migrate dev --name restructure_order_model
```

3. 本番環境で実行:

```bash
npx prisma migrate deploy
```

#### Renderのシェルから実行

Renderダッシュボードで:

1. サービスを選択
2. "Shell"タブを開く
3. 以下のコマンドを実行:

```bash
npx prisma migrate deploy
```

## マイグレーション実行前の確認事項

### 1. バックアップを取る

**重要**: マイグレーション実行前に必ずデータベースのバックアップを取ってください。

AWS RDSの場合:
1. RDSコンソールを開く
2. データベースインスタンスを選択
3. "Actions" → "Take snapshot"
4. スナップショット名を入力して作成

### 2. 既存の注文データを確認

```sql
SELECT COUNT(*) FROM `orders`;
```

注文データが存在する場合、データ移行スクリプトが必要です。

### 3. ダウンタイムの計画

マイグレーション中はサイトを一時的にメンテナンスモードにすることを推奨します。

## トラブルシューティング

### エラー: "Duplicate column name 'totalAmount'"

カラムが既に存在する場合、このエラーが発生します。

確認:
```sql
DESCRIBE `orders`;
```

解決: 既にカラムが存在する場合、ADD COLUMNステートメントをスキップしてください。

### エラー: "Column 'totalAmount' cannot be null"

NOT NULL制約を追加する前に、すべての行にデータが入っているか確認してください。

```sql
SELECT COUNT(*) FROM `orders` WHERE `totalAmount` IS NULL;
```

### データ移行が必要な場合

既存の注文データがある場合:

1. まず新しいカラムをNULL許可で追加
2. データ移行スクリプトを実行
3. すべてのデータが移行されたことを確認
4. NOT NULL制約を追加
5. 古いカラムを削除

## マイグレーション後の確認

### 1. スキーマを確認

```sql
DESCRIBE `orders`;
```

すべての新しいカラムが存在することを確認。

### 2. アプリケーションをテスト

1. Renderでサービスを再起動
2. 管理画面の注文管理ページにアクセス
3. エラーが出ないことを確認

### 3. 新しい注文を作成してテスト

チェックアウトフローを通して、新しい注文が正しく作成されることを確認。

## 現在のスキーマ状態

### Prismaスキーマ（コード）

```prisma
model Order {
  id                    String      @id @default(cuid())
  userId                String
  paypalOrderId         String?     @unique

  // 金額情報
  totalAmount           Decimal     @db.Decimal(10, 2)
  shippingFee           Decimal     @db.Decimal(10, 2)

  // 配送先情報
  shippingName          String
  shippingPostalCode    String
  shippingPrefecture    String
  shippingCity          String
  shippingAddressLine1  String
  shippingAddressLine2  String?
  shippingPhoneNumber   String

  status                OrderStatus @default(PENDING)
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt

  user                  User        @relation(fields: [userId], references: [id])
  items                 OrderItem[]

  @@index([userId])
  @@index([status])
  @@map("orders")
}
```

### データベーススキーマ（現在）

古い形式:
- `total` (Decimal)
- `shippingAddress` (Text/JSON)

### データベーススキーマ（期待される）

新しい形式:
- `totalAmount` (Decimal)
- `shippingFee` (Decimal)
- `shippingName` (String)
- `shippingPostalCode` (String)
- `shippingPrefecture` (String)
- `shippingCity` (String)
- `shippingAddressLine1` (String)
- `shippingAddressLine2` (String, nullable)
- `shippingPhoneNumber` (String)

## サポート

問題が発生した場合:

1. エラーメッセージ全体をコピー
2. 実行したSQLコマンド
3. データベースの現在の状態（`DESCRIBE orders`の結果）
4. 開発チームに連絡

## 注意事項

- **本番環境でのマイグレーションは慎重に行ってください**
- **必ずバックアップを取ってから実行してください**
- **既存の注文データがある場合は、データ移行計画を立ててください**
- **マイグレーション中はサイトをメンテナンスモードにすることを推奨します**
