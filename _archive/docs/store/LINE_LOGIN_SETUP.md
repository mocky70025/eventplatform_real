# LINE Login セットアップ手順

## 概要

出店者（store）アプリをLIFFとLINE Loginの両方に対応させました。
同じLINEログインチャネルを使用することで、LIFFとLINE Loginで同じユーザーIDを取得できる可能性があります。

## 必要な環境変数

`.env.local` に以下を追加してください：

```env
# 既存の環境変数
NEXT_PUBLIC_SUPABASE_URL=https://wosgrdgnkdaxmykclazc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_LIFF_ID=your_liff_id

# LINE Login用の環境変数（新規追加）
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=your_line_login_channel_id
LINE_LOGIN_CHANNEL_SECRET=your_line_login_channel_secret
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=http://localhost:3001/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## LINE Developersでの設定手順

### 1. LINEログインチャネルの作成

1. [LINE Developers Console](https://developers.line.biz/console/) にログイン
2. プロバイダーを選択（または新規作成）
3. 「チャネルを追加」→「LINEログイン」を選択
4. チャネル情報を入力して作成

### 2. LIFFアプリの追加（同じチャネル内）

1. 作成したLINEログインチャネルの設定画面を開く
2. 「LIFF」タブを選択
3. 「LIFFアプリを追加」をクリック
4. 以下の情報を入力：
   - **アプリ名**: 任意の名前
   - **エンドポイントURL**: `https://your-domain.com`（本番環境のURL）
   - **サイズ**: Full（推奨）
   - **スコープ**: `profile openid email`
5. LIFF IDを取得して `.env.local` の `NEXT_PUBLIC_LIFF_ID` に設定

### 3. LINE Loginの設定

1. 同じLINEログインチャネルの設定画面で「LINEログイン設定」タブを選択
2. **コールバックURL**を設定：
   - 開発環境: `http://localhost:3001/auth/callback`
   - 本番環境: `https://your-domain.com/auth/callback`
3. **Channel ID** を `.env.local` の `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` に設定
4. **Channel Secret** を `.env.local` の `LINE_LOGIN_CHANNEL_SECRET` に設定（サーバーサイドでのみ使用）

## 動作確認手順

### 1. LIFF環境での確認

1. LINEアプリでLIFF URLを開く
2. ブラウザの開発者ツール（DevTools）を開く（可能な場合）
3. コンソールに以下のログが表示されることを確認：
   ```
   [Auth] Mode detected: liff
   [LIFF] Initialized, isLoggedIn: true/false
   [LIFF] User ID: U1234567890abcdef...
   ```
4. ログイン後、ユーザーIDをメモ

### 2. Web環境（LINE Login）での確認

1. 通常のWebブラウザで `http://localhost:3001` を開く
2. ブラウザの開発者ツール（DevTools）を開く
3. コンソールに以下のログが表示されることを確認：
   ```
   [Auth] Mode detected: line_login
   ```
4. 「LINEでログイン」ボタンをクリック
5. LINEログイン画面で認証
6. コールバック後、コンソールに以下のログが表示されることを確認：
   ```
   [LINE Login] User ID: U1234567890abcdef...
   [LINE Login] Display Name: ...
   ```
7. ユーザーIDをメモ

### 3. ユーザーIDの一致確認

**重要**: LIFF環境とWeb環境で取得したユーザーIDが同じかどうかを確認してください。

- **同じ場合**: ✅ 同じチャネルIDを使用することで、同じユーザーIDが取得できています
- **異なる場合**: ⚠️ チャネル設定を確認してください。同じプロバイダー内の同じチャネルを使用しているか確認

## デバッグログ

実装には動作確認用のデバッグログが含まれています。ブラウザのコンソールで以下のログを確認できます：

- `[Auth] Mode detected: ...` - 検出された認証モード
- `[LIFF] Initialized, isLoggedIn: ...` - LIFF初期化状態
- `[LIFF] User ID: ...` - LIFFで取得したユーザーID
- `[LINE Login] User ID: ...` - LINE Loginで取得したユーザーID
- `[LINE Login] Display Name: ...` - LINE Loginで取得した表示名

## トラブルシューティング

### LIFF初期化に失敗する

- `NEXT_PUBLIC_LIFF_ID` が正しく設定されているか確認
- LIFFアプリが正しく作成されているか確認
- LINEアプリ内で開いているか確認

### LINE Loginで認証できない

- `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` が正しく設定されているか確認
- コールバックURLが正しく設定されているか確認
- `LINE_LOGIN_CHANNEL_SECRET` が正しく設定されているか確認（サーバーサイド）

### ユーザーIDが一致しない

- 同じLINEログインチャネル内にLIFFアプリが追加されているか確認
- 同じプロバイダー内のチャネルを使用しているか確認
- LINE Developersの設定を再確認

## 注意事項

1. **セキュリティ**: `LINE_LOGIN_CHANNEL_SECRET` はサーバーサイドでのみ使用してください。クライアントサイドに公開しないでください。

2. **本番環境**: 本番環境では、適切なエラーハンドリングとセキュリティ対策を追加してください。

3. **IDトークンの検証**: 本番環境では、IDトークンの署名検証を行うことを推奨します。

4. **セッション管理**: 現在の実装ではセッションストレージを使用していますが、本番環境ではより安全なセッション管理方法を検討してください。



