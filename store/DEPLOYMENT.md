# Vercelへのデプロイ手順

## 方法1: Vercel CLIを使用（推奨）

### 1. ログイン
```bash
cd store
npx vercel login
```
ブラウザが開くので、Vercelアカウントでログインしてください。

### 2. プロジェクトをリンク
```bash
npx vercel link
```
以下の質問に答えてください：
- Set up and deploy? **Yes**
- Which scope? **あなたのアカウントを選択**
- Link to existing project? **No** (新規プロジェクトの場合)
- What's your project's name? **tomorrow-store** など
- In which directory is your code located? **./** (現在のディレクトリ)

### 3. 環境変数を設定

#### 方法A: CLIで設定
```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
npx vercel env add LINE_LOGIN_CHANNEL_SECRET
npx vercel env add NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI
npx vercel env add NEXT_PUBLIC_APP_URL
```

各環境変数に対して：
- What's the value? → 値を入力
- Add to which Environments? → **Production, Preview, Development すべてにチェック**

#### 方法B: Vercelダッシュボードで設定
1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. 以下の環境変数を追加：

| 環境変数名 | 説明 | 例 |
|-----------|------|-----|
| NEXT_PUBLIC_SUPABASE_URL | SupabaseのURL | https://xxxxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabaseの匿名キー | eyJxxx... |
| NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID | LINE LoginのチャネルID | 1234567890 |
| LINE_LOGIN_CHANNEL_SECRET | LINE Loginのチャネルシークレット | xxxxxx |
| NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI | リダイレクトURI | https://your-app.vercel.app/auth/callback |
| NEXT_PUBLIC_APP_URL | アプリのURL | https://your-app.vercel.app |

**注意**: `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` と `NEXT_PUBLIC_APP_URL` は、最初のデプロイ後にURLが決まってから設定してください。

### 4. デプロイ
```bash
# プレビューデプロイ
npx vercel

# 本番環境にデプロイ
npx vercel --prod
```

### 5. デプロイ後の設定

1. デプロイが完了したら、VercelダッシュボードでプロジェクトのURLを確認（例: `https://tomorrow-store-xxxxx.vercel.app`）

2. 環境変数を更新：
   - `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`: `https://your-app.vercel.app/auth/callback`
   - `NEXT_PUBLIC_APP_URL`: `https://your-app.vercel.app`

3. LINE DevelopersコンソールでコールバックURLを更新：
   - https://developers.line.biz/console/ にアクセス
   - あなたのLINE Loginチャネルを開く
   - Callback URL に `https://your-app.vercel.app/auth/callback` を追加

4. 環境変数を再デプロイ：
   ```bash
   npx vercel --prod
   ```

## 方法2: Vercelダッシュボードからデプロイ

1. https://vercel.com/new にアクセス
2. GitHubリポジトリをインポート（推奨）または、ローカルフォルダをアップロード
3. プロジェクト名を設定（例: `tomorrow-store`）
4. Framework Preset: **Next.js** を選択
5. Root Directory: `store` を指定
6. Environment Variables を設定（方法1の手順3を参照）
7. Deploy をクリック

## トラブルシューティング

### ビルドエラー
- `next.config.js` で `output: 'standalone'` が設定されているか確認
- 環境変数が正しく設定されているか確認

### 認証エラー
- `npx vercel logout` でログアウトしてから再度 `npx vercel login`

### 環境変数が反映されない
- Vercelダッシュボードで環境変数を確認
- 再デプロイが必要な場合があります

