# 主催者アプリ Vercelデプロイ手順（簡単版）

## 前提条件

- GitHubリポジトリにプッシュ済み
- Vercelアカウントを持っている
- Supabaseの環境変数を準備済み

## デプロイ手順

### 1. Vercelでプロジェクトを作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択（またはインポート）

### 2. プロジェクト設定

以下の設定を入力：

- **Project Name**: `tomorrow-organizer-web`（任意）
- **Root Directory**: `organizer` ⚠️ **重要: organizerディレクトリを指定**
- **Framework Preset**: Next.js（自動検出されるはず）
- **Build Command**: （自動検出）`cd organizer && npm run build` または `npm run build`
- **Output Directory**: （自動検出）`.next`
- **Install Command**: （自動検出）`cd organizer && npm install` または `npm install`

### 3. 環境変数を設定

「Environment Variables」セクションで以下を設定：

```env
# Supabase設定（必須）
NEXT_PUBLIC_SUPABASE_URL=https://wosgrdgnkdaxmykclazc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc2dyZGdua2RheG15a2NsYXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjU4OTksImV4cCI6MjA3ODkwMTg5OX0.tAB-e53Xf8Lif8yzpJCoXsmnKM_oTAiVEMbETo4ivSg
SUPABASE_SERVICE_ROLE_KEY=（Supabase Service Role Key - APIルート用）

# アプリURL（初回デプロイ後に更新）
NEXT_PUBLIC_APP_URL=https://tomorrow-organizer-web.vercel.app

# Google認証用（使用する場合）
NEXT_PUBLIC_GOOGLE_CLIENT_ID=（Google OAuth Client ID）

# LINE認証用（使用する場合）
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=（LINE Login Channel ID）
LINE_LOGIN_CHANNEL_SECRET=（LINE Login Channel Secret）
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://tomorrow-organizer-web.vercel.app/auth/callback

# メール送信用（Resendを使用する場合）
RESEND_API_KEY=（Resend API Key）
RESEND_FROM_EMAIL=noreply@tomorrow-event-platform.com

# Googleスプレッドシート機能用（使用する場合）
GOOGLE_SERVICE_ACCOUNT_EMAIL=（Google Service Account Email）
GOOGLE_PRIVATE_KEY=（Google Private Key）
GOOGLE_SPREADSHEET_ID=（Google Spreadsheet ID）

# OpenAI API（営業許可証検証機能用、使用する場合）
OPENAI_API_KEY=（OpenAI API Key）
```

**重要**: 
- 環境変数は `Production`, `Preview`, `Development` すべてに設定することを推奨
- `NEXT_PUBLIC_APP_URL`は初回デプロイ後に実際のURLに更新してください

### 4. デプロイを実行

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（通常2-3分）
3. デプロイ完了後、生成されたURLを確認（例: `https://tomorrow-organizer-web.vercel.app`）

### 5. 環境変数を更新

デプロイ完了後、生成されたURLを使用して環境変数を更新：

1. Vercelダッシュボードの「Settings」→「Environment Variables」を開く
2. `NEXT_PUBLIC_APP_URL` を実際のURLに更新
3. 「Redeploy」をクリックして再デプロイ

### 6. Google認証の設定（使用する場合）

Google OAuthを使用する場合は、以下も設定：

1. [Google Cloud Console](https://console.cloud.google.com/)でOAuth 2.0クライアントIDを作成
2. 認証済みのリダイレクトURIに以下を追加：
   ```
   https://tomorrow-organizer-web.vercel.app/auth/callback
   ```
3. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` を環境変数に設定
4. 再デプロイ

## 動作確認

デプロイ完了後、以下を確認：

1. ✅ アプリが正常に表示されるか
2. ✅ ログイン・新規登録が動作するか
3. ✅ イベント作成フォームが表示されるか
4. ✅ 3ステップ形式のフォームが動作するか

## トラブルシューティング

### ビルドエラーが発生する場合

- Root Directoryが `organizer` に設定されているか確認
- `package.json` が `organizer` ディレクトリに存在するか確認
- 環境変数が正しく設定されているか確認

### 環境変数が読み込まれない場合

- 環境変数の名前が正しいか確認（`NEXT_PUBLIC_` プレフィックスが必要）
- 再デプロイを実行（環境変数の変更は再デプロイが必要）

### 認証が動作しない場合

- Supabaseの設定を確認
- リダイレクトURIが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

