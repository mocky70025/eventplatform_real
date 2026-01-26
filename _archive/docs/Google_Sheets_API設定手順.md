# Google Sheets API設定手順

## 概要

イベントの申し込み締め切り時に、出店者情報をGoogleスプレッドシートにエクスポートする機能を実装するための設定手順です。

---

## ステップ1: Google Cloud Consoleでプロジェクトを作成

1. **Google Cloud Consoleにアクセス**
   - https://console.cloud.google.com/ にアクセス
   - Googleアカウントでログイン

2. **新しいプロジェクトを作成**
   - 上部のプロジェクト選択ドロップダウンをクリック
   - 「新しいプロジェクト」をクリック
   - プロジェクト名を入力（例: `tomorrow-event-platform`）
   - 「作成」をクリック

3. **プロジェクトを選択**
   - 作成したプロジェクトを選択

---

## ステップ2: Google Sheets APIを有効化

1. **APIとサービス > ライブラリ**を開く
2. **「Google Sheets API」を検索**
3. **「Google Sheets API」を選択**
4. **「有効にする」をクリック**

---

## ステップ3: サービスアカウントを作成

1. **APIとサービス > 認証情報**を開く
2. **「認証情報を作成」> 「サービスアカウント」を選択**
3. **サービスアカウントの詳細を入力**
   - サービスアカウント名: `tomorrow-sheets-service`
   - サービスアカウントID: 自動生成（変更可能）
   - 説明: `Google Sheets API用のサービスアカウント`
4. **「作成して続行」をクリック**
5. **ロールはスキップ**（「続行」をクリック）
6. **「完了」をクリック**

---

## ステップ4: サービスアカウントの認証情報を取得

1. **作成したサービスアカウントをクリック**
2. **「キー」タブを選択**
3. **「キーを追加」> 「新しいキーを作成」をクリック**
4. **キーのタイプ: 「JSON」を選択**
5. **「作成」をクリック**
6. **JSONファイルがダウンロードされる**（このファイルを安全に保管）

---

## ステップ5: Googleスプレッドシートを作成

1. **Googleスプレッドシートを新規作成**
   - https://sheets.google.com/ にアクセス
   - 「空白」をクリックして新しいスプレッドシートを作成

2. **スプレッドシートのIDを取得**
   - URLからスプレッドシートIDを取得
   - 例: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `SPREADSHEET_ID`の部分をコピー

3. **サービスアカウントに共有権限を付与**
   - スプレッドシートの「共有」ボタンをクリック
   - ステップ4で取得したJSONファイル内の`client_email`の値をコピー
   - 共有先にサービスアカウントのメールアドレス（`client_email`）を入力
   - 権限: **「編集者」**を選択
   - 「送信」をクリック

---

## ステップ6: 環境変数を設定

### Vercelの環境変数設定

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard

2. **`organizer-web`プロジェクトを選択**

3. **「Settings」> 「Environment Variables」を開く**

4. **以下の環境変数を追加**：

#### 環境変数1: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Key**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: JSONファイル内の`client_email`の値
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック

#### 環境変数2: GOOGLE_PRIVATE_KEY
- **Key**: `GOOGLE_PRIVATE_KEY`
- **Value**: JSONファイル内の`private_key`の値（**改行文字を含む完全な値**）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- ⚠️ **重要**: `\n`がエスケープされている場合は、そのまま使用してください（コード内で処理します）

#### 環境変数3: GOOGLE_SPREADSHEET_ID
- **Key**: `GOOGLE_SPREADSHEET_ID`
- **Value**: ステップ5で取得したスプレッドシートID
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック

#### 環境変数4: SUPABASE_SERVICE_ROLE_KEY
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Supabase Dashboard > Settings > API > `service_role` key
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック
- ⚠️ **重要**: このキーは機密情報です。絶対に公開しないでください。

---

## ステップ7: 再デプロイ

1. **Vercel Dashboardで「Deployments」タブを開く**
2. **最新のデプロイメントの「...」メニュー > 「Redeploy」を選択**
3. **「Use existing Build Cache」のチェックを外す**
4. **「Redeploy」をクリック**

---

## 確認

- [ ] Google Sheets APIが有効化されている
- [ ] サービスアカウントが作成されている
- [ ] サービスアカウントのJSONファイルがダウンロードされている
- [ ] Googleスプレッドシートが作成されている
- [ ] サービスアカウントにスプレッドシートの共有権限が付与されている
- [ ] Vercelの環境変数が4つすべて設定されている
- [ ] 再デプロイが完了している

---

## トラブルシューティング

### エラー: "Missing Google Sheets environment variables"
- 環境変数が正しく設定されているか確認
- 特に`GOOGLE_PRIVATE_KEY`の値が完全か確認（改行文字を含む）

### エラー: "Permission denied"
- サービスアカウントにスプレッドシートの共有権限が付与されているか確認
- サービスアカウントのメールアドレス（`client_email`）が正しいか確認

### エラー: "Spreadsheet not found"
- `GOOGLE_SPREADSHEET_ID`が正しいか確認
- スプレッドシートのURLからIDを正しく取得できているか確認

---

## 次のステップ

環境変数の設定が完了したら、申し込み締め切り機能の動作確認を行ってください。

