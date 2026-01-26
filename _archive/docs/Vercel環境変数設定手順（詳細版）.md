# Vercel環境変数設定手順（詳細版）

## 概要

4つのプロジェクトそれぞれの環境変数を正確に設定する手順です。

---

## プロジェクト1: store-web（出店者アプリ - Web環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス: https://vercel.com/dashboard
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-store-web`
   - **Root Directory**: `store`（重要：手動で入力）
   - **Framework Preset**: Next.js（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### ステップ2: 初回デプロイ（環境変数なしで実行）

1. 「Deploy」をクリック
2. デプロイ完了を待つ（約2-3分）
3. 生成されたURLを確認（例: `https://tomorrow-store-web-xxxxx.vercel.app`）
4. このURLをメモしておく

### ステップ3: 環境変数設定

1. プロジェクトの「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 以下の環境変数を**1つずつ**追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2でメモしたURL（例: `https://tomorrow-store-web-xxxxx.vercel.app`）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブをクリック
2. 最新のデプロイメントの右側の「...」メニューをクリック
3. 「Redeploy」を選択
4. 「Use existing Build Cache」のチェックを**外す**
5. 「Redeploy」をクリック
6. デプロイ完了を待つ（約2-3分）

### 確認

- [ ] 環境変数が3つすべて設定されている
- [ ] 再デプロイが完了している
- [ ] アプリが正常に動作する（メール認証のログイン/新規登録が表示される）

---

## プロジェクト2: store-liff（出店者アプリ - LIFF環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-store-liff`
   - **Root Directory**: `store`（重要：手動で入力）
   - **Framework Preset**: Next.js（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### ステップ2: 初回デプロイ（環境変数なしで実行）

1. 「Deploy」をクリック
2. デプロイ完了を待つ（約2-3分）
3. 生成されたURLを確認（例: `https://tomorrow-store-liff-xxxxx.vercel.app`）
4. このURLをメモしておく

### ステップ3: 環境変数設定

1. プロジェクトの「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 以下の環境変数を**1つずつ**追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
- **Key**: `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`
- **Value**: `2008516155`（出店者用のLINE LoginチャネルID）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数4: LINE_LOGIN_CHANNEL_SECRET
- **Key**: `LINE_LOGIN_CHANNEL_SECRET`
- **Value**: `4b6ca4be9c0ae7e856bb4db72c777876`（出店者用のLINE Loginチャネルシークレット）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- **重要**: この環境変数は `NEXT_PUBLIC_` プレフィックスが**ない**ので、サーバーサイドでのみ使用されます
- 「Add」をクリック

#### 環境変数5: NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI
- **Key**: `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`
- **Value**: ステップ2でメモしたURL + `/auth/callback`（例: `https://tomorrow-store-liff-xxxxx.vercel.app/auth/callback`）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数6: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2でメモしたURL（例: `https://tomorrow-store-liff-xxxxx.vercel.app`）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブをクリック
2. 最新のデプロイメントの右側の「...」メニューをクリック
3. 「Redeploy」を選択
4. 「Use existing Build Cache」のチェックを**外す**
5. 「Redeploy」をクリック
6. デプロイ完了を待つ（約2-3分）

### ステップ5: LINE Developers Console設定

1. LINE Developers Consoleにアクセス: https://developers.line.biz/console/
2. 出店者用のLINE Loginチャネル（チャネルID: `2008516155`）を選択
3. 「LINE Login」タブをクリック
4. 「Callback URL」セクションで以下を追加：
   ```
   https://tomorrow-store-liff-xxxxx.vercel.app/auth/callback
   ```
   （`xxxxx`の部分は実際のURLに置き換える）
5. 「Update」をクリック
6. 「LIFF」タブをクリック
7. LIFFアプリを作成（または既存のLIFFアプリを編集）：
   - **LIFF app name**: `出店者アプリ`
   - **Size**: `Full`
   - **Endpoint URL**: `https://tomorrow-store-liff-xxxxx.vercel.app`
   - **Scope**: `profile openid email` にチェック
8. 「Add」または「Update」をクリック
9. LIFF URLをメモしておく（後でテストに使用）

### 確認

- [ ] 環境変数が6つすべて設定されている
- [ ] 再デプロイが完了している
- [ ] LINE Developers ConsoleのCallback URLが設定されている
- [ ] LIFFアプリのEndpoint URLが設定されている
- [ ] アプリが正常に動作する（LINE認証のログイン/新規登録が表示される）

---

## プロジェクト3: organizer-web（主催者アプリ - Web環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-organizer-web`
   - **Root Directory**: `organizer`（重要：手動で入力）
   - **Framework Preset**: Next.js（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### ステップ2: 初回デプロイ（環境変数なしで実行）

1. 「Deploy」をクリック
2. デプロイ完了を待つ（約2-3分）
3. 生成されたURLを確認（例: `https://tomorrow-organizer-web-xxxxx.vercel.app`）
4. このURLをメモしておく

### ステップ3: 環境変数設定

1. プロジェクトの「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 以下の環境変数を**1つずつ**追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2でメモしたURL（例: `https://tomorrow-organizer-web-xxxxx.vercel.app`）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブをクリック
2. 最新のデプロイメントの右側の「...」メニューをクリック
3. 「Redeploy」を選択
4. 「Use existing Build Cache」のチェックを**外す**
5. 「Redeploy」をクリック
6. デプロイ完了を待つ（約2-3分）

