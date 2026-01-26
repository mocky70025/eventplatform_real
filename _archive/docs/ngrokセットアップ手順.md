# 開発環境セットアップ手順（ngrok + LINE Login）

## 概要

開発環境でLIFF環境とWeb環境の両方でLINE Login（OAuth）を使用するためのセットアップ手順です。
ngrokを使用してHTTPS環境を構築し、**確実に同じユーザーID**を取得できるようにします。

## 前提条件

- ✅ ngrokがインストール済み（バージョン 3.30.0）
- ⚠️ 認証トークンの設定が必要
- LINE DevelopersでLINEログインチャネルを作成済み

---

## ステップ1: ngrokアカウントのセットアップ

### 1-1. ngrokアカウントを作成

1. https://ngrok.com/ にアクセス
2. 「Sign up」をクリック
3. メールアドレスでアカウントを作成（無料プランでOK）

### 1-2. 認証トークンを取得

1. ログイン後、ダッシュボード（https://dashboard.ngrok.com/）にアクセス
2. 「Your Authtoken」セクションで認証トークンをコピー
   - 例: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### 1-3. 認証トークンを設定

ターミナルで以下のコマンドを実行：

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

`YOUR_AUTH_TOKEN` を実際の認証トークンに置き換えてください。

### 1-4. 設定の確認

```bash
ngrok config check
```

正しく設定されていれば、設定ファイルのパスが表示されます。

---

## ステップ2: 開発サーバーの起動

### 2-1. store側（出店者アプリ）を起動

ターミナル1で：

```bash
cd store
npm run dev
```

ポート3001で起動します。

### 2-2. organizer側（主催者アプリ）を起動（オプション）

ターミナル2で：

```bash
cd organizer
npm run dev
```

ポート3002で起動します。

---

## ステップ3: ngrokの起動

### 3-1. store側のngrokを起動

ターミナル3で：

```bash
ngrok http 3001
```

### 3-2. organizer側のngrokを起動（オプション）

ターミナル4で：

```bash
ngrok http 3002
```

### 3-3. ngrokのURLを確認

ngrokを起動すると、以下のような出力が表示されます：

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3001
```

この `https://xxxx-xxxx-xxxx.ngrok-free.app` がHTTPSのURLです。

**重要**: このURLをメモしてください。以下の設定で使用します。

---

## ステップ4: 環境変数の設定

### 4-1. store側の環境変数を設定

`store/.env.local` を作成（または更新）して、以下のように設定：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://wosgrdgnkdaxmykclazc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc2dyZGdua2RheG15a2NsYXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjU4OTksImV4cCI6MjA3ODkwMTg5OX0.tAB-e53Xf8Lif8yzpJCoXsmnKM_oTAiVEMbETo4ivSg

# LINE Login設定
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2008516155
LINE_LOGIN_CHANNEL_SECRET=4b6ca4be9c0ae7e856bb4db72c777876
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://xxxx-xxxx-xxxx.ngrok-free.app/auth/callback
NEXT_PUBLIC_APP_URL=https://xxxx-xxxx-xxxx.ngrok-free.app
```

`xxxx-xxxx-xxxx` を実際のngrokのURLに置き換えてください。

### 4-2. organizer側の環境変数を設定（オプション）

`organizer/.env.local` を作成（または更新）して、以下のように設定：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://wosgrdgnkdaxmykclazc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc2dyZGdua2RheG15a2NsYXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjU4OTksImV4cCI6MjA3ODkwMTg5OX0.tAB-e53Xf8Lif8yzpJCoXsmnKM_oTAiVEMbETo4ivSg

# LINE Login設定
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2008516155
LINE_LOGIN_CHANNEL_SECRET=4b6ca4be9c0ae7e856bb4db72c777876
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://yyyy-yyyy-yyyy.ngrok-free.app/auth/callback
NEXT_PUBLIC_APP_URL=https://yyyy-yyyy-yyyy.ngrok-free.app
```

`yyyy-yyyy-yyyy` を実際のorganizer側のngrokのURLに置き換えてください。

**⚠️ 重要**: 
- store側とorganizer側で**同じLINEログインチャネルID**を使用してください
- これにより、確実に同じユーザーIDが取得できます

---

## ステップ5: LINE Developersで設定

### 5-1. コールバックURLを設定

LINE Developers Consoleで、使用しているLINEログインチャネルの設定画面を開き、「LINEログイン設定」タブで以下を追加：

**store側（出店者アプリ）**:
```
https://xxxx-xxxx-xxxx.ngrok-free.app/auth/callback
```

