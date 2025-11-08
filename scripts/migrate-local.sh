#!/bin/bash

# Renderのシェルでマイグレーションスクリプトを実行するためのヘルパースクリプト

echo "=== Renderでマイグレーションを実行します ==="
echo ""
echo "以下の手順を実行してください："
echo ""
echo "1. https://dashboard.render.com/ にログイン"
echo "2. omoideuribaのWebサービスを選択"
echo "3. 左メニューから「Shell」をクリック"
echo "4. 以下のコマンドを実行:"
echo ""
echo "   npx tsx scripts/run-sql-migration.ts"
echo ""
echo "5. 成功したら、以下のコマンドも実行:"
echo ""
echo "   npx prisma migrate resolve --applied 20251108_restructure_order_model"
echo ""
echo "6. Renderで「Manual Deploy」を実行"
echo ""
echo "=== 注意 ==="
echo "ローカルからRDSへの直接接続はセキュリティグループで制限されています。"
echo "Render経由での実行が必要です。"
