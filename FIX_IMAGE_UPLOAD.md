# 画像アップロード403エラーの修正手順

## 問題の概要

現在、S3への画像アップロードで **403 Forbidden** エラーが発生しています。
これは、IAMユーザー `omoideuriba` に必要な権限が付与されていないためです。

## 修正手順

### 1. AWS Management Consoleにログイン

管理者権限を持つAWSアカウントでログインしてください。

### 2. IAMユーザーに権限を追加

#### 方法A: 既存のポリシーをアタッチ（推奨）

1. **IAMコンソール**に移動: https://console.aws.amazon.com/iam/
2. 左メニューから「ユーザー」を選択
3. ユーザー名 `omoideuriba` をクリック
4. 「アクセス許可」タブを選択
5. 「アクセス許可を追加」→「ポリシーを直接アタッチ」
6. 以下のポリシーを検索してアタッチ：
   - `AmazonS3FullAccess`（または次の方法Bでカスタムポリシーを作成）

#### 方法B: カスタムポリシーを作成（本番環境推奨）

1. **IAMコンソール**の左メニューから「ポリシー」を選択
2. 「ポリシーを作成」をクリック
3. 「JSON」タブを選択
4. 以下のJSONをペースト：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3MediaBucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::omoideuriba-media-prod",
        "arn:aws:s3:::omoideuriba-media-prod/*"
      ]
    }
  ]
}
```

5. 「次のステップ」をクリック
6. ポリシー名: `OmoideUribaMediaUpload` を入力
7. 「ポリシーの作成」をクリック
8. ユーザー `omoideuriba` に戻り、このポリシーをアタッチ

### 3. S3バケットの設定を確認・修正

#### 3.1 パブリックアクセス設定

1. **S3コンソール**に移動: https://s3.console.aws.amazon.com/s3/
2. バケット `omoideuriba-media-prod` をクリック
3. 「アクセス許可」タブを選択
4. 「パブリックアクセスをブロック」セクションで「編集」をクリック
5. 以下のチェックを**外す**：
   - ✅ 新しいアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
   - ✅ 任意のアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
   - ✅ 新しいパブリックバケットポリシーまたはアクセスポイントポリシーを介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
   - ✅ 任意のパブリックバケットポリシーまたはアクセスポイントポリシーを介したバケットとオブジェクトへのパブリックアクセスとクロスアカウントアクセスをブロックする

**注意**: すべてのチェックを外してください。これにより、アップロードした画像がWebから閲覧可能になります。

6. 「変更を保存」をクリック
7. 確認のため `confirm` と入力

#### 3.2 バケットポリシーの設定

1. 同じ「アクセス許可」タブの「バケットポリシー」セクションで「編集」をクリック
2. 以下のJSONをペースト：

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

3. 「変更を保存」をクリック

#### 3.3 CORS設定

1. 同じ「アクセス許可」タブの「Cross-Origin Resource Sharing (CORS)」セクションで「編集」をクリック
2. 以下のJSONをペースト：

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

3. 「変更を保存」をクリック

### 4. 開発サーバーを再起動

環境変数を再読み込みするため、Next.jsの開発サーバーを再起動してください：

```bash
# Ctrl+C で停止
npm run dev
```

### 5. 画像アップロードをテスト

1. ブラウザで http://localhost:3000/admin/products/new にアクセス
2. 画像をアップロード
3. ブラウザのコンソール（F12）でエラーがないか確認

## 設定確認チェックリスト

- [ ] IAMユーザー `omoideuriba` にS3の権限がアタッチされている
- [ ] S3バケット `omoideuriba-media-prod` のパブリックアクセスブロックがすべて無効
- [ ] S3バケットポリシーで `s3:GetObject` が許可されている
- [ ] S3バケットのCORS設定が正しく設定されている
- [ ] 開発サーバーを再起動した

## トラブルシューティング

### それでも403エラーが出る場合

1. **AWS認証情報を再確認**
   ```bash
   aws configure list
   ```

   アクセスキーIDとシークレットキーが正しいか確認してください。

2. **バケットのリージョンを確認**
   ```bash
   cat .env | grep AWS_S3
   ```

   `AWS_S3_REGION=us-east-1` とバケットのリージョンが一致するか確認。

3. **新しいアクセスキーを作成**

   IAMユーザー `omoideuriba` の「セキュリティ認証情報」タブで、新しいアクセスキーを作成し、`.env` ファイルを更新。

### CORSエラーが出る場合

ブラウザコンソールに以下のようなエラーが表示される：
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**解決方法**: 上記の手順3.3のCORS設定を再確認してください。

### バケットが存在しない場合

バケット `omoideuriba-media-prod` が存在しない場合は、S3コンソールで作成：

1. S3コンソールで「バケットを作成」
2. バケット名: `omoideuriba-media-prod`
3. リージョン: `米国東部（バージニア北部）us-east-1`
4. 「パブリックアクセスをすべてブロック」のチェックを外す
5. バケットを作成
6. 上記の手順3.2と3.3を実行

## 完了後

設定が完了したら、このドキュメントは削除しても構いません。
`S3_SETUP.md` に一般的な設定手順が記載されています。
