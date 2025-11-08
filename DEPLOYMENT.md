# デプロイメントガイド

このドキュメントは、本番環境へのデプロイに必要な設定をまとめたものです。

## 環境変数の設定

### 必須の環境変数

デプロイ先のプラットフォーム（Render、Vercel、など）で以下の環境変数を設定してください。

#### データベース
```
DATABASE_URL=mysql://username:password@host:port/database
```

#### NextAuth.js
```
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-secret-key-here
```

**NEXTAUTH_SECRETの生成方法:**
```bash
openssl rand -base64 32
```

#### AWS S3 (画像アップロード)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
```

#### PayPal

**Sandbox環境（テスト用）:**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=your-sandbox-webhook-id
```

**Live環境（本番用）:**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-live-client-id
PAYPAL_CLIENT_SECRET=your-live-secret
PAYPAL_MODE=live
PAYPAL_WEBHOOK_ID=your-live-webhook-id
```

**重要:**
- `NEXT_PUBLIC_`で始まる環境変数のみブラウザからアクセス可能
- `PAYPAL_CLIENT_SECRET`は**絶対に**ブラウザに露出してはいけない（`NEXT_PUBLIC_`を付けない）
- 本番環境では必ず`PAYPAL_MODE=live`を設定
- テスト環境では必ず`PAYPAL_MODE=sandbox`を設定

## Renderでのデプロイ

### 1. 環境変数の設定

1. Renderダッシュボードでサービスを選択
2. "Environment" タブを開く
3. 上記の環境変数を1つずつ追加
4. **重要:** 値の前後に余分なスペースがないことを確認

### 2. ビルドコマンド

```bash
npm install && npx prisma generate && npm run build
```

### 3. スタートコマンド

```bash
npm start
```

### 4. データベースマイグレーション

初回デプロイ時、またはスキーマ変更後:

```bash
npx prisma migrate deploy
```

**注意:** Renderの場合、マイグレーションは手動で実行するか、ビルドコマンドに含める必要があります。

## Vercelでのデプロイ

### 1. 環境変数の設定

1. Vercelプロジェクトの設定を開く
2. "Settings" → "Environment Variables"
3. 上記の環境変数を追加
4. "Production", "Preview", "Development"の適用範囲を選択

### 2. データベース

Vercelでは以下のオプションがあります:
- PlanetScale（推奨）
- Amazon RDS
- 他のMySQLホスティングサービス

### 3. ビルド設定

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## 環境変数のトラブルシューティング

### PayPalエラー: "PayPalアクセストークンの取得に失敗しました"

**原因:**
1. 環境変数が設定されていない
2. Client IDまたはClient Secretが間違っている
3. モード（sandbox/live）と認証情報が一致していない
4. 環境変数の値に余分なスペースがある

**解決方法:**

#### 1. 環境変数が設定されているか確認

ローカル環境:
```bash
# .envファイルを確認
grep PAYPAL .env

# テストスクリプトを実行
npx tsx scripts/test-paypal-auth.ts
```

本番環境:
- Renderの "Environment" タブで確認
- Vercelの "Environment Variables" で確認

#### 2. PayPal認証情報を確認

1. [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)にログイン
2. "Apps & Credentials" を開く
3. Sandboxまたはliveタブを選択
4. アプリを選択（または作成）
5. Client IDとClient Secretをコピー

#### 3. モードと認証情報の一致を確認

- `PAYPAL_MODE=sandbox` → Sandbox認証情報を使用
- `PAYPAL_MODE=live` → Live認証情報を使用

**絶対にしてはいけないこと:**
- Sandbox認証情報でliveモードを使用
- Live認証情報でsandboxモードを使用

#### 4. 余分なスペースを削除

```bash
# 環境変数の値を確認（スペースが表示される）
cat .env | grep PAYPAL

# 正しい形式（値の後にスペースなし）
PAYPAL_MODE=live
PAYPAL_CLIENT_SECRET=ELF35BRSok...

# 間違った形式（値の後にスペースあり - これが問題の原因）
PAYPAL_MODE=live
```

### データベース接続エラー

**原因:**
1. `DATABASE_URL`が設定されていない
2. データベースサーバーが起動していない
3. 接続情報が間違っている
4. ファイアウォール/セキュリティグループの設定

**解決方法:**
```bash
# 接続テスト
npx prisma db pull
```

### NextAuth認証エラー

**原因:**
1. `NEXTAUTH_SECRET`が設定されていない
2. `NEXTAUTH_URL`が間違っている

**解決方法:**
```bash
# シークレットキーを生成
openssl rand -base64 32

# .envに追加
NEXTAUTH_SECRET=生成されたキー
NEXTAUTH_URL=https://your-domain.com
```

## デプロイ後のチェックリスト

- [ ] すべての環境変数が設定されている
- [ ] データベースマイグレーションが完了している
- [ ] PayPal認証が動作している（テストスクリプトで確認）
- [ ] 画像アップロードが動作している
- [ ] ユーザー登録・ログインが動作している
- [ ] 商品購入フローが動作している（Sandboxでテスト）
- [ ] 管理画面にアクセスできる
- [ ] エラーログを確認
- [ ] HTTPS証明書が有効

## セキュリティチェックリスト

- [ ] `.env`ファイルがGitにコミットされていない（`.gitignore`に含まれている）
- [ ] `NEXTAUTH_SECRET`が強力なランダム文字列
- [ ] 本番環境のデータベースパスワードが強力
- [ ] AWS IAMユーザーに最小限の権限のみ付与
- [ ] PayPal Client Secretがブラウザに露出していない
- [ ] CORS設定が適切（S3など）
- [ ] 管理者アカウントのパスワードが強力

## パフォーマンス最適化

### 画像最適化

Next.jsの`<Image>`コンポーネントを使用していることを確認:
```tsx
import Image from 'next/image'

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
/>
```

### キャッシング

- 静的ページは自動的にキャッシュされる
- APIルートには適切な`Cache-Control`ヘッダーを設定
- S3の画像にはCloudFrontなどのCDNを使用を検討

### データベース

- インデックスが適切に設定されている（Prismaスキーマで`@@index`を使用）
- コネクションプーリングを使用
- 不要なデータを取得しない（`select`で必要なフィールドのみ）

## モニタリング

### ログ確認

**Render:**
- "Logs" タブでリアルタイムログを確認

**Vercel:**
- "Deployments" → デプロイメントを選択 → "Logs"

### エラートラッキング

推奨ツール:
- Sentry（エラートラッキング）
- LogRocket（セッションリプレイ）
- Google Analytics（アクセス解析）

## ロールバック

問題が発生した場合:

**Render:**
1. "Manual Deploy" → "Deploy previous version"

**Vercel:**
1. "Deployments" → 前のデプロイメントを選択
2. "Promote to Production"

## サポート

問題が解決しない場合:

1. ログを確認
2. 環境変数を再確認
3. `scripts/test-paypal-auth.ts`でPayPal認証をテスト
4. データベース接続を確認（`npx prisma db pull`）
5. 開発チームに連絡（ログとエラーメッセージを添付）