### 確認

- [ ] 環境変数が3つすべて設定されている
- [ ] 再デプロイが完了している
- [ ] アプリが正常に動作する（メール認証のログイン/新規登録が表示される）

---

## プロジェクト4: admin（運営管理ダッシュボード）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定：
   - **Project Name**: `tomorrow-admin`
   - **Root Directory**: `admin`（重要：手動で入力）
   - **Framework Preset**: Next.js（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### ステップ2: 初回デプロイ（環境変数なしで実行）

1. 「Deploy」をクリック
2. デプロイ完了を待つ（約2-3分）
3. 生成されたURLを確認（例: `https://tomorrow-admin-xxxxx.vercel.app`）
4. このURLをメモしておく

### ステップ3: 環境変数設定

1. プロジェクトの「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 以下の環境変数を**1つずつ**追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2でメモしたURL（例: `https://tomorrow-admin-xxxxx.vercel.app`）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブをクリック
2. 最新のデプロイメントの右側の「...」メニューをクリック
3. 「Redeploy」を選択
4. 「Use existing Build Cache」のチェックを**外す**
5. 「Redeploy」をクリック
6. デプロイ完了を待つ（約2-3分）

### 確認

- [ ] 環境変数が3つすべて設定されている
- [ ] 再デプロイが完了している
- [ ] アプリが正常に動作する（運営管理ダッシュボードが表示される）

---

## 環境変数一覧表

### store-web（3つの環境変数）

| Key | Value | 説明 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xszkbfwqtwpsfnwdfjak.supabase.co` | SupabaseプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase匿名キー |
| `NEXT_PUBLIC_APP_URL` | `https://tomorrow-store-web-xxxxx.vercel.app` | アプリのURL（デプロイ後に設定） |

### store-liff（6つの環境変数）

| Key | Value | 説明 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xszkbfwqtwpsfnwdfjak.supabase.co` | SupabaseプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase匿名キー |
| `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` | `2008516155` | 出店者用LINE LoginチャネルID |
| `LINE_LOGIN_CHANNEL_SECRET` | `4b6ca4be9c0ae7e856bb4db72c777876` | 出店者用LINE Loginチャネルシークレット |
| `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` | `https://tomorrow-store-liff-xxxxx.vercel.app/auth/callback` | LINE LoginコールバックURL |
| `NEXT_PUBLIC_APP_URL` | `https://tomorrow-store-liff-xxxxx.vercel.app` | アプリのURL（デプロイ後に設定） |

### organizer-web（3つの環境変数）

| Key | Value | 説明 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xszkbfwqtwpsfnwdfjak.supabase.co` | SupabaseプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase匿名キー |
| `NEXT_PUBLIC_APP_URL` | `https://tomorrow-organizer-web-xxxxx.vercel.app` | アプリのURL（デプロイ後に設定） |

### admin（3つの環境変数）

| Key | Value | 説明 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xszkbfwqtwpsfnwdfjak.supabase.co` | SupabaseプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase匿名キー |
| `NEXT_PUBLIC_APP_URL` | `https://tomorrow-admin-xxxxx.vercel.app` | アプリのURL（デプロイ後に設定） |

---

## 重要な注意事項

### 1. Root Directoryの設定

各プロジェクトで**Root Directory**を正しく設定することが重要です：
- `store-web`: `store`
- `store-liff`: `store`
- `organizer-web`: `organizer`
- `admin`: `admin`

### 2. 環境変数の設定タイミング

1. 初回デプロイを環境変数なしで実行
2. デプロイ完了後、生成されたURLを確認
3. 環境変数を設定（`NEXT_PUBLIC_APP_URL`には実際のURLを設定）
4. 再デプロイを実行（Build Cacheを無効化）

### 3. LINE_LOGIN_CHANNEL_SECRETについて

`store-liff`プロジェクトの`LINE_LOGIN_CHANNEL_SECRET`は、`NEXT_PUBLIC_`プレフィックスが**ない**環境変数です。これはサーバーサイド（API Routes）でのみ使用され、クライアント側には公開されません。

### 4. 環境変数のEnvironment設定

すべての環境変数は、`Production`、`Preview`、`Development`の**すべて**にチェックを入れてください。これにより、どの環境でも同じ環境変数が使用されます。

### 5. 再デプロイ時の注意

環境変数を追加・変更した後は、必ず再デプロイを実行してください。また、「Use existing Build Cache」のチェックを**外す**ことで、環境変数の変更が確実に反映されます。

---

## トラブルシューティング

### 環境変数が反映されない

1. 環境変数の設定を確認（KeyとValueが正しいか）
2. Environment設定を確認（すべての環境にチェックが入っているか）
3. 再デプロイを実行（Build Cacheを無効化）
4. ビルドログを確認（環境変数が正しく読み込まれているか）

### ビルドエラーが発生する

1. Root Directoryが正しく設定されているか確認
2. `package.json`が存在するか確認
3. ビルドログを確認してエラーメッセージを確認

### LINE Loginが動作しない（store-liff）

1. `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`が正しいか確認
2. `LINE_LOGIN_CHANNEL_SECRET`が正しいか確認
3. `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`が正しいか確認（末尾に`/auth/callback`が含まれているか）
4. LINE Developers ConsoleのCallback URLが正しく設定されているか確認
