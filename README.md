# 思い出売場 (Omoide Uriba)

レトログッズを売り買いできるレトロポップなECサイト

## 🎮 特徴

- レトロポップなデザイン
- Next.js 14 App Routerを使用したモダンなアーキテクチャ
- MySQL + Prisma ORMによる堅牢なデータベース管理
- NextAuth.jsによる安全な認証システム
- Zustandを使用したクライアントサイド状態管理
- PayPal決済統合（実装予定）
- AWS S3への画像アップロード（実装予定）
- Tailwind CSSによるレスポンシブデザイン

## 🚀 技術スタック

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL (AWS RDS)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Storage**: AWS S3
- **Payment**: PayPal
- **Hosting**: Render

## 📋 前提条件

- Node.js 18.x 以上
- npm または yarn
- AWS RDS MySQL データベース
- AWS S3 バケット

## 🛠️ セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd omoideuriba
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env` ファイルは既に設定されています。本番環境では以下の値を更新してください：

```env
# Prisma Database URL
DATABASE_URL=mysql://admin:Jwxy1Zm3@omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com:3306/omoideuriba-db

# AWS S3設定
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=omoideuriba-media-prod
AWS_S3_REGION=us-east-1

# NextAuth設定
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**重要**: 本番環境では必ず新しいランダムなシークレットキーを生成してください：

```bash
openssl rand -base64 32
```

### 4. データベースのセットアップ

Prismaを使用してデータベーススキーマをマイグレーションします：

```bash
# Prismaクライアントの生成
npm run prisma:generate

# マイグレーション実行
npm run prisma:migrate

# （オプション）Prisma Studioでデータベースを確認
npm run prisma:studio
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 📁 プロジェクト構造

```
omoideuriba/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/         # 認証関連API
│   ├── auth/             # 認証ページ
│   ├── cart/             # カートページ
│   ├── products/         # 商品ページ
│   ├── globals.css       # グローバルCSS
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # トップページ
├── components/            # 再利用可能なコンポーネント
│   ├── Header.tsx        # ヘッダー
│   ├── Footer.tsx        # フッター
│   ├── ProductCard.tsx   # 商品カード
│   └── ProductDetail.tsx # 商品詳細
├── lib/                   # ユーティリティ
│   ├── prisma.ts         # Prismaクライアント
│   ├── auth.ts           # NextAuth設定
│   └── store/            # Zustand ストア
│       └── cart.ts       # カートストア
├── prisma/               # Prismaスキーマ
│   └── schema.prisma     # データベーススキーマ
├── public/               # 静的ファイル
├── types/                # TypeScript型定義
│   ├── index.ts          # 共通型
│   └── next-auth.d.ts    # NextAuth型拡張
├── .env                  # 環境変数
├── next.config.js        # Next.js設定
├── tailwind.config.ts    # Tailwind CSS設定
└── tsconfig.json         # TypeScript設定
```

## 🎨 デザインシステム

### カラーパレット

レトロポップなカラーパレットを使用：

- **retro-pink**: #FF6B9D
- **retro-yellow**: #FFE66D
- **retro-blue**: #4ECDC4
- **retro-purple**: #C7CEEA
- **retro-orange**: #FFA07A
- **retro-mint**: #98D8C8
- **retro-lavender**: #B4A7D6
- **retro-peach**: #FFB5A7

### カスタムクラス

```css
.btn-retro         /* レトロボタン基本スタイル */
.btn-retro-pink    /* ピンクボタン */
.btn-retro-blue    /* ブルーボタン */
.btn-retro-yellow  /* イエローボタン */
.card-retro        /* レトロカード */
.input-retro       /* レトロ入力フィールド */
.tag-retro         /* レトロタグ */
```

## 📦 データベーススキーマ

主要なテーブル：

- **User**: ユーザー情報
- **Product**: 商品情報
- **Category**: カテゴリ
- **Order**: 注文情報
- **OrderItem**: 注文明細

詳細は `prisma/schema.prisma` を参照してください。

## 🔐 認証

NextAuth.jsを使用した認証システム：

- メール/パスワード認証
- セッション管理（JWT）
- 保護されたルート

## 🛒 主な機能

### ✅ 実装済み

- [x] レスポンシブなレトロポップデザイン
- [x] 商品一覧・詳細表示
- [x] ショッピングカート機能
- [x] ユーザー登録・ログイン
- [x] データベース設計とマイグレーション

### 🚧 今後の実装予定

- [ ] PayPal決済統合
- [ ] AWS S3画像アップロード
- [ ] 商品検索・フィルタリング
- [ ] 注文履歴表示
- [ ] 管理者ダッシュボード
- [ ] 商品レビュー機能
- [ ] お気に入り機能

## 🚀 デプロイ

### Renderへのデプロイ

1. Renderアカウントを作成
2. 新しいWeb Serviceを作成
3. リポジトリを接続
4. 環境変数を設定
5. ビルドコマンド: `npm install && npm run build`
6. 起動コマンド: `npm start`

### 環境変数の設定

本番環境では以下の環境変数を設定してください：

- `DATABASE_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_S3_REGION`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 コントリビューション

このプロジェクトへの貢献を歓迎します！

## 📝 ライセンス

MIT License

## 📧 お問い合わせ

プロジェクトに関するお問い合わせは、Issueを作成してください。

---

Made with ❤️ and レトロな思い出
