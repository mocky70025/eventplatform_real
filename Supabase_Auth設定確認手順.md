# Supabase Auth設定確認手順

## 1. Supabase Dashboardにアクセス

1. [Supabase Dashboard](https://app.supabase.com/) にログイン
2. プロジェクトを選択（`xszkbfwqtwpsfnwdfjak`）

## 2. Email Providerの有効化確認

1. 左サイドバーから **「Authentication」** をクリック
2. **「Providers」** タブを選択
3. **「Email」** を探す
4. **「Email」** の右側にあるトグルスイッチが **ON（緑色）** になっているか確認
   - OFF（灰色）の場合は、クリックしてONにする

## 3. Email設定の確認（オプション）

1. **「Authentication」** > **「Settings」** を開く
2. **「Email Auth」** セクションで以下を確認：
   - **「Enable email confirmations」**: メール確認を有効にするか（デフォルトはOFFでOK）
   - **「Secure email change」**: メール変更時の確認（デフォルトでOK）

## 4. 動作確認

設定が完了したら、以下の手順で動作確認できます：

1. アプリで「メールアドレスでログイン」を選択
2. メールアドレスとパスワードを入力
3. ログインできることを確認

## トラブルシューティング

### Email Providerが見つからない場合

- Supabaseのプロジェクトが正しく選択されているか確認
- プロジェクトのURLが `https://xszkbfwqtwpsfnwdfjak.supabase.co` であることを確認

### ログインできない場合

1. ブラウザのコンソール（F12）でエラーメッセージを確認
2. Supabase Dashboard > Authentication > Users でユーザーが作成されているか確認
3. Email ProviderがONになっているか再確認

## 次のステップ

設定確認が完了したら、`supabase_email_auth_migration.sql` を実行してください。

