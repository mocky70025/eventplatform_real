# 🚀 旧デミセル セットアップガイド

デザインシステムv2.0が完成したので、次はインフラとデプロイの設定を行います。

---

## 📋 優先順位順のセットアップ

### 🔴 **優先度1: Supabaseの設定**（必須）

#### 1-1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Name**: `demicell-store`（出店者用）
   - **Database Password**: 強力なパスワードを設定
   - **Region**: `Northeast Asia (Tokyo)`
4. 「Create new project」をクリック

#### 1-2. データベーススキーマの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `/旧デミセル/supabase_schema_new.sql` の内容をコピー＆ペースト
4. 「Run」をクリックして実行

**確認項目**:
- ✅ `exhibitors` テーブルが作成された
- ✅ `organizers` テーブルが作成された
- ✅ `events` テーブルが作成された
- ✅ `event_applications` テーブルが作成された
- ✅ `form_drafts` テーブルが作成された

#### 1-3. ストレージの設定

1. Supabaseダッシュボードで「Storage」を開く
2. 「New bucket」をクリック
3. バケット情報を入力：
   - **Name**: `event-images`
   - **Public bucket**: ✅ チェックを入れる
4. 「Create bucket」をクリック

同様に以下のバケットも作成：
- `exhibitor-documents`（出店者の書類用）
- `organizer-documents`（主催者の書類用）

#### 1-4. 認証設定

1. Supabaseダッシュボードで「Authentication」→「Providers」を開く
2. 以下のプロバイダーを有効化：

**Email**:
- ✅ Enable Email provider
- Confirm email: `Disabled`（開発時）/ `Enabled`（本番時）

**Google**:
- ✅ Enable Google provider
- Client ID: （後で設定）
- Client Secret: （後で設定）

#### 1-5. 環境変数の取得

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

---

### 🟠 **優先度2: Google OAuth設定**（必須）

#### 2-1. Google Cloud Consoleでプロジェクト作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成：
   - **プロジェクト名**: `demicell`
3. 「OAuth同意画面」を設定：
   - **User Type**: External
   - **アプリ名**: デミセル
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **承認済みドメイン**: `supabase.co`

#### 2-2. OAuth認証情報の作成

1. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
2. アプリケーションの種類：**ウェブアプリケーション**
3. 承認済みのリダイレクト URI:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   （xxxxx は自分のSupabaseプロジェクトURL）

4. 「作成」をクリック
5. **クライアントID** と **クライアントシークレット** をコピー

#### 2-3. SupabaseにGoogle認証情報を設定

1. Supabaseダッシュボードで「Authentication」→「Providers」→「Google」
2. コピーした情報を貼り付け：
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxx`
3. 「Save」をクリック

---

### 🟡 **優先度3: LINE Login設定**（オプション）

#### 3-1. LINE Developersでチャネル作成

1. [LINE Developers](https://developers.line.biz/)にアクセス
2. 「新規プロバイダー作成」→「新規チャネル作成」
3. チャネルタイプ：**LINE Login**
4. チャネル情報を入力：
   - **チャネル名**: デミセル（出店者）
   - **チャネル説明**: イベント出店管理プラットフォーム
   - **アプリタイプ**: ウェブアプリ

#### 3-2. コールバックURLの設定

「LINE Login設定」→「コールバックURL」:
```
http://localhost:3000/auth/callback
https://your-domain.vercel.app/auth/callback
```

#### 3-3. Channel IDとChannel Secretを取得

「チャネル基本設定」から：
- **Channel ID**: `xxxxxxxxxx`
- **Channel Secret**: `xxxxxxxxxxxxxxxxxxxxx`

---

### 🟢 **優先度4: ローカル環境の設定**

#### 4-1. 環境変数ファイルの作成

各アプリのルートディレクトリに `.env.local` を作成：

**出店者アプリ** (`/旧デミセル/store/.env.local`):
```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# LINE Login設定
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=xxxxxxxxxx
LINE_LOGIN_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxx

# アプリURL（開発環境）
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=http://localhost:3000/auth/callback
```

**主催者アプリ** (`/旧デミセル/organizer/.env.local`):
```env
# Supabase設定（同じプロジェクトを使用）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# LINE Login設定（別のチャネルを推奨）
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=yyyyyyyyyy
LINE_LOGIN_CHANNEL_SECRET=yyyyyyyyyyyyyyyyyyyyy

# アプリURL（開発環境）
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=http://localhost:3001/auth/callback
```

**管理者アプリ** (`/旧デミセル/admin/.env.local`):
```env
# Supabase設定（同じプロジェクトを使用）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 管理者メールアドレス
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

#### 4-2. 依存関係のインストール

```bash
# 出店者アプリ
cd /Users/mocky700/Desktop/デミセル/旧デミセル/store
npm install

# 主催者アプリ
cd /Users/mocky700/Desktop/デミセル/旧デミセル/organizer
npm install

# 管理者アプリ
cd /Users/mocky700/Desktop/デミセル/旧デミセル/admin
npm install
```

#### 4-3. ローカルサーバーの起動

