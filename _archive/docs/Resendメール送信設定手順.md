# Resendメール送信設定手順

## 概要

申し込み締め切り時に、主催者にスプレッドシートのリンクをメール送信する機能を実装するための設定手順です。

---

## ステップ1: Resendアカウントを作成

1. **Resendにアクセス**
   - https://resend.com/ にアクセス
   - 「Sign Up」をクリックしてアカウントを作成

2. **メールアドレスを確認**
   - 登録したメールアドレスに確認メールが送信されます
   - メール内のリンクをクリックして確認

---

## ステップ2: APIキーを取得

1. **Resend Dashboardにログイン**
   - https://resend.com/dashboard にアクセス

2. **API Keysを開く**
   - 左メニューから「API Keys」を選択

3. **APIキーを作成**
   - 「Create API Key」をクリック
   - 名前を入力（例: `tomorrow-event-platform`）
   - 権限: 「Sending access」を選択
   - 「Add」をクリック

4. **APIキーをコピー**
   - 作成されたAPIキーをコピー（表示されるのは一度だけなので、必ずコピーしてください）

---

## ステップ3: ドメインを設定（オプション）

### オプションA: 独自ドメインを使用する場合

1. **Domainsを開く**
   - 左メニューから「Domains」を選択

2. **ドメインを追加**
   - 「Add Domain」をクリック
   - ドメイン名を入力（例: `yourdomain.com`）

3. **DNSレコードを設定**
   - Resendが提供するDNSレコードを、ドメインのDNS設定に追加
   - 設定完了まで数時間かかる場合があります

### オプションB: Resendのドメインを使用する場合（開発用）

- Resendが提供するデフォルトのドメイン（`onboarding.resend.com`）を使用できます
- 本番環境では独自ドメインの使用を推奨します

---

## ステップ4: 環境変数を設定

### Vercel（organizer-webプロジェクト）

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard
   - `organizer-web`プロジェクトを選択

2. **「Settings」> 「Environment Variables」を開く**

3. **以下の環境変数を追加**：

#### 環境変数1: RESEND_API_KEY
- **Key**: `RESEND_API_KEY`
- **Value**: ステップ2で取得したAPIキー
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

#### 環境変数2: RESEND_FROM_EMAIL
- **Key**: `RESEND_FROM_EMAIL`
- **Value**: 送信元メールアドレス
  - 独自ドメインを使用する場合: `noreply@yourdomain.com`
  - Resendのドメインを使用する場合: `onboarding@resend.dev`（Resendが提供するデフォルト）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- 「Add」をクリック

---

## ステップ5: 再デプロイ

1. **Vercel Dashboardで「Deployments」タブを開く**
2. **最新のデプロイメントの「...」メニュー > 「Redeploy」を選択**
3. **「Use existing Build Cache」のチェックを外す**
4. **「Redeploy」をクリック**

---

## 確認

- [ ] Resendアカウントが作成されている
- [ ] APIキーが取得されている
- [ ] ドメインが設定されている（オプション）
- [ ] Vercelの環境変数が2つすべて設定されている
- [ ] 再デプロイが完了している

---

## トラブルシューティング

### エラー: "Invalid API key"
- APIキーが正しく設定されているか確認
- APIキーに「Sending access」権限があるか確認

### エラー: "Domain not verified"
- 独自ドメインを使用する場合、DNSレコードが正しく設定されているか確認
- ドメインの検証が完了するまで数時間かかる場合があります

### メールが届かない
- Resend Dashboardの「Logs」タブで送信ログを確認
- スパムフォルダを確認
- 送信元メールアドレスが正しく設定されているか確認

---

## 注意事項

1. **無料プランの制限**
   - Resendの無料プランでは、月100通まで送信可能です
   - それ以上は有料プランが必要です

2. **送信元メールアドレス**
   - 独自ドメインを使用する場合、DNSレコードの設定が必要です
   - 開発環境では、Resendのデフォルトドメインを使用できます

3. **セキュリティ**
   - APIキーは機密情報です。絶対に公開しないでください
   - 環境変数はVercelの設定で管理してください

---

## 次のステップ

環境変数の設定が完了したら、申し込み締め切り機能の動作確認を行ってください。

