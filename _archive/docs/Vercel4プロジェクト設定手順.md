# Vercel 4プロジェクト設定手順

## 概要

以下の4つのプロジェクトをVercelで設定します：

1. **store-web**: 出店者アプリ（Web環境、メール認証のみ）
2. **store-liff**: 出店者アプリ（LIFF環境、LINE認証のみ）
3. **organizer-web**: 主催者アプリ（Web環境、メール認証のみ）
4. **admin**: 運営管理ダッシュボード

---

## 前提条件

- GitHubリポジトリ: `tomorrow-event-platform`
- 既存のVercelプロジェクトは削除済み
- SupabaseプロジェクトのURLとAnon Keyを準備
- LINE LoginチャネルIDとシークレットを準備（store-liff用）

---

## 1. store-web（出店者アプリ - Web環境）

### プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-store-web`
   - **Root Directory**: `store`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 環境変数設定

以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://xszkbfwqtwpsfnwdfjak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q
NEXT_PUBLIC_APP_URL=https://tomorrow-store-web.vercel.app
```

**注意**: `NEXT_PUBLIC_APP_URL`は、初回デプロイ後にVercelが生成したURLに更新してください。

### デプロイ

1. 「Deploy」をクリック
2. デプロイ完了後、生成されたURLを確認
3. 環境変数 `NEXT_PUBLIC_APP_URL` を実際のURLに更新
4. 再デプロイを実行

---

## 2. store-liff（出店者アプリ - LIFF環境）

### プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-store-liff`
   - **Root Directory**: `store`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 環境変数設定

以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://xszkbfwqtwpsfnwdfjak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=<store用のLINE LoginチャネルID>
LINE_LOGIN_CHANNEL_SECRET=<store用のLINE Loginチャネルシークレット>
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://tomorrow-store-liff.vercel.app/auth/callback
NEXT_PUBLIC_APP_URL=https://tomorrow-store-liff.vercel.app
```

**注意**: 
- `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`と`LINE_LOGIN_CHANNEL_SECRET`は、store用のLINE Loginチャネルの情報を使用
- `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`と`NEXT_PUBLIC_APP_URL`は、初回デプロイ後にVercelが生成したURLに更新してください

### LINE Developers Console設定

1. LINE Developers Consoleにアクセス
2. store用のLINE Loginチャネルを選択
3. 「Callback URL」に以下を追加：
   ```
   https://tomorrow-store-liff.vercel.app/auth/callback
   ```
4. LIFFアプリを作成（または既存のLIFFアプリを編集）：
   - **LIFF app name**: `出店者アプリ`
   - **Size**: `Full`
   - **Endpoint URL**: `https://tomorrow-store-liff.vercel.app`
   - **Scope**: `profile openid email`

### デプロイ

1. 「Deploy」をクリック
2. デプロイ完了後、生成されたURLを確認
3. 環境変数とLINE Developers Consoleの設定を実際のURLに更新
4. 再デプロイを実行

---

## 3. organizer-web（主催者アプリ - Web環境）

### プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-organizer-web`
   - **Root Directory**: `organizer`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 環境変数設定

以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://xszkbfwqtwpsdfjak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q
NEXT_PUBLIC_APP_URL=https://tomorrow-organizer-web.vercel.app
```

**注意**: `NEXT_PUBLIC_APP_URL`は、初回デプロイ後にVercelが生成したURLに更新してください。

### デプロイ

1. 「Deploy」をクリック
2. デプロイ完了後、生成されたURLを確認
3. 環境変数 `NEXT_PUBLIC_APP_URL` を実際のURLに更新
4. 再デプロイを実行

---

## 4. admin（運営管理ダッシュボード）

### プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-admin`
   - **Root Directory**: `admin`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 環境変数設定

以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://xszkbfwqtwpsfnwdfjak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q
NEXT_PUBLIC_APP_URL=https://tomorrow-admin.vercel.app
```

**注意**: `NEXT_PUBLIC_APP_URL`は、初回デプロイ後にVercelが生成したURLに更新してください。

### デプロイ

1. 「Deploy」をクリック
2. デプロイ完了後、生成されたURLを確認
3. 環境変数 `NEXT_PUBLIC_APP_URL` を実際のURLに更新
4. 再デプロイを実行

---

## デプロイ後の確認事項

### store-web
- [ ] Web環境でメール認証のログイン/新規登録が動作する
- [ ] LINE認証のボタンが表示されない

### store-liff
- [ ] LIFF環境でLINE認証のログイン/新規登録が動作する
- [ ] メール認証のボタンが表示されない
- [ ] LINE Developers ConsoleのCallback URLが正しく設定されている
- [ ] LIFFアプリのEndpoint URLが正しく設定されている

### organizer-web
- [ ] Web環境でメール認証のログイン/新規登録が動作する
- [ ] LINE認証のボタンが表示されない

### admin
- [ ] 運営管理ダッシュボードが表示される
- [ ] 主催者とイベントの一覧が表示される
- [ ] 承認機能が動作する

---

## トラブルシューティング

### 環境変数が反映されない場合

1. 環境変数を設定後、必ず再デプロイを実行
2. Vercel Dashboardの「Settings」→「Environment Variables」で設定を確認
3. ビルドログで環境変数が正しく読み込まれているか確認

### URLが正しく設定されていない場合

1. 初回デプロイ後に生成されたURLを確認
2. 環境変数 `NEXT_PUBLIC_APP_URL` を実際のURLに更新
3. 再デプロイを実行

### LINE Loginが動作しない場合（store-liff）

1. LINE Developers ConsoleのCallback URLが正しく設定されているか確認
2. 環境変数 `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` が正しいか確認
3. 環境変数 `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` と `LINE_LOGIN_CHANNEL_SECRET` が正しいか確認

---

## まとめ

4つのプロジェクトを以下のように設定しました：

1. **store-web**: 出店者アプリ（Web環境、メール認証のみ）
2. **store-liff**: 出店者アプリ（LIFF環境、LINE認証のみ）
3. **organizer-web**: 主催者アプリ（Web環境、メール認証のみ）
4. **admin**: 運営管理ダッシュボード

各プロジェクトは独立してデプロイされ、環境変数で設定が管理されます。