```bash
# 出店者アプリ（ポート3000）
cd /Users/mocky700/Desktop/デミセル/旧デミセル/store
npm run dev

# 主催者アプリ（ポート3001）
cd /Users/mocky700/Desktop/デミセル/旧デミセル/organizer
npm run dev -- -p 3001

# 管理者アプリ（ポート3002）
cd /Users/mocky700/Desktop/デミセル/旧デミセル/admin
npm run dev -- -p 3002
```

#### 4-4. 動作確認

- 出店者: http://localhost:3000
- 主催者: http://localhost:3001
- 管理者: http://localhost:3002

**確認項目**:
- ✅ ログイン画面が表示される
- ✅ Google認証ボタンが動作する
- ✅ メール認証ボタンが動作する
- ✅ LINE認証ボタンが動作する（設定した場合）

---

### 🔵 **優先度5: Vercelデプロイ**

#### 5-1. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com/)にアクセス
2. 「Add New」→「Project」をクリック
3. GitHubリポジトリをインポート（または手動デプロイ）

#### 5-2. 出店者アプリのデプロイ

**プロジェクト設定**:
- **Project Name**: `demicell-store`
- **Framework Preset**: Next.js
- **Root Directory**: `旧デミセル/store`

**環境変数**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=xxxxxxxxxx
LINE_LOGIN_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://demicell-store.vercel.app
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://demicell-store.vercel.app/auth/callback
```

#### 5-3. 主催者アプリのデプロイ

**プロジェクト設定**:
- **Project Name**: `demicell-organizer`
- **Framework Preset**: Next.js
- **Root Directory**: `旧デミセル/organizer`

**環境変数**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=yyyyyyyyyy
LINE_LOGIN_CHANNEL_SECRET=yyyyyyyyyyyyyyyyyyyyy
NEXT_PUBLIC_APP_URL=https://demicell-organizer.vercel.app
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://demicell-organizer.vercel.app/auth/callback
```

#### 5-4. 管理者アプリのデプロイ

**プロジェクト設定**:
- **Project Name**: `demicell-admin`
- **Framework Preset**: Next.js
- **Root Directory**: `旧デミセル/admin`

**環境変数**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

#### 5-5. リダイレクトURLの更新

デプロイ後、以下を更新：

**Supabase**:
1. 「Authentication」→「URL Configuration」
2. 「Redirect URLs」に追加：
   ```
   https://demicell-store.vercel.app/auth/callback
   https://demicell-organizer.vercel.app/auth/callback
   ```

**Google Cloud Console**:
1. 「認証情報」→「OAuth 2.0 クライアント ID」
2. 「承認済みのリダイレクト URI」に追加：
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```

**LINE Developers**:
1. 各チャネルの「LINE Login設定」
2. 「コールバックURL」に追加：
   ```
   https://demicell-store.vercel.app/auth/callback
   https://demicell-organizer.vercel.app/auth/callback
   ```

---

## ✅ セットアップ完了チェックリスト

### Supabase
- [ ] プロジェクト作成完了
- [ ] データベーススキーマ実行完了
- [ ] ストレージバケット作成完了
- [ ] 認証プロバイダー設定完了
- [ ] 環境変数取得完了

### Google OAuth
- [ ] Google Cloudプロジェクト作成完了
- [ ] OAuth認証情報作成完了
- [ ] Supabaseに認証情報設定完了

### LINE Login（オプション）
- [ ] LINEチャネル作成完了
- [ ] コールバックURL設定完了
- [ ] Channel ID/Secret取得完了

### ローカル環境
- [ ] `.env.local` ファイル作成完了
- [ ] 依存関係インストール完了
- [ ] ローカルサーバー起動確認
- [ ] 各認証方法の動作確認完了

### Vercel
- [ ] 出店者アプリデプロイ完了
- [ ] 主催者アプリデプロイ完了
- [ ] 管理者アプリデプロイ完了
- [ ] 環境変数設定完了
- [ ] リダイレクトURL更新完了

---

## 🆘 トラブルシューティング

### 認証エラーが出る場合
1. `.env.local` の環境変数が正しいか確認
2. SupabaseのリダイレクトURLに登録されているか確認
3. ブラウザのキャッシュをクリア

### デプロイエラーが出る場合
1. Vercelの環境変数が正しく設定されているか確認
2. ビルドログを確認してエラー内容を特定
3. `node_modules` を削除して再インストール

### データベースエラーが出る場合
1. Supabaseのスキーマが正しく実行されたか確認
2. RLSポリシーが有効になっているか確認
3. テーブルのインデックスが作成されているか確認

---

## 📞 サポート

問題が解決しない場合は、以下の情報を添えて相談してください：
- エラーメッセージの全文
- ブラウザのコンソールログ
- 実行した手順
- 使用している環境（OS、ブラウザ、Node.jsバージョン）

---

## 🎉 次のステップ

セットアップが完了したら、次は：
1. **テストデータの投入**: `test_events_data.sql` を実行
2. **残りのコンポーネントのデザイン改善**: EventList, EventForm など
3. **機能テスト**: 全ての機能が正しく動作するか確認
4. **本番環境へのデプロイ**: カスタムドメインの設定など

頑張ってください！🚀

