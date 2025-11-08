# データベース接続の問題と解決方法

## 現在の問題

RDSデータベース `omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com` に接続できません。

エラーメッセージ:
```
Can't reach database server at `omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com:3306`
```

## 原因

以下のいずれかが原因と考えられます：

1. **RDSインスタンスが停止している**
2. **セキュリティグループの設定**（IPアドレス制限）
3. **VPC/ネットワーク設定**
4. **RDSインスタンスが削除されている**

## 解決方法

### オプション1: ローカルデータベースを使用（開発環境推奨）

開発環境ではローカルのMySQLを使用することを推奨します。

#### 1. MySQLをインストール

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
MySQLの公式サイトからインストーラーをダウンロード

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

#### 2. データベースを作成

```bash
mysql -u root -p
```

MySQLコンソールで:
```sql
CREATE DATABASE omoideuriba_dev;
CREATE USER 'omoideuriba_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON omoideuriba_dev.* TO 'omoideuriba_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. `.env`ファイルを更新

```env
# RDS接続をコメントアウト
# DATABASE_URL=mysql://admin:Jwxy1Zm3@omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com:3306/omoideuriba-db

# ローカルMySQL接続
DATABASE_URL=mysql://omoideuriba_user:your_password@localhost:3306/omoideuriba_dev
```

#### 4. マイグレーションを実行

```bash
npx prisma migrate dev
```

#### 5. 初期データを投入（オプション）

```bash
# 管理者ユーザーを作成
npx tsx scripts/create-admin.ts

# サンプルカテゴリを作成（管理画面から手動でも可）
```

### オプション2: RDSインスタンスを修正

#### 1. RDSインスタンスの状態を確認

AWS Management Console → RDS → データベース

`omoideuriba-db` の状態を確認：
- **利用可能**: 緑色のステータス
- **停止中**: 赤色のステータス
- **存在しない**: リストに表示されない

#### 2. 停止している場合は起動

1. インスタンスを選択
2. 「アクション」→「起動」をクリック
3. 起動まで数分待つ

#### 3. セキュリティグループを確認

1. RDSインスタンスを選択
2. 「接続とセキュリティ」タブ
3. セキュリティグループをクリック
4. インバウンドルールを確認：
   - タイプ: MySQL/Aurora (3306)
   - ソース:
     - 開発環境: `0.0.0.0/0`（全てのIPを許可）
     - または自分のIPアドレス

#### 4. パブリックアクセス設定

開発環境でローカルから接続する場合：

1. RDSインスタンスを選択
2. 「変更」をクリック
3. 「追加の設定」→「パブリックアクセス可能」を「はい」に変更
4. 「続行」→「すぐに適用」
5. 変更を保存

**注意**: 本番環境ではセキュリティリスクがあるため、適切なセキュリティグループ設定を行ってください。

## トラブルシューティング

### データベース接続をテスト

```bash
# MySQLクライアントで接続テスト
mysql -h omoideuriba-db.ckt0mwie243c.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      -P 3306

# パスワード: Jwxy1Zm3
```

成功すれば接続できます。失敗する場合は上記の設定を確認してください。

### カテゴリが存在するか確認

データベースに接続できたら、カテゴリをチェック：

```bash
npx tsx scripts/check-categories.ts
```

カテゴリがない場合：

1. http://localhost:3000/admin/categories にアクセス
2. 「新しいカテゴリを追加」をクリック
3. カテゴリ情報を入力して作成

### Prisma Clientを再生成

データベース接続先を変更した場合：

```bash
npx prisma generate
npx prisma migrate dev
```

## 推奨設定（まとめ）

### 開発環境
- ローカルMySQL使用
- 接続が高速で安定
- コストゼロ

### 本番環境（Vercel等）
- RDS使用
- セキュリティグループで適切にIP制限
- 自動バックアップ有効化

### .envファイルの管理

開発環境用と本番環境用で別の.envファイルを用意：

- `.env.local` - ローカル開発用
- `.env.production` - 本番環境用（Vercelの環境変数で設定）
