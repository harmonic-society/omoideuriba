# カテゴリSlug更新ガイド

このガイドでは、カテゴリのslugを以下のように更新する方法を説明します:

- おもちゃ → `toy`
- ゲーム → `game`
- CD・レコード → `cd-record`
- フィギュア → `figure`

## 方法1: APIエンドポイントを使用（推奨）

### 手順

1. **管理者アカウントでログイン**
   - サイトにアクセス: https://omoideuriba.com
   - 管理者アカウントでログイン

2. **APIエンドポイントを実行**

以下のいずれかの方法でエンドポイントを呼び出します:

#### ブラウザの開発者ツールを使用

1. ブラウザで管理画面を開く
2. F12キーまたはCmd+Option+I (Mac) で開発者ツールを開く
3. Consoleタブを選択
4. 以下のコードを貼り付けて実行:

```javascript
fetch('/api/admin/categories/update-slugs', {
  method: 'POST',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => {
    console.log('結果:', data)
    if (data.results) {
      data.results.forEach(result => {
        if (result.status === 'success') {
          console.log(`✅ ${result.name}: ${result.oldSlug} → ${result.newSlug}`)
        } else if (result.status === 'not_found') {
          console.log(`⚠️  ${result.name}: ${result.message}`)
        } else {
          console.log(`❌ ${result.name}: ${result.message}`)
        }
      })
    }
    console.log('\n更新後のカテゴリ一覧:')
    data.categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.slug}`)
    })
  })
  .catch(error => console.error('エラー:', error))
```

#### curlコマンドを使用（ターミナル）

1. まず、ブラウザで管理画面にログイン
2. ブラウザの開発者ツールでCookieを取得
3. 以下のコマンドを実行（Cookieを置き換える）:

```bash
curl -X POST https://omoideuriba.com/api/admin/categories/update-slugs \
  -H "Cookie: your-session-cookie-here" \
  -H "Content-Type: application/json"
```

### 実行結果の確認

成功時の出力例:
```json
{
  "message": "カテゴリslugの更新が完了しました",
  "results": [
    {
      "name": "おもちゃ",
      "status": "success",
      "oldSlug": "omochya",
      "newSlug": "toy"
    },
    {
      "name": "ゲーム",
      "status": "success",
      "oldSlug": "game-old",
      "newSlug": "game"
    },
    {
      "name": "CD・レコード",
      "status": "success",
      "oldSlug": "cd-record-old",
      "newSlug": "cd-record"
    },
    {
      "name": "フィギュア",
      "status": "success",
      "oldSlug": "figure-old",
      "newSlug": "figure"
    }
  ],
  "categories": [
    { "id": "...", "name": "おもちゃ", "slug": "toy" },
    { "id": "...", "name": "ゲーム", "slug": "game" },
    { "id": "...", "name": "CD・レコード", "slug": "cd-record" },
    { "id": "...", "name": "フィギュア", "slug": "figure" }
  ]
}
```

## 方法2: 管理画面で手動更新

1. 管理画面にログイン
2. サイドバーから「カテゴリ管理」を選択
3. 各カテゴリを編集:
   - おもちゃ → Slugを `toy` に変更
   - ゲーム → Slugを `game` に変更
   - CD・レコード → Slugを `cd-record` に変更
   - フィギュア → Slugを `figure` に変更
4. 各カテゴリで「更新」ボタンをクリック

## 方法3: スクリプトを実行（ローカル環境）

**注意**: データベースに接続できる環境でのみ実行可能

```bash
npx tsx scripts/update-category-slugs.ts
```

## 確認方法

更新後、以下のURLにアクセスして確認:

- https://omoideuriba.com/categories/toy （おもちゃ）
- https://omoideuriba.com/categories/game （ゲーム）
- https://omoideuriba.com/categories/cd-record （CD・レコード）
- https://omoideuriba.com/categories/figure （フィギュア）

各ページが正しく表示されれば成功です。

## トラブルシューティング

### エラー: "管理者権限が必要です"

- 管理者アカウントでログインしていることを確認
- セッションが有効であることを確認（ログアウトして再ログイン）

### エラー: "カテゴリが見つかりません"

- カテゴリ名が正確に一致しているか確認
- 管理画面のカテゴリ管理で実際のカテゴリ名を確認

### slugが重複している場合

データベースエラーが発生します。その場合:
1. 管理画面で既存のslugを確認
2. 重複しているslugを別の値に変更
3. 再度更新スクリプトを実行

## セキュリティに関する注意

- このAPIエンドポイントは管理者のみ実行可能です
- 認証されていないユーザーは403エラーになります
- ログインセッションは安全に保管してください
