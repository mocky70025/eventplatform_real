# Googleログイン設定手順

## ステップ1: Google Cloud ConsoleでOAuth認証情報を作成

### 1-1. プロジェクトを作成（既にある場合はスキップ）

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択または新規作成
3. プロジェクト名: `Tomorrow Event Platform`（任意）

### 1-2. OAuth同意画面を設定

1. 左側メニュー → **「APIとサービス」** → **「OAuth同意画面」**
2. **「外部」** を選択 → **「作成」**
3. アプリ情報を入力：
   - **アプリ名**: `Tomorrow Event Platform`
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
4. **「保存して次へ」** をクリック
5. スコープはデフォルトのまま **「保存して次へ」**
6. テストユーザーは後で追加可能 → **「保存して次へ」**
7. **「ダッシュボードに戻る」** をクリック

### 1-3. OAuth 2.0認証情報を作成

1. 左側メニュー → **「APIとサービス」** → **「認証情報」**
2. **「認証情報を作成」** → **「OAuth 2.0 クライアント ID」**
3. アプリケーションの種類: **「ウェブアプリケーション」**
4. 名前: `Tomorrow Event Platform Web`
5. **承認済みのリダイレクト URI** を追加：
   - `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
   - 例: `https://urvtypxjfytvwshvyyeq.supabase.co/auth/v1/callback`
6. **「作成」** をクリック
7. **「クライアント ID」** と **「クライアント シークレット」** をコピー（後で使用）

---

## ステップ2: SupabaseでGoogle認証を有効化

### 2-1. Supabase Dashboardで設定

1. [Supabase Dashboard](https://app.supabase.com/) にアクセス
2. プロジェクトを選択
3. 左側メニュー → **「Authentication」** → **「Providers」**
4. **「Google」** を探してクリック
5. **「Enable Google provider」** をオンにする
6. 以下の情報を入力：
   - **Client ID (for OAuth)**: Google Cloud ConsoleでコピーしたクライアントID
   - **Client Secret (for OAuth)**: Google Cloud Consoleでコピーしたクライアントシークレット
7. **「Save」** をクリック

### 2-2. リダイレクトURLを確認

Supabase Dashboardの **「Authentication」** → **「URL Configuration」** で、以下が正しく設定されているか確認：
- **Site URL**: あなたのアプリのURL（例: `https://store-web-puce.vercel.app`）
- **Redirect URLs**: Google認証のリダイレクトURLが含まれているか確認

---

## ステップ3: 環境変数の確認（Vercel）

Vercelの環境変数は既に設定されているはずですが、確認してください：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

これらが正しく設定されていれば、Google認証は動作します。

---

## 完了後の確認

設定が完了したら、以下のコマンドで動作確認：

1. アプリを起動
2. WelcomeScreenで「Googleでログイン」ボタンをクリック
3. Google認証画面が表示されることを確認
4. 認証後、アプリに戻ってログインできていることを確認

---

## トラブルシューティング

### エラー: "redirect_uri_mismatch"
- Google Cloud Consoleの「承認済みのリダイレクト URI」が正しく設定されているか確認
- SupabaseのリダイレクトURLと一致しているか確認

### エラー: "invalid_client"
- Google Cloud ConsoleのクライアントIDとシークレットが正しいか確認
- Supabase Dashboardの設定が正しいか確認

### 認証後、アプリに戻らない
- Supabase Dashboardの「Site URL」が正しく設定されているか確認
- リダイレクトURLが正しく設定されているか確認

