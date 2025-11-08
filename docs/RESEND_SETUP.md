# Resend メール送信設定ガイド

お問い合わせフォームの自動返信メール機能を有効にするため、Resendの設定が必要です。

## 1. Resendアカウント作成

1. [Resend](https://resend.com) にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントまたはメールアドレスで登録
4. メールアドレスを確認

## 2. APIキーの取得

1. Resendダッシュボードにログイン
2. 左メニューから「API Keys」を選択
3. 「Create API Key」をクリック
4. 名前を入力（例: `omoideuriba-production`）
5. Permission: **Full access** を選択
6. 「Create」をクリック
7. **APIキーをコピー**（一度しか表示されません）

## 3. ドメイン設定（推奨）

独自ドメインからメールを送信する場合（推奨）:

### 3.1 ドメインの追加

1. Resendダッシュボードで「Domains」を選択
2. 「Add Domain」をクリック
3. ドメイン名を入力（例: `omoideuriba.com`）
4. 「Add」をクリック

### 3.2 DNS設定

表示されるDNSレコードをドメインのDNS設定に追加:

```
# SPFレコード（TXT）
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIMレコード（TXT）
Type: TXT
Name: resend._domainkey
Value: [Resendが提供する値]

# DMARCレコード（TXT - オプション）
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your-email@example.com
```

### 3.3 検証

1. DNS設定後、数分～24時間待つ
2. Resendダッシュボードで「Verify」をクリック
3. ステータスが「Verified」になることを確認

### 送信元メールアドレス

ドメイン検証後、以下の形式でメールを送信可能:

- `noreply@omoideuriba.com`
- `contact@omoideuriba.com`
- `info@omoideuriba.com`

## 4. 環境変数の設定

### 4.1 ローカル開発環境

`.env.local` ファイルに以下を追加:

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 送信元メールアドレス
EMAIL_FROM=noreply@omoideuriba.com

# 管理者メールアドレス（通知先）
ADMIN_EMAIL=admin@omoideuriba.com

# サイトURL（メール内のリンクに使用）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.2 Render本番環境

Renderダッシュボードで環境変数を設定:

1. Renderダッシュボードにログイン
2. サービスを選択
3. 「Environment」タブを選択
4. 以下の環境変数を追加:

| Key | Value | 説明 |
|-----|-------|------|
| `RESEND_API_KEY` | `re_xxx...` | ResendのAPIキー |
| `EMAIL_FROM` | `noreply@omoideuriba.com` | 送信元メールアドレス |
| `ADMIN_EMAIL` | `your-email@example.com` | 管理者のメールアドレス |
| `NEXT_PUBLIC_SITE_URL` | `https://omoideuriba.com` | 本番サイトURL |

5. 「Save Changes」をクリック
6. サービスを再デプロイ

## 5. テスト送信

### 5.1 ローカルでテスト

1. 開発サーバーを起動: `npm run dev`
2. `/contact` ページにアクセス
3. フォームに入力して送信
4. メールが届くか確認:
   - 自動返信メール（お客様用）
   - 通知メール（管理者用）

### 5.2 本番環境でテスト

1. デプロイ完了後、本番サイトの `/contact` にアクセス
2. テスト送信を実行
3. メール受信を確認

## 6. トラブルシューティング

### メールが届かない場合

#### 1. APIキーを確認

```bash
# ローカル
echo $RESEND_API_KEY

# Render
# Environment タブで確認
```

#### 2. Resendダッシュボードでログを確認

1. Resendダッシュボード → 「Emails」
2. 送信履歴を確認
3. エラーがある場合は詳細を確認

#### 3. サーバーログを確認

Renderのログで以下を確認:

```
Sending contact confirmation email to: user@example.com
Contact confirmation email sent: { id: 'xxx' }
```

#### 4. 迷惑メールフォルダを確認

自動返信メールが迷惑メールに分類されている可能性があります。

#### 5. ドメイン検証を確認

- Resendダッシュボード → 「Domains」
- ステータスが「Verified」であることを確認
- 未検証の場合、DNS設定を再確認

### よくあるエラー

#### `Missing API key`

**原因**: `RESEND_API_KEY` 環境変数が設定されていない

**解決方法**:
1. 環境変数を確認
2. Renderを再デプロイ

#### `Invalid API key`

**原因**: APIキーが間違っている、または無効

**解決方法**:
1. Resendダッシュボードで新しいAPIキーを発行
2. 環境変数を更新
3. Renderを再デプロイ

#### `Domain not verified`

**原因**: ドメインが検証されていない

**解決方法**:
1. DNS設定を確認
2. 24時間待ってから再検証
3. または `EMAIL_FROM` を `onboarding@resend.dev` に変更（テスト用）

## 7. 料金

Resendの料金プラン:

- **Free プラン**: 月3,000通まで無料
- **Pro プラン**: 月$20で50,000通まで

お問い合わせフォームの使用量であれば、Freeプランで十分です。

## 8. 参考資料

- [Resend公式ドキュメント](https://resend.com/docs)
- [Resend Node.js SDK](https://resend.com/docs/send-with-nodejs)
- [ドメイン認証ガイド](https://resend.com/docs/dashboard/domains/introduction)
- [Next.js統合ガイド](https://resend.com/docs/send-with-nextjs)

## 9. セキュリティ

### APIキーの管理

- ✅ 環境変数に保存
- ✅ Gitにコミットしない
- ✅ `.env.local` は `.gitignore` に含める
- ❌ クライアントサイドで使用しない
- ❌ ハードコードしない

### メール送信の制限

現在の実装では、お問い合わせフォーム送信時のみメールを送信します。
スパム対策として、将来的に以下の実装を検討:

- レート制限（同一IPから1時間に5通まで）
- reCAPTCHA v3
- 送信前のCSRFトークン検証
