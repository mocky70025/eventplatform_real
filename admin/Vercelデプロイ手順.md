# 運営ダッシュボード（admin）Vercelデプロイ手順

## 概要

運営ダッシュボード（admin）をVercelにデプロイする手順です。

---

## ステップ1: Vercelでプロジェクトを作成

1. Vercelダッシュボードにログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択（`tomorrow-event-platform`）
4. プロジェクト設定：
   - **Project Name**: `tomorrow-event-platform-admin`（任意）
   - **Root Directory**: `admin` を選択
   - **Framework Preset**: Next.js（自動検出されるはず）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
   - **Install Command**: `npm install`（デフォルト）

---

## ステップ2: 環境変数を設定

Vercelのプロジェクト設定で、以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xszkbfwqtwpsfnwdfjak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q
```

**設定方法**:
1. Vercelプロジェクトの「Settings」→「Environment Variables」を開く
2. 上記の環境変数を追加
3. 「All Environments」を選択

---

## ステップ3: デプロイ

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待つ（数分）
3. デプロイ完了後、URLが表示される（例: `https://tomorrow-event-platform-admin.vercel.app`）

---

## ステップ4: 動作確認

1. デプロイされたURLにアクセス
2. 運営ダッシュボードが表示されることを確認
3. 「主催者承認」タブで、登録された主催者が表示されることを確認
4. 主催者を承認できることを確認

---

## 現在の機能

### ✅ 実装済み

- **主催者承認機能**
  - 主催者一覧の表示
  - 未承認主催者の承認/却下
  - 承認ステータスの表示

- **イベント管理機能**
  - イベント一覧の表示
  - イベントの承認/却下（`approval_status`カラムが存在する場合）

### ⚠️ 未実装

- 出店者承認機能
- 出店申し込み管理機能

---

## トラブルシューティング

### デプロイエラーが発生する場合

1. **Root Directoryが正しく設定されているか確認**
   - `admin` が設定されているか確認

2. **環境変数が正しく設定されているか確認**
   - `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されているか

3. **ビルドログを確認**
   - Vercelのデプロイログでエラーを確認

### データが表示されない場合

1. **SupabaseのRLSポリシーを確認**
   - `organizers`テーブルと`events`テーブルに公開アクセスが許可されているか確認
   - `supabase_rls_fix.sql`を実行済みか確認

2. **ブラウザのコンソール（F12）でエラーを確認**
   - ネットワークエラーや認証エラーがないか確認

---

## 完了チェックリスト

- [ ] Vercelでプロジェクトを作成（Root Directory: `admin`）
- [ ] 環境変数を設定（Supabase URL/Key）
- [ ] デプロイが成功する
- [ ] 運営ダッシュボードが表示される
- [ ] 主催者一覧が表示される
- [ ] 主催者の承認が動作する

