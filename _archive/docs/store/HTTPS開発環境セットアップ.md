# HTTPS開発環境セットアップ（LIFF環境対応）

## 概要

LIFF環境でもLINE Login（OAuth）を使用することで、**確実に同じユーザーID**を取得できます。
ただし、LIFF環境ではHTTPSが必要なため、開発環境でもHTTPSを使用する必要があります。

## 方法1: ngrokを使用（推奨）

### 1. ngrokのインストール

```bash
# macOS
brew install ngrok

# または、公式サイトからダウンロード
# https://ngrok.com/download
```

### 2. ngrokアカウントの作成

1. https://ngrok.com/ にアクセス
2. アカウントを作成（無料プランでOK）
3. 認証トークンを取得

### 3. ngrokの認証

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 4. 開発サーバーを起動

```bash
cd store
npm run dev
```

別のターミナルで：

```bash
# store側（ポート3001）
ngrok http 3001

# organizer側（ポート3000）も別途起動する場合
ngrok http 3000
```

### 5. ngrokのURLを確認

ngrokを起動すると、以下のようなURLが表示されます：

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3001
```

この `https://xxxx-xxxx-xxxx.ngrok-free.app` がHTTPSのURLです。

### 6. 環境変数を設定

`.env.local` を更新：

```env
# ngrokのURLを使用
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=https://xxxx-xxxx-xxxx.ngrok-free.app/auth/callback
NEXT_PUBLIC_APP_URL=https://xxxx-xxxx-xxxx.ngrok-free.app
```

### 7. LINE DevelopersでコールバックURLを設定

1. LINE Developers Consoleを開く
2. LINEログインチャネルの設定画面を開く
3. 「LINEログイン設定」タブでコールバックURLを追加：
   ```
   https://xxxx-xxxx-xxxx.ngrok-free.app/auth/callback
   ```

### 8. LIFFアプリのエンドポイントURLを設定

1. 同じLINEログインチャネルの「LIFF」タブを開く
2. LIFFアプリのエンドポイントURLを更新：
   ```
   https://xxxx-xxxx-xxxx.ngrok-free.app
   ```

**⚠️ 注意**: ngrokの無料プランでは、URLが起動のたびに変わります。毎回設定を更新する必要があります。

---

## 方法2: Cloudflare Tunnelを使用（無料・URL固定可能）

### 1. Cloudflare Tunnelのインストール

```bash
# macOS
brew install cloudflared
```

### 2. Cloudflare Tunnelを起動

```bash
# store側（ポート3001）
cloudflared tunnel --url http://localhost:3001

# organizer側（ポート3000）も別途起動する場合
cloudflared tunnel --url http://localhost:3000
```

### 3. URLを確認

Cloudflare Tunnelを起動すると、以下のようなURLが表示されます：

```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://xxxx-xxxx.trycloudflare.com                                                      |
+--------------------------------------------------------------------------------------------+
```

このURLを使用して設定を行います。

---

## 方法3: ローカルHTTPS証明書を使用（上級者向け）

### 1. mkcertをインストール

```bash
# macOS
brew install mkcert

# ローカルCAをインストール
mkcert -install
```

### 2. 証明書を生成

```bash
cd store
mkcert localhost 127.0.0.1 ::1
```

### 3. Next.jsでHTTPSを使用

`next.config.js` を更新してHTTPSを有効化（カスタムサーバーが必要）

---

## 推奨方法

**開発環境**: ngrokを使用（最も簡単）
**本番環境**: 通常のHTTPS（Vercel、Netlifyなど）

---

## 動作確認

1. **ngrokを起動**してHTTPSのURLを取得
2. **環境変数を設定**
3. **LINE DevelopersでコールバックURLとLIFFエンドポイントURLを設定**
4. **開発サーバーを起動**
5. **LIFF環境（LINEアプリ内）で動作確認**
6. **Web環境（ブラウザ）で動作確認**
7. **両方で同じユーザーIDが取得できることを確認**

---

## トラブルシューティング

### ngrokのURLが変わった

- 無料プランでは起動のたびにURLが変わります
- 毎回環境変数とLINE Developersの設定を更新してください
- または、有料プランで固定URLを使用できます

### HTTPS接続エラー

- ngrokが正しく起動しているか確認
- 環境変数が正しく設定されているか確認
- LINE DevelopersのコールバックURLが正しいか確認



