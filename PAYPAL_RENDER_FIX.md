# Render環境でのPayPal認証エラー修正手順

## 問題の詳細

本番環境（Render）でPayPal認証が失敗しています:

```
Response status: 401 Unauthorized
Error: "invalid_client" - "Client Authentication failed"
```

ローカル環境では認証が成功しているため、Renderの環境変数が正しく設定されていない可能性があります。

## 原因

1. Renderに設定されているPayPal認証情報が古い
2. Renderの環境変数の値に余分なスペースや改行がある
3. 本番用（live）とサンドボックス用の認証情報が混在している
4. PayPal Developer Dashboardで認証情報がローテーションされた

## 修正手順

### ステップ1: PayPal Developer Dashboardで認証情報を確認

1. [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/) にログイン
2. "Apps & Credentials" を開く
3. **"Live"タブ**を選択（本番環境を使用しているため）
4. アプリを選択（またはなければ作成）
5. 以下の情報をコピー:
   - **Client ID** (例: Adzl9rh-98Uznfb...)
   - **Secret** をクリックして表示し、コピー (例: ELF35BRSok7igKB...)

**重要**:
- 必ず**Live**タブから取得してください
- Client IDとSecretは必ず同じアプリのものを使用してください
- コピー時に余分なスペースが入らないように注意してください

### ステップ2: Renderで環境変数を更新

1. [Renderダッシュボード](https://dashboard.render.com/)にログイン
2. サービス "omoideuriba" を選択
3. 左メニューから **"Environment"** タブを開く
4. 以下の環境変数を更新または追加:

#### 更新が必要な環境変数:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID
```
- 値: PayPal DashboardからコピーしたClient ID
- **重要**: 前後にスペースがないことを確認

```
PAYPAL_CLIENT_SECRET
```
- 値: PayPal DashboardからコピーしたSecret
- **重要**: 前後にスペースがないことを確認

```
PAYPAL_MODE
```
- 値: `live` （スペースなし）
- **重要**: 値は正確に `live` のみ（前後にスペースなし）

#### 確認方法:

各環境変数を編集して、以下を確認:
1. 値の前に空白がない
2. 値の後に空白がない
3. 改行が含まれていない
4. 値が完全にコピーされている

**間違った例**:
```
PAYPAL_MODE=live     ← 後ろにスペース（ダメ）
PAYPAL_CLIENT_SECRET= ELF35... ← 前にスペース（ダメ）
```

**正しい例**:
```
PAYPAL_MODE=live
PAYPAL_CLIENT_SECRET=ELF35BRSok7igKBlGrZVOJYDHKOeFXdp5hpTHaHO4FMiIrhLM6KMSNTvSy5MFWUN6g9iSpM8OhdD4S8g
```

### ステップ3: 環境変数を保存

1. すべての変更を確認
2. "Save Changes" ボタンをクリック
3. Renderが自動的に再デプロイを開始します

### ステップ4: デプロイ完了を待つ

1. "Logs" タブを開く
2. デプロイプロセスを監視
3. "Your service is live 🎉" メッセージを待つ

### ステップ5: 動作確認

1. サイトにアクセス: https://omoideuriba.com
2. 商品をカートに追加
3. チェックアウトを進める
4. 注文確認ページでPayPalボタンを確認

#### ログで確認:

Renderの "Logs" タブで以下が表示されるはずです:

**成功時:**
```
=== PayPal Access Token Request ===
API Base: https://api-m.paypal.com
Mode: live
Client ID exists: true
Client Secret exists: true
Response status: 200
Access token obtained successfully
```

**失敗時（まだエラーの場合）:**
```
Response status: 401
PayPal token error response: {"error":"invalid_client",...}
```

## トラブルシューティング

### エラーが続く場合

#### 1. Client IDとSecretが対応しているか確認

PayPal Dashboardで、**同じアプリ**からClient IDとSecretを取得していることを確認してください。

#### 2. Liveモードとアプリのモードが一致しているか確認

- `PAYPAL_MODE=live` なら、**Liveタブ**の認証情報を使用
- `PAYPAL_MODE=sandbox` なら、**Sandboxタブ**の認証情報を使用

現在は `PAYPAL_MODE=live` なので、Liveタブから取得してください。

#### 3. 認証情報をリセット

PayPal Developer Dashboardで:
1. アプリの詳細ページを開く
2. "Secret" セクションで "Show" をクリック
3. "Reset Secret" をクリック（新しいSecretが生成される）
4. 新しいSecretをコピー
5. Renderの環境変数を更新

#### 4. 新しいアプリを作成

既存のアプリに問題がある場合:
1. PayPal Dashboardで新しいアプリを作成
2. 新しいClient IDとSecretを取得
3. Renderの環境変数を更新

### ローカル環境で動作確認

ローカル環境で同じ認証情報をテスト:

1. `.env`ファイルを更新:
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=新しいClient ID
PAYPAL_CLIENT_SECRET=新しいSecret
PAYPAL_MODE=live
```

2. テストスクリプトを実行:
```bash
npx tsx scripts/test-paypal-auth.ts
```

3. 成功メッセージを確認:
```
✅ 成功! アクセストークンを取得できました
🎉 PayPal認証情報は正しく設定されています!
```

4. 成功したら、同じ値をRenderに設定

## セキュリティに関する注意

1. **Client Secretは絶対に公開しないでください**
   - GitHubにコミットしない
   - スクリーンショットに含めない
   - 他人と共有しない

2. **環境変数の定期的なローテーション**
   - 定期的にClient Secretをリセット
   - 古い認証情報は無効化

3. **本番環境では必ずLiveモードを使用**
   - `PAYPAL_MODE=live`
   - Live認証情報のみ使用
   - Sandbox認証情報は使用しない

## 確認チェックリスト

デプロイ後、以下を確認:

- [ ] Renderの環境変数が正しく設定されている
- [ ] 環境変数に余分なスペースがない
- [ ] `PAYPAL_MODE=live`
- [ ] Client IDとSecretが対応している（同じアプリ）
- [ ] Live認証情報を使用している
- [ ] Renderのログで "Access token obtained successfully" が表示される
- [ ] PayPalボタンが表示される
- [ ] PayPalボタンをクリックしてもエラーが出ない

## サポートが必要な場合

上記の手順を試してもエラーが解決しない場合:

1. Renderのログ全体をコピー
2. PayPal Developer Dashboardのスクリーンショット（Secretは隠す）
3. Renderの環境変数のスクリーンショット（値は隠す）
4. 開発チームに連絡

## 参考リンク

- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
- [PayPal REST API Documentation](https://developer.paypal.com/docs/api/overview/)
- [Render Environment Variables](https://render.com/docs/environment-variables)
