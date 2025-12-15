# Vercelデプロイガイド

## 📋 デプロイ前のチェックリスト

### ✅ 必要なファイル
- [x] `package.json` - ビルドスクリプトが設定されている
- [x] `next.config.js` - 環境変数の設定がある
- [x] `vercel.json` - Vercel設定（Next.js 14では通常不要だが、既に設定済み）

## 🔑 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください。

### 必須環境変数（クライアント側）
| 環境変数名 | 説明 | 取得方法 |
|-----------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL | Supabaseダッシュボード → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | Supabaseダッシュボード → Settings → API |
| `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` | LINE LoginチャネルID | LINE Developersコンソール |
| `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` | リダイレクトURI（デプロイ後に設定） | `https://your-app.vercel.app/auth/callback` |
| `NEXT_PUBLIC_APP_URL` | アプリのURL（デプロイ後に設定） | `https://your-app.vercel.app` |

### 必須環境変数（サーバー側）
| 環境変数名 | 説明 | 取得方法 |
|-----------|------|---------|
| `LINE_LOGIN_CHANNEL_SECRET` | LINE Loginチャネルシークレット | LINE Developersコンソール |

### オプション環境変数（機能を使用する場合）
| 環境変数名 | 説明 | 用途 |
|-----------|------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー | 通知API（サーバーサイド操作） |
| `OPENAI_API_KEY` | OpenAI APIキー | ビジネスライセンス検証 |
| `RESEND_API_KEY` | Resend APIキー | メール送信 |
| `RESEND_FROM_EMAIL` | 送信元メールアドレス | メール送信 |

## 🚀 デプロイ方法

### 方法1: Vercel CLI（推奨）

#### 1. Vercel CLIをインストール（まだの場合）
```bash
npm i -g vercel
```

#### 2. ログイン
```bash
cd store
vercel login
```

#### 3. プロジェクトをリンク
```bash
vercel link
```

以下の質問に答えてください：
- **Set up and deploy?** → `Yes`
- **Which scope?** → あなたのアカウントを選択
- **Link to existing project?** → `No` (新規の場合) または `Yes` (既存の場合)
- **What's your project's name?** → `tomorrow-store` など
- **In which directory is your code located?** → `./`

#### 4. 環境変数を設定

**CLIで設定する場合:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
vercel env add LINE_LOGIN_CHANNEL_SECRET
```

各環境変数に対して：
- **What's the value?** → 値を入力
- **Add to which Environments?** → `Production`, `Preview`, `Development` すべてにチェック ✅

**デプロイ後に設定が必要な環境変数:**
```bash
vercel env add NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI
vercel env add NEXT_PUBLIC_APP_URL
```
これらの値は、デプロイ後のURLを使用します（例: `https://tomorrow-store-xxxxx.vercel.app`）

#### 5. プレビューデプロイ
```bash
vercel
```

#### 6. 本番環境にデプロイ
```bash
vercel --prod
```

### 方法2: Vercelダッシュボード（GitHub連携）

#### 1. GitHubリポジトリを準備
```bash
cd /Users/mocky700/Desktop/tomorrow
git init  # まだの場合
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### 2. Vercelダッシュボードでデプロイ
1. https://vercel.com/new にアクセス
2. **Import Git Repository** をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定：
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `store` を指定（重要！）
   - **Build Command**: `npm run build` (デフォルト)
   - **Output Directory**: `.next` (デフォルト)
5. **Environment Variables** を設定（必須環境変数をすべて追加）
6. **Deploy** をクリック

## 🔄 デプロイ後の設定

### 1. 環境変数を更新
デプロイが完了したら、Vercelダッシュボードで以下を設定：

1. プロジェクトのURLを確認（例: `https://tomorrow-store-xxxxx.vercel.app`）
2. **Settings** → **Environment Variables** に移動
3. 以下を追加/更新：
   - `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`: `https://your-app.vercel.app/auth/callback`
   - `NEXT_PUBLIC_APP_URL`: `https://your-app.vercel.app`
4. **Save** をクリック

### 2. LINE DevelopersコンソールでコールバックURLを更新
1. https://developers.line.biz/console/ にアクセス
2. あなたのLINE Loginチャネルを開く
3. **Callback URL** に以下を追加：
   ```
   https://your-app.vercel.app/auth/callback
   ```
4. **Verify** をクリックして保存

### 3. 再デプロイ
環境変数を更新した後、再デプロイが必要です：

**CLIの場合:**
```bash
vercel --prod
```

**ダッシュボードの場合:**
- **Deployments** タブ → 最新のデプロイの右側の **⋮** → **Redeploy**

## ✅ デプロイ確認

1. **ビルドログを確認**
   - Vercelダッシュボード → **Deployments** → 最新のデプロイをクリック
   - ビルドが成功しているか確認

2. **アプリを開く**
   - デプロイされたURL（例: `https://tomorrow-store-xxxxx.vercel.app`）にアクセス
   - エラーなく表示されるか確認

3. **機能テスト**
   - ログイン機能
   - LINE Login
   - 登録フロー
   - イベント一覧

## 🐛 トラブルシューティング

### ビルドエラー
- `next.config.js` の設定を確認
- 環境変数が正しく設定されているか確認
- `package.json` のビルドスクリプトを確認

### 環境変数が反映されない
- Vercelダッシュボードで環境変数を確認
- 環境変数名が正しいか確認（特に `NEXT_PUBLIC_` プレフィックス）
- 再デプロイが必要です

### 認証エラー
- LINE LoginのコールバックURLが正しく設定されているか確認
- `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` が正しく設定されているか確認
- Supabaseの設定を確認

### 404エラー
- `Root Directory` が `store` に設定されているか確認
- Next.jsのルーティングが正しく設定されているか確認

## 📝 注意事項

1. **環境変数のセキュリティ**
   - `LINE_LOGIN_CHANNEL_SECRET` と `SUPABASE_SERVICE_ROLE_KEY` はサーバーサイドのみで使用
   - これらの値はクライアント側に公開されません（`NEXT_PUBLIC_` プレフィックスがないため）

2. **デプロイ後のURL変更**
   - デプロイ後にURLが変更される場合があります
   - URLが確定したら、環境変数とLINE Developersの設定を更新してください

3. **Custom Domain（オプション）**
   - Vercelダッシュボード → **Settings** → **Domains** でカスタムドメインを設定可能
   - カスタムドメインを設定した場合、環境変数も更新が必要です