**organizer側（主催者アプリ）**（オプション）:
```
https://yyyy-yyyy-yyyy.ngrok-free.app/auth/callback
```

### 5-2. LIFFアプリのエンドポイントURLを設定

1. 同じLINEログインチャネルの「LIFF」タブを開く
2. LIFFアプリのエンドポイントURLを更新：
   ```
   https://xxxx-xxxx-xxxx.ngrok-free.app
   ```
   （store側のngrok URLを使用）

**⚠️ 注意**: 
- LIFFアプリのエンドポイントURLは、store側のngrok URLを設定してください
- organizer側用のLIFFアプリも必要であれば追加できます

---

## ステップ6: 開発サーバーの再起動

環境変数を変更したら、開発サーバーを再起動してください：

```bash
# store側
cd store
npm run dev

# organizer側（オプション）
cd organizer
npm run dev
```

---

## ステップ7: 動作確認

### 7-1. Web環境での確認

1. **store側**: `https://xxxx-xxxx-xxxx.ngrok-free.app` を開く
2. LINEログインを実行
3. ユーザーIDをメモ

4. **organizer側**: `https://yyyy-yyyy-yyyy.ngrok-free.app` を開く（オプション）
5. LINEログインを実行
6. ユーザーIDをメモ

7. **確認**: 両方で同じユーザーIDが取得できることを確認 ✅

### 7-2. LIFF環境での確認

1. LINEアプリでLIFF URLを開く
2. LINEログインを実行
3. ユーザーIDをメモ

4. **確認**: Web環境と同じユーザーIDが取得できることを確認 ✅

---

## 重要なポイント

### ✅ 確実に同じユーザーIDを取得する方法

1. **同じLINEログインチャネルIDを使用**
   - store側とorganizer側で同じチャネルIDを使用
   - これにより、確実に同じユーザーIDが取得できます

2. **LIFF環境でもLINE Login（OAuth）を使用**
   - 実装では、LIFF環境でもWeb環境でもLINE Login（OAuth）を使用
   - 同じチャネルIDを使用することで、確実に同じユーザーIDが取得できます

3. **開発環境ではngrokでHTTPSを使用**
   - LIFF環境ではHTTPSが必要
   - ngrokを使用することで、開発環境でもHTTPSを使用できます

---

## 注意事項

### ngrokの無料プランの制限

- ⚠️ ngrokの無料プランでは、起動のたびにURLが変わります
- ⚠️ 毎回環境変数とLINE Developersの設定を更新する必要があります
- 💡 有料プランでは固定URLを使用できます

### URLが変わった場合の対応

1. ngrokを再起動して新しいURLを取得
2. `store/.env.local` と `organizer/.env.local` を更新
3. LINE DevelopersのコールバックURLとLIFFエンドポイントURLを更新
4. 開発サーバーを再起動

---

## トラブルシューティング

### 認証エラーが出る場合

- 認証トークンが正しく設定されているか確認
- `ngrok config check` で設定を確認

### URLが取得できない場合

- ngrokが正しく起動しているか確認
- `http://localhost:4040` にアクセスしてngrokのWeb UIを確認

### ユーザーIDが一致しない場合

- store側とorganizer側で同じLINEログインチャネルIDを使用しているか確認
- 環境変数が正しく設定されているか確認
- LINE Developersの設定を再確認

### LIFF環境でエラーが出る場合

- LIFFアプリのエンドポイントURLが正しく設定されているか確認
- ngrokが正しく起動しているか確認
- LINE Developersの設定を再確認

---

## 完了チェックリスト

- [ ] ngrokアカウントを作成
- [ ] ngrokの認証トークンを設定
- [ ] store側の開発サーバーを起動
- [ ] organizer側の開発サーバーを起動（オプション）
- [ ] store側のngrokを起動
- [ ] organizer側のngrokを起動（オプション）
- [ ] store側の環境変数を設定
- [ ] organizer側の環境変数を設定（オプション）
- [ ] LINE DevelopersでコールバックURLを設定
- [ ] LINE DevelopersでLIFFエンドポイントURLを設定
- [ ] 開発サーバーを再起動
- [ ] Web環境で動作確認
- [ ] LIFF環境で動作確認
- [ ] 両方で同じユーザーIDが取得できることを確認

---

## まとめ

開発環境では、ngrokを使用してHTTPS環境を構築し、LIFF環境でもWeb環境でもLINE Login（OAuth）を使用できます。
同じLINEログインチャネルIDを使用することで、**確実に同じユーザーID**を取得できます。

本番環境では、通常のHTTPS（Vercelなど）を使用するため、ngrokは不要です。


