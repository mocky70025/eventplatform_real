# Vercelデプロイ手順書

このプロジェクトは3つの独立したNext.jsアプリケーション（`store`、`organizer`、`admin`）で構成されています。それぞれを別々のVercelプロジェクトとしてデプロイします。

## 前提条件

- Vercelアカウントを持っていること
- GitHub/GitLab/Bitbucketにリポジトリをプッシュ済みであること
- Supabaseプロジェクトが本番環境で利用可能であること

## デプロイ手順

### 1. Storeアプリ（出店者向け）のデプロイ

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「Add New...」→「Project」を選択
3. リポジトリを選択（またはインポート）
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `store`
   - **Build Command**: `npm run build`（自動検出されるはず）
   - **Output Directory**: `.next`（自動検出されるはず）
   - **Install Command**: `npm install`

5. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   LINE_CHANNEL_ID=your_line_channel_id
   LINE_CHANNEL_SECRET=your_line_channel_secret
   OPENAIAPI=your_openai_api_key
   ```

6. 「Deploy」をクリック

### 2. Organizerアプリ（主催者向け）のデプロイ

1. 再度「Add New...」→「Project」を選択
2. 同じリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `organizer`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   LINE_CHANNEL_ID=your_line_channel_id
   LINE_CHANNEL_SECRET=your_line_channel_secret
   ```

5. 「Deploy」をクリック

### 3. Adminアプリ（管理者向け）のデプロイ

1. 再度「Add New...」→「Project」を選択
2. 同じリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. 「Deploy」をクリック

## デプロイ後の確認事項

### 1. ビルドエラーの確認
各デプロイのログを確認し、ビルドエラーがないか確認してください。

### 2. 環境変数の確認
Vercelのプロジェクト設定 → Environment Variables で、すべての環境変数が正しく設定されているか確認してください。

### 3. 動作確認
各アプリのURLにアクセスして、以下を確認：
- ✅ ログインページが表示される
- ✅ Supabase認証が動作する
- ✅ データの取得・表示が正常に動作する

### 4. カスタムドメインの設定（オプション）
必要に応じて、各アプリにカスタムドメインを設定できます：
- Store: `store.yourdomain.com`
- Organizer: `organizer.yourdomain.com`
- Admin: `admin.yourdomain.com`

## トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数が設定されていない**
   - Vercelのプロジェクト設定で環境変数を確認
   - `.env.local`の内容をVercelの環境変数にコピー

2. **TypeScriptエラー**
   - ローカルで`npm run build`を実行してエラーを確認
   - エラーを修正してから再デプロイ

3. **依存関係のエラー**
   - `package.json`の依存関係を確認
   - `package-lock.json`をコミットしているか確認

### 本番環境で動作しない場合

1. **SupabaseのRLSポリシー**
   - 本番環境のSupabaseでRLSポリシーが正しく設定されているか確認
   - `supabase/add_*.sql`ファイルを実行してポリシーを適用

2. **認証リダイレクトURL**
   - Supabaseの認証設定で、VercelのURLをリダイレクトURLに追加
   - 例: `https://your-store-app.vercel.app/auth/callback`

3. **CORS設定**
   - Supabaseの設定で、VercelのURLを許可リストに追加

## 注意事項

⚠️ **セキュリティ**
- `SUPABASE_SERVICE_ROLE_KEY`は機密情報です。GitHubにコミットしないでください
- 環境変数はVercelのダッシュボードで管理し、`.env.local`は`.gitignore`に含まれていることを確認

⚠️ **本番環境のSupabase**
- 本番環境では、開発環境とは別のSupabaseプロジェクトを使用することを推奨
- データベースのマイグレーション（`supabase/schema.sql`など）を本番環境に適用

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-to-prod)
