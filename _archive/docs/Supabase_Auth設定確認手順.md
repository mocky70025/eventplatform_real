# Supabase Auth設定確認手順

## 1. Supabase Dashboardにアクセス

1. [Supabase Dashboard](https://app.supabase.com/) にログイン
2. プロジェクトを選択（`xszkbfwqtwpsfnwdfjak`）

## 2. Email Providerの有効化確認

1. 左メニューから **Authentication** をクリック
2. **Providers** タブをクリック
3. **Email** プロバイダーを探す
4. **Email** の右側にあるトグルスイッチが **ON** になっているか確認
   - OFFの場合は、トグルをクリックしてONにする

## 3. Email設定の確認（オプション）

1. **Authentication** > **Settings** をクリック
2. **Email Auth** セクションで以下を確認：
   - **Enable email confirmations**: メール確認を有効にするか（通常はOFFでOK）
   - **Secure email change**: メール変更時の確認（通常はOFFでOK）

## 4. データベースマイグレーションの実行

1. 左メニューから **SQL Editor** をクリック
2. **New query** をクリック
3. `supabase_email_auth_migration.sql` の内容をコピー＆ペースト
4. **Run** ボタンをクリック
5. エラーがないか確認

## 5. 動作確認

1. アプリケーションにアクセス
2. 「新規登録」を選択
3. 「メールアドレスで新規登録」を選択
4. メールアドレスとパスワードを入力して登録
5. 正常に登録できるか確認

## トラブルシューティング

### Email Providerが表示されない場合

- Supabaseのプロジェクトが正しく選択されているか確認
- ブラウザをリロードしてみる

### マイグレーションSQLでエラーが出る場合

- 既に`user_id`カラムが存在する場合は、エラーが表示されますが、問題ありません
- エラーメッセージを確認して、必要に応じて修正してください

### メールアドレスで登録できない場合

- Email ProviderがONになっているか再確認
- ブラウザのコンソールでエラーメッセージを確認
- Supabase Dashboard > **Authentication** > **Users** でユーザーが作成されているか確認

