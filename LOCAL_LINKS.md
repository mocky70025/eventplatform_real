# ローカル開発用リンク集

開発中に各アプリケーションへ簡単にアクセスするためのリンク集です。

## 🌐 アプリケーション一覧

| アプリケーション | URL | テーマカラー | 説明 |
| :--- | :--- | :--- | :--- |
| **出店者 (Store)** | [http://localhost:3001](http://localhost:3001) | 🟢 エメラルド | イベントの検索、出店申込、プロフィール管理 |
| **主催者 (Organizer)** | [http://localhost:3002](http://localhost:3002) | 🟠 オレンジ | イベントの作成、申込の管理、チャット |
| **管理者 (Admin)** | [http://localhost:3000](http://localhost:3000) | 🔵 ブルー | プラットフォーム全体の管理、承認作業 |

---

## 🛠 開発用ツール

- **Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
  - データベース、認証、ストレージの管理に使用します。

## 📝 コマンド備忘録

各ディレクトリで以下のコマンドを使用してサーバーを起動します。

```bash
# 出店者アプリ
cd store && npm run dev

# 主催者アプリ
cd organizer && npm run dev

# 管理者アプリ
cd admin && npm run dev
```



cd store && npm run dev
cd ../
cd organizer && npm run dev
cd ../
cd admin && npm run dev
cd ../