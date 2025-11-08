# S3画像アップロード設定ガイド

## 必要なAWS設定

### 1. S3バケットの作成

AWS コンソールで以下の手順を実行：

1. S3サービスに移動
2. 「バケットを作成」をクリック
3. バケット名: `omoideuriba-media-prod`
4. リージョン: `us-east-1`（または.envで設定したリージョン）
5. 「パブリックアクセスをすべてブロック」のチェックを**外す**
6. バケットを作成

### 2. CORS設定

バケットの「アクセス許可」タブから「Cross-Origin Resource Sharing (CORS)」を編集し、以下のJSON設定を適用：

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://omoideuriba.vercel.app",
      "https://*.vercel.app"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

または、このリポジトリの `s3-cors-config.json` ファイルを使用して、AWS CLIで設定できます：

```bash
aws s3api put-bucket-cors \
  --bucket omoideuriba-media-prod \
  --cors-configuration file://s3-cors-config.json
```

### 3. バケットポリシー

バケットの「アクセス許可」タブから「バケットポリシー」を編集し、以下のポリシーを適用：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::omoideuriba-media-prod/*"
    }
  ]
}
```

これにより、アップロードされた画像が公開URLで閲覧可能になります。

### 4. IAMユーザーの権限

画像をアップロードするIAMユーザー（環境変数で設定したアクセスキーを持つユーザー）に、以下の権限が必要です：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::omoideuriba-media-prod/*"
    }
  ]
}
```

### 5. 環境変数の確認

`.env` ファイルに以下の環境変数が正しく設定されていることを確認：

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=omoideuriba-media-prod
AWS_S3_REGION=us-east-1
```

## トラブルシューティング

### 画像アップロードが失敗する場合

1. **ブラウザのコンソールを確認**
   - F12キーを押して開発者ツールを開く
   - Consoleタブでエラーメッセージを確認
   - デバッグログで詳細を確認：
     - `Requesting upload URL for:` - アップロード開始
     - `Upload URL received:` - プレサインドURL取得成功
     - `Starting S3 upload...` - S3へのアップロード開始
     - `S3 upload response:` - S3レスポンスのステータスコード

2. **サーバーログを確認**
   - ターミナルでNext.jsの開発サーバーのログを確認
   - `S3 Configuration:` - S3の設定状態
   - `Generating presigned URL for key:` - 生成中のキー
   - エラーメッセージがあれば詳細を確認

3. **よくあるエラーと解決方法**

#### CORS エラー
```
Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**解決方法**: 上記のCORS設定を適用してください。

#### 403 Forbidden
```
S3 upload failed: 403 Forbidden
```
**解決方法**:
- バケットポリシーが正しく設定されているか確認
- IAMユーザーの権限を確認
- AWS認証情報（アクセスキー）が正しいか確認

#### 認証エラー
```
Invalid AWS credentials
```
**解決方法**:
- `.env` ファイルの `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` を確認
- 開発サーバーを再起動（環境変数の再読み込み）

#### バケットが見つからない
```
The specified bucket does not exist
```
**解決方法**:
- S3バケット名が `.env` の設定と一致するか確認
- バケットが正しいリージョンに作成されているか確認

### デバッグログを削除する

本番環境にデプロイする前に、以下のファイルからデバッグ用の `console.log` を削除してください：

- `components/admin/ImageUpload.tsx`
- `lib/s3.ts`

## AWS CLIでの設定例

AWS CLIを使用して設定を行う場合：

```bash
# CORS設定
aws s3api put-bucket-cors \
  --bucket omoideuriba-media-prod \
  --cors-configuration file://s3-cors-config.json

# バケットポリシー設定
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::omoideuriba-media-prod/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket omoideuriba-media-prod \
  --policy file://bucket-policy.json
```
